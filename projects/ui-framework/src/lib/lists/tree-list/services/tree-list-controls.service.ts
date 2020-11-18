import { Injectable } from '@angular/core';
import { Keys } from '../../../enums';
import {
  isKey,
  eventHasCntrlKey,
  eventHasShiftlKey,
  eventHasMetaKey,
} from '../../../services/utils/functional-utils';
import { TreeListItem, TreeListItemMap } from '../tree-list.interface';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { TreeListViewUtils } from './tree-list-view.static';
import {
  TreeListItemEditContext,
  InsertItemLocation,
} from '../editable-tree-list/editable-tree-list.interface';
import { SelectMode } from '../../list.enum';
import { itemID } from '../../list.interface';

interface TreeListClickConfig {
  itemsMap: TreeListItemMap;
  listViewModel: itemID[];
  toggleItemCollapsed: (
    item: TreeListItem,
    element: HTMLElement,
    force?: boolean
  ) => void;
  toggleItemSelect?: (item: TreeListItem, force?: boolean) => void;
  itemClick?: (
    item: TreeListItem,
    itemElement: HTMLElement,
    clickTarget: HTMLElement
  ) => void;
  readonly?: boolean;
  disabled?: boolean;
  mode?: SelectMode;
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
  mode?: SelectMode;
  insertNewItem?: (where: InsertItemLocation, target: TreeListItem) => any;
  deleteItem?: (item: TreeListItem, context?: TreeListItemEditContext) => any;
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
  constructor(private DOM: DOMhelpers) {}

  public onListClick(
    event: MouseEvent,
    config: TreeListClickConfig
  ): HTMLElement {
    const {
      itemsMap,
      listViewModel,
      toggleItemCollapsed,
      toggleItemSelect,
      itemClick,
      readonly,
      disabled,
      mode,
    } = config;

    const target = event.target as HTMLElement;

    const { itemElement, item } = TreeListViewUtils.getItemFromElement(
      target,
      itemsMap,
      listViewModel
    );

    if (!item) {
      return target;
    }

    const isDisabled =
      readonly ||
      disabled ||
      item.disabled ||
      itemElement.classList.contains('disabled');

    if (
      (target.matches('.btl-item-chevron,.betl-item-chevron') &&
        !item.allOptionsHidden) ||
      ((isDisabled || mode !== SelectMode.tree) && item.childrenCount)
    ) {
      event.stopPropagation();
      toggleItemCollapsed(item, itemElement);
      return itemElement;
    }

    if (target.matches('.btl-item-checkbox') && !isDisabled) {
      event.stopPropagation();
      toggleItemSelect(item);
      return itemElement;
    }

    if (!isDisabled) {
      event.stopPropagation();
      itemClick(item, itemElement, target);
      return itemElement;
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
      mode,
    } = config;

    if (!TREELIST_KEYCONTROL_KEYS.includes(event.key as Keys)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;

    const {
      itemElement,
      indexInView,
      item,
    } = TreeListViewUtils.getItemFromElement(target, itemsMap, listViewModel);

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
        TreeListViewUtils.scrollToItem({
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
        TreeListViewUtils.scrollToItem({
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
      item.childrenCount &&
      ((isKey(event.key, Keys.arrowright) && item.collapsed) ||
        (isKey(event.key, Keys.arrowleft) && !item.collapsed) ||
        ((isDisabled || mode !== SelectMode.tree) &&
          (isKey(event.key, Keys.space) || isKey(event.key, Keys.enter))))
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

    const {
      itemElement,
      indexInView,
      item,
    } = TreeListViewUtils.getItemFromElement(target, itemsMap, listViewModel);

    if (!item) {
      return;
    }

    const itemInput = TreeListViewUtils.findInputInElement(itemElement);
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
      TreeListViewUtils.findAndFocusInput(nextItemElement, 'start');
      return;
    }

    if (
      prevItemElement &&
      !eventHasCntrlKey(event) &&
      (isKey(event.key, Keys.arrowup) ||
        (isKey(event.key, Keys.arrowleft) && itemInput.selectionEnd === 0))
    ) {
      event.preventDefault();
      TreeListViewUtils.findAndFocusInput(
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
        return;
      }

      event.preventDefault();

      deleteItem(item);

      if (prevItemElement) {
        TreeListViewUtils.findAndFocusInput(prevItemElement, 'end');
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
