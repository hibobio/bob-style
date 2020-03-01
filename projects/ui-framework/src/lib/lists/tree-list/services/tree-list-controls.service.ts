import { Injectable } from '@angular/core';
import { Keys } from '../../../enums';
import { isKey } from '../../../services/utils/functional-utils';
import { TreeListItem, TreeListItemMap, itemID } from '../tree-list.interface';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { TreeListViewService } from './tree-list-view.service';

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
  toggleItemCollapsed: (item: TreeListItem, element: HTMLElement) => void;
  toggleItemSelect: (item: TreeListItem, index: number) => void;
  readonly: boolean;
  disabled: boolean;
}

@Injectable()
export class TreeListControlsService {
  constructor(private DOM: DOMhelpers) {}

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
    const itemElement = target.closest('.bhl-item') as HTMLElement;
    if (!itemElement) {
      return;
    }

    const index = parseInt(itemElement.getAttribute('data-index'), 10);
    const item: TreeListItem = itemsMap.get(listViewModel[index]);

    const isDisabled =
      readonly ||
      disabled ||
      item.disabled ||
      itemElement.classList.contains('disabled');

    if (
      (target.matches('.bhl-item-chevron') && !item.allOptionsHidden) ||
      (isDisabled && item.childrenCount)
    ) {
      event.stopPropagation();
      return toggleItemCollapsed(item, itemElement);
    }

    if (target.matches('.bhl-item-checkbox') && !isDisabled) {
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
    } = config;

    if (
      ![
        Keys.arrowup,
        Keys.arrowdown,
        Keys.arrowleft,
        Keys.arrowright,
        Keys.space,
        Keys.enter,
        Keys.tab,
      ].includes(event.key as Keys)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const itemElement = target.closest('.bhl-item') as HTMLElement;
    if (!itemElement) {
      return;
    }

    const index = parseInt(itemElement.getAttribute('data-index'), 10);
    const item: TreeListItem = itemsMap.get(listViewModel[index]);

    if (
      isKey(event.key, Keys.arrowdown) ||
      (isKey(event.key, Keys.tab) && !event.shiftKey) ||
      (isKey(event.key, Keys.arrowright) &&
        (!item.childrenCount || (item.childrenCount && !item.collapsed)))
    ) {
      const nextItemElement = this.DOM.getNextSibling(itemElement);
      if (nextItemElement) {
        TreeListViewService.prototype.scrollToItem(
          itemsMap.get(listViewModel[index + 1]),
          listViewModel,
          itemElement.closest('.bhl-list'),
          8
        );
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
        TreeListViewService.prototype.scrollToItem(
          itemsMap.get(listViewModel[index - 1]),
          listViewModel,
          itemElement.closest('.bhl-list'),
          8
        );
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
}
