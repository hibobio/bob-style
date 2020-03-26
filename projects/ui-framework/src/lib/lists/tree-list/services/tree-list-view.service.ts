import { Injectable } from '@angular/core';
import { TreeListItem, itemID, TreeListItemMap } from '../tree-list.interface';
import {
  isEmptyArray,
  isEmptyMap,
  isNullOrUndefined,
} from '../../../services/utils/functional-utils';
import { LIST_EL_HEIGHT } from '../../list.consts';
import { TreeListModelUtils } from './tree-list-model.static';

interface TreeListScrollToItemConfig {
  item?: TreeListItem;
  itemElement?: HTMLElement;
  listElement?: HTMLElement;
  indexInView?: number;
  listViewModel?: itemID[];
  itemsMap?: TreeListItemMap;
  maxHeightItems?: number;
}

@Injectable()
export class TreeListViewService {
  constructor() {}

  public expandTillItemsByID(IDs: itemID[] = [], itemsMap: TreeListItemMap) {
    IDs.forEach(id => {
      const item = itemsMap.get(id);
      TreeListModelUtils.setPropToTreeUp(item, { collapsed: false }, itemsMap);
    });
  }

  public scrollToItem(config: TreeListScrollToItemConfig): void {
    const {
      item,
      itemElement,
      listElement,
      maxHeightItems,
    } = this.findItemElement(config);

    if (!itemElement) {
      console.error(`[TreeListViewService.scrollToItem]:
      No element to scroll to.`);
      return;
    }

    setTimeout(() => {
      const listElScrollTopMax =
        itemElement.offsetTop - (item.parentCount - 1) * LIST_EL_HEIGHT;
      const listElScrollTopMin =
        listElScrollTopMax -
        ((maxHeightItems || 8) - item.parentCount) * LIST_EL_HEIGHT;

      if (
        listElement.scrollTop < listElScrollTopMin ||
        listElement.scrollTop > listElScrollTopMax
      ) {
        listElement.scrollTop =
          itemElement.offsetTop - (item.parentCount - 1) * LIST_EL_HEIGHT;
      }
    }, 0);
  }

  public findItemElement(
    config: TreeListScrollToItemConfig
  ): TreeListScrollToItemConfig {
    let { item, itemElement, listElement, indexInView } = config;
    const { listViewModel, itemsMap } = config;

    console.log('findItemElement', config);

    if (
      (!itemElement &&
        (!item || !listElement || isEmptyArray(listViewModel))) ||
      (itemElement &&
        !item &&
        (isEmptyMap(itemsMap) || isEmptyArray(listViewModel)))
    ) {
      console.error(`[TreeListViewService.findItemElement]:
          Not enough data to find item/element`);
      return;
    }

    if (itemElement && isNullOrUndefined(indexInView)) {
      indexInView = parseInt(itemElement.getAttribute('data-index'), 10);
    }

    if (itemElement && !item) {
      item = itemsMap.get(listViewModel[indexInView]);

      if (!item) {
        console.error(
          `[TreeListViewService.scrollToItem]:
        Data for item ${itemElement.getAttribute('id')} was not found.`
        );
        return;
      }
    }

    if (item && isNullOrUndefined(indexInView)) {
      indexInView = listViewModel.findIndex(id => id === item.id);

      if (indexInView === -1) {
        console.error(
          `[TreeListViewService.scrollToItem]:
        Item ${item.id} was not found in view.`
        );
        return;
      }
    }

    if (itemElement && !listElement) {
      listElement = itemElement.closest('.btl-list');
    }

    if (!itemElement) {
      itemElement = listElement.children[indexInView] as HTMLElement;
    }

    return {
      item,
      itemElement,
      listElement,
      indexInView,
    };
  }

  public getItemFromEl(
    itemElement: HTMLElement,
    itemsMap: TreeListItemMap,
    listViewModel: itemID[]
  ): { itemElement: HTMLElement; indexInView: number; item: TreeListItem } {
    itemElement = itemElement.closest('[data-index]');

    const indexInView: number =
      itemElement && parseInt(itemElement.getAttribute('data-index'), 10);
    const item: TreeListItem =
      itemElement && itemsMap.get(listViewModel[indexInView]);

    return { itemElement, indexInView, item };
  }

  public findInputInElement(itemElement: HTMLElement): HTMLInputElement {
    return itemElement?.querySelector('.betl-item-input') as HTMLInputElement;
  }

  public findAndFocusInput(element: HTMLElement, at: 'start' | 'end'): void {
    const input = this.findInputInElement(element);
    if (!input) {
      console.warn('cant find input in element', element);
      return;
    }
    const loc = at === 'start' ? 0 : input.value.length;

    input.focus();
    input.setSelectionRange(loc, loc);
  }
}
