import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { arrayInsertAt } from '../../../services/utils/functional-utils';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BaseEditableTreeListElement } from './editable-tree-list.abstract';
import { TreeListItem } from '../tree-list.interface';
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

  public deleteItem(
    item: TreeListItem,
    context: TreeListGetItemEditContext = null
  ): void {
    TreeListEditUtils.deleteItem(
      item,
      context,
      this.itemsMap,
      this.listViewModel
    );

    this.cd.detectChanges();
    this.emitChange();
  }

  public increaseIndent(
    item: TreeListItem,
    indexInView: number = null
  ): TreeListItem {
    const parent = TreeListEditUtils.findPossibleParentAmongPrevSiblings(
      item,
      this.listViewModel,
      this.itemsMap,
      indexInView
    );

    if (!parent) {
      return;
    }

    if (parent.collapsed) {
      console.log('should expand');
      this.toggleItemCollapsed(parent, null, false);
    }

    this.moveItem(item, 'lastChildOf', parent);

    this.cd.detectChanges();

    this.emitChange();

    return item;
  }

  public decreaseIndent(item: TreeListItem): TreeListItem {
    const parent = this.itemsMap.get(item.parentIDs[item.parentCount - 1]);
    console.log('decreaseIndent', 'item', item.name, 'parent', parent.name);

    this.moveItem(item, 'after', parent);

    this.cd.detectChanges();

    this.emitChange();

    return item;
  }

  public onDragstart(item: TreeListItem, indexInView: number): void {
    if (item.childrenCount && !item.collapsed) {
      this.setListCSS('height');
      this.toggleItemCollapsed(item, null, true);
      item.expandMe = true;
    }

    this.draggingIndex = indexInView;
    this.dragHoverIndex = indexInView;
  }

  public onDragEnd(item: TreeListItem): void {
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
}
