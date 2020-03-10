import { Injectable } from '@angular/core';
import { TreeListItem, itemID, TreeListItemMap } from '../tree-list.interface';
import {
  isEmptyArray,
  isEmptyMap,
  isBoolean,
} from '../../../services/utils/functional-utils';
import { TreeListModelService } from './tree-list-model.service';
import { LIST_EL_HEIGHT } from '../../list.consts';
import { BTL_ROOT_ID } from '../tree-list.const';

interface TreeListScrollToItemConfig {
  item?: TreeListItem;
  itemElement?: HTMLElement;
  listElement?: HTMLElement;
  indexInView?: number;
  listViewModel?: itemID[];
  itemsMap?: TreeListItemMap;
  maxHeightItems?: number;
}

export interface TreeListChildrenToggleSelectReducerResult {
  IDs: itemID[];
  items: TreeListItem[];
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

  public deselectAllExcept(
    selectedIDs: itemID[],
    keepIDs: itemID[],
    itemsMap: TreeListItemMap
  ): void {
    selectedIDs
      .filter(id => !keepIDs.includes(id))
      .forEach(id => {
        const item = itemsMap.get(id);
        item.selected = false;
      });
  }

  public toggleCollapseAllItemsInMap(
    itemsMap: TreeListItemMap,
    force: boolean = null
  ) {
    itemsMap.forEach(item => {
      if (item.childrenCount && item.id !== BTL_ROOT_ID) {
        item.collapsed = isBoolean(force) ? force : !item.collapsed;
      }
    });
  }

  public childrenToggleSelectReducer(
    parentSelected: boolean,
    itemsMap: TreeListItemMap
  ) {
    return (
      acc: TreeListChildrenToggleSelectReducerResult = { IDs: [], items: [] },
      id: itemID
    ) => {
      const item = itemsMap.get(id);

      if (item.selected && parentSelected) {
        acc.IDs.push(id);
        acc.items.push(item);
        item.selected = false;
      }

      item.parentSelected = parentSelected;

      if (item.childrenCount) {
        return item.childrenIDs.reduce(
          this.childrenToggleSelectReducer(parentSelected, itemsMap),
          acc
        );
      }

      return acc;
    };
  }

  public updateItemParentsSelectedCount(
    item: TreeListItem,
    itemsMap: TreeListItemMap
  ): void {
    (item.parentIDs || []).forEach(groupID => {
      const parent = itemsMap.get(groupID);
      parent.selectedCount = Math.max(
        0,
        (parent.selectedCount || 0) + (item.selected ? 1 : -1)
      );
    });
  }
}
