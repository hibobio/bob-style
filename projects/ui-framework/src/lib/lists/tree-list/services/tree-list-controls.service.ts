import { Injectable } from '@angular/core';
import { Keys } from '../../../enums';
import { isKey } from '../../../services/utils/functional-utils';
import { TreeListItem, TreeListItemMap, itemID } from '../tree-list.interface';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { TreeListViewService } from './tree-list-view.service';
import { InsertItemLocation } from '../editable-tree-list/editable-tree-list.enum';

interface TreeListClickConfig {
  itemsMap: TreeListItemMap;
  listViewModel: itemID[];
  toggleItemCollapsed: (item: TreeListItem, element: HTMLElement) => void;
  toggleItemSelect: (item: TreeListItem, index: number) => void;
  itemClick: (item: TreeListItem, element: HTMLElement) => void;
  readonly: boolean;
  disabled: boolean;
}

interface TreeListKeydownConfig {
  itemsMap: TreeListItemMap;
  listViewModel: itemID[];
  toggleItemCollapsed?: (item: TreeListItem, element: HTMLElement) => void;
  toggleItemSelect?: (item: TreeListItem, index: number) => void;
  readonly?: boolean;
  disabled?: boolean;
  maxHeightItems?: number;
  insertNewItem?: (where: InsertItemLocation, item: TreeListItem) => void;
  deleteItem?: (item: TreeListItem) => void;
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

    const { itemElement, index, item } = this.viewSrvc.getItemFromEl(
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
      (target.matches('.btl-item-chevron') && !item.allOptionsHidden) ||
      (isDisabled && item.childrenCount)
    ) {
      event.stopPropagation();
      return toggleItemCollapsed(item, itemElement);
    }

    if (target.matches('.btl-item-checkbox') && !isDisabled) {
      event.stopPropagation();
      return toggleItemSelect(item, index);
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

    const { itemElement, index, item } = this.viewSrvc.getItemFromEl(
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
          item: itemsMap.get(listViewModel[index + 1]),
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
          item: itemsMap.get(listViewModel[index - 1]),
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
      return !isDisabled && toggleItemSelect(item, index);
    }
  }

  public onEditableListKeyDown(
    event: KeyboardEvent,
    config: TreeListKeydownConfig
  ): void {
    const { itemsMap, listViewModel, insertNewItem, deleteItem } = config;

    if (!TREELIST_EDIT_KEYCONTROL_KEYS.includes(event.key as Keys)) {
      return;
    }

    event.stopPropagation();

    const target = event.target as HTMLElement;

    const { itemElement, index, item } = this.viewSrvc.getItemFromEl(
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

    if (isKey(event.key, Keys.enter)) {
      event.preventDefault();
      insertNewItem('after', item);
    }

    if (
      isKey(event.key, Keys.backspace) &&
      !itemInput.value.trim() &&
      itemInput.selectionEnd === 0
    ) {
      event.preventDefault();
      deleteItem(item);

      if (prevItemElement) {
        this.viewSrvc.findAndFocusInput(prevItemElement, 'end');
      }
    }
  }
}
