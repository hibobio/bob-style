import { Injectable } from '@angular/core';
import { Keys } from '../../../enums';
import {
  isKey,
  eventHasCntrlKey,
  eventHasShiftlKey,
  eventHasMetaKey,
} from '../../../services/utils/functional-utils';
import { TreeListItem, TreeListItemMap, itemID } from '../tree-list.interface';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { TreeListViewService } from './tree-list-view.service';
import {
  TreeListGetItemEditContext,
  InsertItemLocation,
} from '../editable-tree-list/editable-tree-list.interface';

interface TreeListClickConfig {
  itemsMap: TreeListItemMap;
  listViewModel: itemID[];
  toggleItemCollapsed: (
    item: TreeListItem,
    element: HTMLElement,
    force?: boolean
  ) => void;
  toggleItemSelect?: (item: TreeListItem, force?: boolean) => void;
  itemClick?: (item: TreeListItem, element: HTMLElement) => void;
  readonly?: boolean;
  disabled?: boolean;
}

interface TreeListKeydownConfig {
  itemsMap: TreeListItemMap;
  listViewModel: itemID[];
  toggleItemCollapsed?: (
    item: TreeListItem,
    element: HTMLElement,
    force?: boolean
  ) => void;
  toggleItemSelect?: (item: TreeListItem, force?: boolean) => void;
  readonly?: boolean;
  disabled?: boolean;
  maxHeightItems?: number;
  insertNewItem?: (where: InsertItemLocation, target: TreeListItem) => any;
  deleteItem?: (
    item: TreeListItem,
    context?: TreeListGetItemEditContext
  ) => any;
  increaseIndent?: (item: TreeListItem, indexInView: number) => any;
  decreaseIndent?: (item: TreeListItem) => any;
}

const TREELIST_KEYCONTROL_KEYS = [
  Keys.arrowup,
  Keys.arrowdown,
  Keys.arrowleft,
  Keys.arrowright,
  Keys.space,
  Keys.enter,
  Keys.tab,
];

const TREELIST_EDIT_KEYCONTROL_KEYS = [
  Keys.arrowup,
  Keys.arrowdown,
  Keys.arrowleft,
  Keys.arrowright,
  Keys.enter,
  Keys.tab,
  Keys.backspace,
];

@Injectable()
export class TreeListControlsService {
  constructor(private DOM: DOMhelpers, private viewSrvc: TreeListViewService) {}

  public onListClick(event: MouseEvent, config: TreeListClickConfig): void {
    const {
      itemsMap,
      listViewModel,
      toggleItemCollapsed,
      toggleItemSelect,
      itemClick,
      readonly,
      disabled,
    } = config;

    const target = event.target as HTMLElement;

    const { itemElement, item } = this.viewSrvc.getItemFromEl(
      target,
      itemsMap,
      listViewModel
    );

    if (!item) {
      return;
    }

    const isDisabled =
      readonly ||
      disabled ||
      item.disabled ||
      itemElement.classList.contains('disabled');

    if (
      (target.matches('.btl-item-chevron,.betl-item-chevron') &&
        !item.allOptionsHidden) ||
      (isDisabled && item.childrenCount)
    ) {
      event.stopPropagation();
      return toggleItemCollapsed(item, itemElement);
    }

    if (target.matches('.btl-item-checkbox') && !isDisabled) {
      event.stopPropagation();
      return toggleItemSelect(item);
    }

    if (!isDisabled) {
      itemClick(item, itemElement);
    }
  }

