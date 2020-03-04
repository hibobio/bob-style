import { Injectable } from '@angular/core';
import { TreeListItem, itemID, TreeListItemMap } from '../tree-list.interface';
import {
  isEmptyArray,
  isEmptyMap,
} from '../../../services/utils/functional-utils';
import { LIST_EL_HEIGHT } from '../../list.consts';
import { TreeListModelService } from './tree-list-model.service';

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
  constructor(private modelSrvc: TreeListModelService) {}

  public expandTillItemsByID(IDs: itemID[] = [], itemsMap: TreeListItemMap) {
    IDs.forEach(id => {
      const item = itemsMap.get(id);
      this.modelSrvc.setPropToTreeUp(item, { collapsed: false }, itemsMap);
    });
  }

  public scrollToItem(config: TreeListScrollToItemConfig): void {
    let { item, itemElement, listElement, indexInView } = config;
    const { listViewModel, itemsMap, maxHeightItems } = config;

    if (
      (!itemElement &&
        (!item || !listElement || isEmptyArray(listViewModel))) ||
      (itemElement &&
        !item &&
        (isEmptyMap(itemsMap) || isEmptyArray(listViewModel)))
    ) {
      return;
    }

    if (itemElement && !item) {
      const index = parseInt(itemElement.getAttribute('data-index'), 10);
      item = itemsMap.get(listViewModel[index]);

      if (!item) {
        console.error(
          `[TreeListViewService.scrollToItem]:
        Data for item ${itemElement.getAttribute('id')} was not found.`
        );
        return;
      }
    }

    if (itemElement && !listElement) {
      listElement = itemElement.closest('.bhl-list');
    }

    if (!itemElement) {
      indexInView = listViewModel.findIndex(id => id === item.id);

      if (indexInView === -1) {
        console.error(
          `[TreeListViewService.scrollToItem]:
        Item ${item.id} was not found in view.`
        );
        return;
      }

      itemElement = listElement.children[indexInView] as HTMLElement;
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
}
