import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import {
  arrayInsertAt,
  asArray,
} from '../../../services/utils/functional-utils';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BaseEditableTreeListElement } from './editable-tree-list.abstract';
import { TreeListItem, itemID } from '../tree-list.interface';
import { TreeListModelService } from '../services/tree-list-model.service';
import { TreeListModelUtils } from '../services/tree-list-model.static';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { TreeListViewUtils } from '../services/tree-list-view.static';
import {
  TreeListItemEditContext,
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
    DOM: DOMhelpers,
    cd: ChangeDetectorRef,
    host: ElementRef
  ) {
    super(modelSrvc, cntrlsSrvc, DOM, cd, host);
  }

  public insertItem(
    item: TreeListItem,
    where: InsertItemLocation,
    target: TreeListItem,
    context: TreeListItemEditContext = null
  ): void {
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

    this.listViewModel = this.itemsMapToListViewModel();

    this.cd.detectChanges();

    TreeListViewUtils.findAndFocusInput(
      this.listElement.nativeElement.querySelector(`[data-id="${item.id}"]`),
      'start'
    );

    this.setListCSS('width');
  }

  public insertNewItem(where: InsertItemLocation, target: TreeListItem): void {
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
      this.toggleItemCollapsed(context.parent, null, false);
    }

    this.insertItem(newItem, where, target, context);

    this.emitChange();
  }

  public collectAllChildren(list: itemID[] | itemID): itemID[] {
    const collector = (collection: itemID[], id: itemID) => {
      const item = this.itemsMap.get(id);
      // collection = collection.filter((i) => i !== id).concat(id);
      collection.push(id);

      if (item.childrenCount) {
        collection = item.childrenIDs.reduce(collector, collection);
      }
      return collection;
    };

    return asArray(list).reduce(collector, []);
  }

  public moveItem(
    item: TreeListItem,
    where: InsertItemLocation,
    target: TreeListItem // parent
  ): void {
    const allItemDescendants = this.collectAllChildren([item.id]);

    [target?.id, item.parentIDs[item.parentCount - 1]].forEach((id) => {
      const itm = this.itemsMap.get(id);

      if (!itm) {
        return;
      }

      itm.childrenIDs = itm.childrenIDs?.filter((i) => i !== item.id) || [];
      itm.childrenCount = itm.childrenIDs.length;
    });

    this.listViewModel = this.listViewModel.filter(
      (id) => !allItemDescendants.includes(id)
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

  public deleteItem(
    item: TreeListItem,
    context: TreeListItemEditContext = null
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

  public increaseIndent(item: TreeListItem, indexInView: number = null): void {
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

    this.emitChange();
  }

  public decreaseIndent(item: TreeListItem): void {
    if (!item.parentCount || item.parentCount < 2) {
      return;
    }

    const parent = this.itemsMap.get(item.parentIDs[item.parentCount - 1]);

    this.moveItem(item, 'after', parent);

    this.emitChange();
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
    const prevIndex = event.previousIndex;
    const newIndex = event.currentIndex;
    const item: TreeListItem = event.item.data;

    if (prevIndex === newIndex) {
      return;
    }

    this.moveItem(item, newIndex, null);

    this.listViewModel = this.itemsMapToListViewModel();
    this.cd.detectChanges();

    this.emitChange();
  }

  public onListBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;

    if (target.matches('.betl-item-input')) {
      if (target.value.trim()) {
        this.emitChange();
      } else {
        const { item } = TreeListViewUtils.getItemFromElement(
          target,
          this.itemsMap,
          this.listViewModel
        );
        if (!item?.childrenCount) {
          this.deleteItem(item);
        }
      }
    }
  }
}
