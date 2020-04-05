import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  NgZone,
} from '@angular/core';
import { isNumber } from '../../../services/utils/functional-utils';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import { BaseEditableTreeListElement } from './editable-tree-list.abstract';
import { TreeListItem } from '../tree-list.interface';
import { TreeListModelService } from '../services/tree-list-model.service';
import { TreeListModelUtils } from '../services/tree-list-model.static';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import {
  TreeListItemEditContext,
  InsertItemLocation,
} from './editable-tree-list.interface';
import { TreeListEditUtils } from '../services/tree-list-edit.static';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { UtilsService } from '../../../services/utils/utils.service';

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
    DOM: DOMhelpers,
    utilsService: UtilsService,
    zone: NgZone,
    cd: ChangeDetectorRef,
    host: ElementRef
  ) {
    super(modelSrvc, cntrlsSrvc, DOM, utilsService, zone, cd, host);
  }

  public insertNewItem(
    where: InsertItemLocation,
    target: TreeListItem,
    emit = true
  ): void {
    //
    this.saveUndoState();

    const context: TreeListItemEditContext = TreeListEditUtils.getItemEditContext(
      where,
      target,
      this.itemsMap,
      this.listViewModel
    );

    if (where === 'after' && !target.name.trim()) {
      return;
    }

    const newItem = TreeListEditUtils.newItem(
      context?.sibling && {
        parentIDs: context.sibling.parentIDs.slice(),
        parentCount: context.sibling.parentCount,
      }
    );

    TreeListModelUtils.updateMap(this.itemsMap, newItem.id, newItem);

    if (
      (where === 'firstChildOf' || where === 'lastChildOf') &&
      context?.parent.collapsed
    ) {
      this.toggleItemCollapsed(context.parent, null, false);
    }

    this.insertItem(newItem, where, target, context);

    if (emit) {
      this.hasChanges = true;
      this.emitChange();
    }
  }

  public moveItem(
    item: TreeListItem,
    where: InsertItemLocation,
    target: TreeListItem // parent
  ): void {
    //
    const itemAndDescendants = TreeListModelUtils.getAllDescendantsIDs(
      item,
      this.itemsMap
    ).concat(item.id);

    [target?.id, item.parentIDs[item.parentCount - 1]].forEach((parentID) => {
      const parent = this.itemsMap.get(parentID);

      if (!parent) {
        return;
      }

      parent.childrenIDs =
        parent.childrenIDs?.filter((id) => !itemAndDescendants.includes(id)) ||
        [];
      parent.childrenCount = parent.childrenIDs.length;
    });

    this.listViewModel = this.listViewModel.filter(
      (id) => !itemAndDescendants.includes(id)
    );

    const context = TreeListEditUtils.getItemEditContext(
      where,
      target,
      this.itemsMap,
      this.listViewModel
    );

    this.insertItem(item, where, target, context);
    item.moved = true;

    TreeListModelUtils.updateItemAndChildrenParentsIDs(
      item,
      context.sibling.parentIDs,
      this.itemsMap
    );
  }

  public increaseIndent(item: TreeListItem, indexInView: number = null): void {
    //
    this.saveUndoState();

    const parent = TreeListEditUtils.findPossibleParentAmongPrevSiblings(
      item,
      this.listViewModel,
      this.itemsMap,
      indexInView
    );

    if (!parent || parent.parentCount >= 10) {
      return;
    }

    if (parent.collapsed) {
      this.toggleItemCollapsed(parent, null, false);
    }

    this.moveItem(item, 'lastChildOf', parent);

    this.hasChanges = true;
    this.emitChange();
  }

  public decreaseIndent(item: TreeListItem): void {
    //
    this.saveUndoState();

    if (!item.parentCount || item.parentCount < 2) {
      return;
    }

    const parent = TreeListModelUtils.getParent(item, this.itemsMap);

    this.moveItem(item, 'after', parent);

    this.hasChanges = true;
    this.emitChange();
  }

  public onDragstart(
    event: CdkDragStart,
    item: TreeListItem,
    indexInView: number
  ): void {
    //
    this.dragRef = event.source._dragRef;
    this.cancelDrop = false;

    if (item?.childrenCount && !item.collapsed) {
      this.setListCSS('height');
      this.toggleItemCollapsed(item, null, true);
      item.expandMe = true;
    }

    this.draggingIndex = indexInView;
    this.dragHoverIndex = indexInView;
  }

  public onListHover(event: MouseEvent): void {
    window.clearTimeout(this.dragHoverTimer);

    if (this.draggingIndex === undefined) {
      return;
    }
    const target = event.target as HTMLInputElement;
    const itemElement = target.closest('.betl-item');

    if (!itemElement) {
      return;
    }

    this.draggingIndex = this.dragRef
      ? this.dragRef.data.data.index
      : this.draggingIndex;

    this.dragHoverIndex = parseInt(itemElement.getAttribute('data-index'), 10);

    this.dragHoverTimer = window.setTimeout(() => {
      const hoverItem = this.itemsMap.get(
        this.listViewModel[this.dragHoverIndex]
      );
      if (hoverItem?.collapsed && this.dragHoverIndex !== this.draggingIndex) {
        this.expandedWhileDragging.add(hoverItem);
        this.toggleItemCollapsed(hoverItem, null, false, false);

        this.draggingIndex = this.dragRef
          ? this.dragRef.data.data.index
          : this.draggingIndex;
        this.cd.detectChanges();
      }
    }, 1000);
  }

  public onDragEnd(item: TreeListItem): void {
    if (item.expandMe) {
      // this.toggleItemCollapsed(item, null, false);
      this.setListCSS('remove-height');
      // delete item.expandMe;
    }
  }

  public onItemDrop(event: CdkDragDrop<any>): void {
    if (this.cancelDrop) {
      this.cancelDrop = false;
      this.finishDrag();
      return;
    }

    const item: TreeListItem = event.item.data.item;

    const prevIndex = isNumber(event.item.data?.index)
      ? event.item.data.index
      : event.previousIndex;
    const newIndex = isNumber(this.dragHoverIndex)
      ? this.dragHoverIndex
      : event.currentIndex;

    const droppedOnItem = this.itemsMap.get(this.listViewModel[newIndex]);

    if (this.debug) {
      console.log(
        `dropped "${item.name || 'untitled'}" on "${droppedOnItem.name}";
        prevIndex: ${prevIndex}, newIndex: ${newIndex}`
      );
    }

    // if (
    //   !TreeListModelUtils.getParent(
    //     droppedOnItem,
    //     this.itemsMap
    //   ).childrenIDs.includes(item.id) &&
    //   this.countItemDuplicatesInGroup(item)
    // ) {
    //   console.log('Duplicate item', item.name);
    //   this.finishDrag();
    //   return;
    // }

    this.finishDrag();

    if (prevIndex === newIndex || droppedOnItem.parentIDs.includes(item.id)) {
      return;
    }

    this.saveUndoState();
    this.moveItem(item, newIndex, droppedOnItem);

    this.updateListViewModel();
    this.cd.detectChanges();

    this.hasChanges = true;
    this.emitChange();
  }
}
