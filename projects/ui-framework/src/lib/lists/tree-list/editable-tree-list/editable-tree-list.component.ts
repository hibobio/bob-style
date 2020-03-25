import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { arrayInsertAt } from '../../../services/utils/functional-utils';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BaseEditableTreeListElement } from './editable-tree-list.abstract';
import { TreeListOption, itemID, TreeListItem } from '../tree-list.interface';
import { TreeListModelService } from '../services/tree-list-model.service';
import { TreeListModelUtils } from '../services/tree-list-model.static';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { TreeListViewService } from '../services/tree-list-view.service';
import {
  TreeListGetItemEditContext,
  InsertItemLocation,
} from './editable-tree-list.interface';
import { TreeListEditUtils } from '../services/tree-list-edit.static';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';

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
    DOM: DOMhelpers,
    cd: ChangeDetectorRef,
    host: ElementRef
  ) {
    super(modelSrvc, cntrlsSrvc, viewSrvc, DOM, cd, host);
  }

  public draggingIndex: number;
  public dragHoverIndex: number;

  public maxDepth = 10;
  public depth = 0;

  protected listViewModelToList(
    listViewModel: itemID[] = this.listViewModel
  ): TreeListOption[] {
    const processed: Set<itemID> = new Set();

    const reducer = (acc: TreeListOption[], id: itemID) => {
      const item = this.itemsMap.get(id);

      if (
        processed.has(item.id) ||
        (!item.childrenCount && !item.name.trim())
      ) {
        return acc;
      }

      processed.add(item.id);

      const itemOut: TreeListOption = {
        [this.keyMap.id]: item.id,
        [this.keyMap.name]: item.name.trim() || 'Untitled',
      };

      if (item.childrenCount) {
        itemOut[this.keyMap.children] = item.childrenIDs.reduce(reducer, []);
      }

      acc.push(itemOut);

      return acc;
    };

    return listViewModel.reduce(reducer, []);
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
        if (!item.childrenCount) {
          this.deleteItem(item);
        }
      }
    }
  }

  public onDragstart(item: TreeListItem, indexInView: number) {
    if (item.childrenCount && !item.collapsed) {
      this.setListCSS('height');
      this.toggleItemCollapsed(item, null, true);
      item.expandMe = true;
    }

    this.draggingIndex = indexInView;
    this.dragHoverIndex = indexInView;
  }

  public onDragEnd(item: TreeListItem) {
    this.draggingIndex = this.dragHoverIndex = undefined;

    if (item.expandMe) {
      this.toggleItemCollapsed(item, null, false);
      this.setListCSS('remove-height');
      delete item.expandMe;
    }
  }

  public onListHover(event: MouseEvent): void {
    if (this.draggingIndex === undefined) {
      return;
    }
    const target = event.target as HTMLInputElement;
    const itemElement = target.closest('.betl-item');

    if (!itemElement) {
      return;
    }

    this.dragHoverIndex = parseInt(itemElement.getAttribute('data-index'), 10);
  }

  public getDragState(index: number) {
    return this.draggingIndex === index
      ? 'dragged'
      : (this.draggingIndex < index && this.dragHoverIndex === index) ||
        (this.draggingIndex > index + 1 && this.dragHoverIndex === index + 1)
      ? 'drag-hover-below'
      : this.draggingIndex > index &&
        this.dragHoverIndex === index &&
        index === 0
      ? 'drag-hover-above'
      : null;
  }

  public onItemDrop(event: CdkDragDrop<any>): void {
    // console.log('onItemDrop', event);
    const prevIndex = event.item.data.origIndex;
    const newIndex = event.currentIndex;

    if (prevIndex === newIndex) {
      return;
    }

    const item: TreeListItem = event.item.data.item;

    console.log(`DROP ${item.id}: ${prevIndex} => ${newIndex}`);

    this.moveItem(item, newIndex, null);

    // this.cd.detectChanges();
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

    parent.childrenCount = parent.childrenIDs.length;

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

    this.setListCSS('width');

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
    parent.childrenCount = parent.childrenIDs.length;

    this.listViewModel = this.listViewModel.filter(id => id !== item.id);

    this.insertItem(item, where, target, context);
    item.moved = true;
    item.parentIDs.push(parent.id);
    ++item.parentCount;

    return item;
  }

  public increaseIndent(
    item: TreeListItem,
    indexInView: number = null
  ): TreeListItem {
    if (indexInView === null) {
      indexInView = this.listViewModel.findIndex(id => id === item.id) || 0;
    }

    console.log('increaseIndent', item, indexInView);

    let counter = 1;
    let previtemID = this.listViewModel[indexInView - counter];
    let prevItem = this.itemsMap.get(previtemID);

    console.log('increaseIndent prevItem 1', prevItem.id);

    while (
      indexInView - counter > 0 &&
      prevItem.parentCount > item.parentCount
    ) {
      previtemID = this.listViewModel[indexInView - ++counter];
      prevItem = this.itemsMap.get(previtemID);
    }

    console.log('increaseIndent prevItem 2', prevItem.id, prevItem);

    if (!prevItem || item.parentIDs.includes(previtemID)) {
      return;
    }

    if (prevItem.collapsed) {
      console.log('should expand');
      this.toggleItemCollapsed(prevItem, null, false);
    }

    this.moveItem(item, 'lastChildOf', prevItem);

    this.cd.detectChanges();

    this.emitChange();

    return item;
  }
}