  public onListKeyDown(
    event: KeyboardEvent,
    config: TreeListKeydownConfig
  ): void {
    const {
      itemsMap,
      listViewModel,
      toggleItemCollapsed,
      toggleItemSelect,
      readonly,
      disabled,
      maxHeightItems,
    } = config;

    if (!TREELIST_KEYCONTROL_KEYS.includes(event.key as Keys)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;

    const { itemElement, indexInView, item } = this.viewSrvc.getItemFromEl(
      target,
      itemsMap,
      listViewModel
    );

    if (!item) {
      return;
    }

    if (
      isKey(event.key, Keys.arrowdown) ||
      (isKey(event.key, Keys.tab) && !event.shiftKey) ||
      (isKey(event.key, Keys.arrowright) &&
        (!item.childrenCount || (item.childrenCount && !item.collapsed)))
    ) {
      const nextItemElement = this.DOM.getNextSibling(itemElement);
      if (nextItemElement) {
        this.viewSrvc.scrollToItem({
          item: itemsMap.get(listViewModel[indexInView + 1]),
          itemElement: nextItemElement,
          maxHeightItems,
        });
        nextItemElement.focus();
      }
      return;
    }

    if (
      isKey(event.key, Keys.arrowup) ||
      (isKey(event.key, Keys.tab) && event.shiftKey) ||
      (isKey(event.key, Keys.arrowleft) &&
        (!item.childrenCount || item.collapsed))
    ) {
      const prevItemElement = this.DOM.getPrevSibling(itemElement);
      if (prevItemElement) {
        this.viewSrvc.scrollToItem({
          item: itemsMap.get(listViewModel[indexInView - 1]),
          itemElement: prevItemElement,
          maxHeightItems,
        });
        prevItemElement.focus();
      }
      return;
    }

    const isDisabled =
      readonly ||
      disabled ||
      item.disabled ||
      itemElement.classList.contains('disabled');

    if (
      (isKey(event.key, Keys.arrowright) &&
        item.childrenCount &&
        item.collapsed) ||
      (isKey(event.key, Keys.arrowleft) &&
        item.childrenCount &&
        !item.collapsed) ||
      (isDisabled &&
        (isKey(event.key, Keys.space) || isKey(event.key, Keys.enter)))
    ) {
      return toggleItemCollapsed(item, itemElement);
    }

    if (
      !isDisabled &&
      (isKey(event.key, Keys.space) || isKey(event.key, Keys.enter))
    ) {
      return !isDisabled && toggleItemSelect(item);
    }
  }

  public onEditableListKeyDown(
    event: KeyboardEvent,
    config: TreeListKeydownConfig
  ): void {
    const {
      itemsMap,
      listViewModel,
      insertNewItem,
      deleteItem,
      increaseIndent,
      decreaseIndent,
      toggleItemCollapsed,
    } = config;

    if (!TREELIST_EDIT_KEYCONTROL_KEYS.includes(event.key as Keys)) {
      return;
    }

    event.stopPropagation();

    const target = event.target as HTMLElement;

    const { itemElement, indexInView, item } = this.viewSrvc.getItemFromEl(
      target,
      itemsMap,
      listViewModel
    );

    if (!item) {
      return;
    }

    const itemInput = this.viewSrvc.findInputInElement(itemElement);
    const nextItemElement = this.DOM.getNextSibling(itemElement);
    const prevItemElement = this.DOM.getPrevSibling(itemElement);

    if (
      nextItemElement &&
      !eventHasCntrlKey(event) &&
      (isKey(event.key, Keys.arrowdown) ||
        (isKey(event.key, Keys.arrowright) &&
          itemInput.selectionStart === itemInput.value.length))
    ) {
      event.preventDefault();
      this.viewSrvc.findAndFocusInput(nextItemElement, 'start');
      return;
    }

    if (
      prevItemElement &&
      !eventHasCntrlKey(event) &&
      (isKey(event.key, Keys.arrowup) ||
        (isKey(event.key, Keys.arrowleft) && itemInput.selectionEnd === 0))
    ) {
      event.preventDefault();
      this.viewSrvc.findAndFocusInput(
        prevItemElement,
        isKey(event.key, Keys.arrowup) ? 'start' : 'end'
      );
      return;
    }

    if (
      item.collapsed &&
      isKey(event.key, Keys.arrowdown) &&
      eventHasCntrlKey(event)
    ) {
      event.preventDefault();
      return toggleItemCollapsed(item, itemElement, false);
    }

    if (
      !item.collapsed &&
      item.childrenCount &&
      isKey(event.key, Keys.arrowup) &&
      eventHasCntrlKey(event)
    ) {
      event.preventDefault();
      return toggleItemCollapsed(item, itemElement, true);
    }

    if (isKey(event.key, Keys.enter)) {
      event.preventDefault();

      if (item.childrenCount) {
        insertNewItem('firstChildOf', item);
      } else {
        insertNewItem('after', item);
      }
      return;
    }

    if (isKey(event.key, Keys.backspace)) {
      const noValue = !itemInput.value.trim();
      const cursorAt0 = itemInput.selectionEnd === 0;

      if (
        !(
          (!item.childrenCount &&
            ((noValue && cursorAt0) || eventHasCntrlKey(event))) ||
          (item.childrenCount &&
            ((noValue && cursorAt0 && eventHasCntrlKey(event)) ||
              (eventHasCntrlKey(event) && eventHasShiftlKey(event))))
        )
      ) {
        console.log('will exit');
        return;
      }

      event.preventDefault();

      deleteItem(item);

      if (prevItemElement) {
        this.viewSrvc.findAndFocusInput(prevItemElement, 'end');
      }
    }

    if (isKey(event.key, Keys.tab) && !eventHasMetaKey(event)) {
      event.preventDefault();
      increaseIndent(item, indexInView);
    }

    if (
      item.parentCount > 1 &&
      isKey(event.key, Keys.tab) &&
      eventHasMetaKey(event)
    ) {
      event.preventDefault();
      decreaseIndent(item);
    }
  }
}
