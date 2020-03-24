import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  ElementRef,
  QueryList,
} from '@angular/core';
import { arrayInsertAt } from '../../../services/utils/functional-utils';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BaseEditableTreeListElement } from './editable-tree-list.abstract';
import { TreeListOption, itemID, TreeListItem } from '../tree-list.interface';
import { TreeListModelService } from '../services/tree-list-model.service';
import { TreeListModelUtils } from '../services/tree-list-model.static';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { InsertItemLocation } from './editable-tree-list.enum';
import { TreeListViewService } from '../services/tree-list-view.service';
import { TreeListGetItemEditContext } from './editable-tree-list.interface';
import { TreeListEditUtils } from '../services/tree-list-edit.static';

@Component({
  selector: 'b-editable-tree-list',
  templateUrl: './editable-tree-list.component.html',
  styleUrls: ['./editable-tree-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableTreeListComponent extends BaseEditableTreeListElement {
  constructor(
    modelSrvc: TreeListModelService,
    cntrlsSrvc: TreeListControlsService,
    viewSrvc: TreeListViewService,
    cd: ChangeDetectorRef
  ) {
    super(modelSrvc, cntrlsSrvc, viewSrvc, cd);
  }

  public isDragging = [];

  protected listToListViewModel(): itemID[] {
    this.listViewModel = this.modelSrvc.getListViewModel(
      this.list,
      this.itemsMap,
      {
        viewFilter: this.viewFilter,
        expand: true,
        keyMap: this.keyMap,
      }
    );

    return this.listViewModel;
  }

  private listViewModelToList(
    listViewModel: itemID[] = this.listViewModel
  ): TreeListOption[] {
    const processed: Set<itemID> = new Set();

    const reducer = (acc: TreeListOption[], id: itemID) => {
      const item = this.itemsMap.get(id);

      if (processed.has(item.id) || !item.name.trim()) {
        return acc;
      }

      processed.add(item.id);

      const itemOut: TreeListOption = {
        [this.keyMap.id]: item.id,
        [this.keyMap.name]: item.name,
      };

      if (item.childrenCount) {
        itemOut[this.keyMap.children] = item.childrenIDs.reduce(reducer, []);
      }

      acc.push(itemOut);

      return acc;
    };

    return listViewModel.reduce(reducer, []);
  }

  public emitChange(): void {
    this.list = this.listViewModelToList();
    this.changed.emit(this.list);
  }

  public toggleItemCollapsed(item: TreeListItem, force: boolean = null): void {
    TreeListModelUtils.toggleItemCollapsed(item, this.itemsMap, force, true);
    this.cd.detectChanges();
  }

  public onListClick(event: MouseEvent): void {
    this.cntrlsSrvc.onListClick(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      itemClick: () => {},
    });
  }

  public onListKeyDown(event: KeyboardEvent): void {
    this.cntrlsSrvc.onEditableListKeyDown(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      insertNewItem: this.insertNewItem.bind(this),
      deleteItem: this.deleteItem.bind(this),
      makeItemPreviouSiblingChild: this.makeItemPreviouSiblingChild.bind(this),
    });
  }

  public onListBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;

    if (target.matches('.betl-item-input')) {
      if (target.value.trim()) {
        this.emitChange();
      } else {
        const { item } = this.viewSrvc.getItemFromEl(
          target,
          this.itemsMap,
          this.listViewModel
        );
        this.deleteItem(item);
      }
    }
  }

  public onItemDrop(event: CdkDragDrop<any>): void {
    console.log(event);

    const item: TreeListItem = event.item.data;
  }

  public insertItem(
    item: TreeListItem,
    where: InsertItemLocation,
    target: TreeListItem,
    context: TreeListGetItemEditContext = null
  ): TreeListItem {
    const { parent, insertionIndexInParent, insertionIndexInViewModel } =
      context ||
      TreeListEditUtils.getItemEditContext(
        where,
        target,
        this.itemsMap,
        this.listViewModel
      );

    parent.childrenIDs = arrayInsertAt(
      parent.childrenIDs,
      item.id,
      insertionIndexInParent
    );

    parent.childrenCount = TreeListModelUtils.filteredChildrenCount(
      parent,
      this.itemsMap,
      this.viewFilter
    );

    this.listViewModel = arrayInsertAt(
      this.listViewModel,
      item.id,
      insertionIndexInViewModel
    );

    this.cd.detectChanges();

    this.viewSrvc.findAndFocusInput(
      this.listElement.nativeElement.querySelector(`[data-id="${item.id}"]`),
      'start'
    );

    return item;
  }

  public deleteItem(
    item: TreeListItem,
    context: TreeListGetItemEditContext = null
  ): TreeListItem {
    const parent =
      context?.parent ||
      this.itemsMap.get(item.parentIDs[item.parentCount - 1]);

    TreeListModelUtils.setPropToTreeDown(
      item,
      {
        deleted: true,
        parentCount: 0,
        parentIDs: [],
      },
      this.itemsMap
    );

    parent.childrenIDs = parent.childrenIDs.filter(id => id !== item.id);

    parent.childrenCount = TreeListModelUtils.filteredChildrenCount(
      parent,
      this.itemsMap,
      this.viewFilter
    );

    this.listViewModel = this.listViewModel.filter(
      id => !this.itemsMap.get(id).deleted
    );

    this.cd.detectChanges();

    this.emitChange();

    return item;
  }

  public insertNewItem(
    where: InsertItemLocation,
    target: TreeListItem
  ): TreeListItem {
    const context = TreeListEditUtils.getItemEditContext(
      where,
      target,
      this.itemsMap,
      this.listViewModel
    );

    console.log('insertNewItem', where, context);

    if (where === 'after' && !target.name.trim()) {
      return;
    }

    const newItem = TreeListEditUtils.newItem(
      context.sibling && {
        parentIDs: context.sibling.parentIDs.slice(),
        parentCount: context.sibling.parentCount,
      }
    );

    TreeListModelUtils.updateMap(this.itemsMap, newItem.id, newItem);

    if (
      (where === 'firstChildOf' || where === 'lastChildOf') &&
      context.parent.collapsed
    ) {
      this.toggleItemCollapsed(context.parent);
    }

    this.insertItem(newItem, where, target, context);

    this.emitChange();

    return newItem;
  }

  public moveItem(
    item: TreeListItem,
    where: InsertItemLocation,
    target: TreeListItem
  ): TreeListItem {
    const context = TreeListEditUtils.getItemEditContext(
      where,
      target,
      this.itemsMap,
      this.listViewModel
    );

    const { parent } = context;

    parent.childrenIDs = parent.childrenIDs?.filter(id => id !== item.id) || [];
    parent.childrenCount = TreeListModelUtils.filteredChildrenCount(
      parent,
      this.itemsMap,
      this.viewFilter
    );

    this.listViewModel = this.listViewModel.filter(id => id !== item.id);

    this.insertItem(item, where, target, context);
    item.moved = true;
    item.parentIDs.push(parent.id);
    ++item.parentCount;

    return item;
  }

  public makeItemPreviouSiblingChild(
    item: TreeListItem,
    indexInView: number
  ): TreeListItem {
    const previtemID = this.listViewModel[indexInView - 1];
    const prevItem = this.itemsMap.get(previtemID);

    if (!prevItem || item.parentIDs.includes(previtemID)) {
      return;
    }

    this.moveItem(item, 'lastChildOf', prevItem);

    this.cd.detectChanges();

    this.emitChange();

    return item;
  }
}
