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
  maxHeightItems: number;
}

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

    const { itemElement, index, item } = this.getItemFromEl(
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
      maxHeightItems,
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

    const { itemElement, index, item } = this.getItemFromEl(
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

  private getItemFromEl(
    itemElement: HTMLElement,
    itemsMap: TreeListItemMap,
    listViewModel: itemID[]
  ): { itemElement: HTMLElement; index: number; item: TreeListItem } {
    itemElement = itemElement.closest('.bhl-item');

    const index: number =
      itemElement && parseInt(itemElement.getAttribute('data-index'), 10);
    const item: TreeListItem =
      itemElement && itemsMap.get(listViewModel[index]);

    return { itemElement, index, item };
  }
}
