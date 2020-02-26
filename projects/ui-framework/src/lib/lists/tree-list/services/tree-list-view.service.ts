import { Injectable } from '@angular/core';
import {
  TreeListItem,
  itemID,
  TreeListItemMap,
  TreeListItemViewContext,
} from '../tree-list.interface';
import { isEmptyArray } from '../../../services/utils/functional-utils';
import { LIST_EL_HEIGHT } from '../../list.consts';

interface TreeListScrollToItemConfig {
  listViewModel: itemID[];
  listElement: HTMLElement;
  itemsMap: TreeListItemMap;
  updateListViewModel: (expand: boolean) => void;
}

@Injectable()
export class TreeListViewService {
  //
  //
  public expandAllSelected(selectedIDs: itemID[], itemsMap: TreeListItemMap) {
    selectedIDs.forEach(id => {
      const item = itemsMap.get(id);

      if (item.parentCount > 1) {
        item.parentIDs.forEach(groupID => {
          itemsMap.get(groupID).collapsed = false;
        });
      }
    });
  }

  //
  // returns true if listViewModel was updated
  public scrollToItem(
    item: TreeListItem,
    config: TreeListScrollToItemConfig
  ): boolean {
    const {
      listViewModel,
      listElement,
      itemsMap,
      updateListViewModel,
    } = config;

    let viewModelWasUpdated = false;

    if (isEmptyArray(listViewModel)) {
      return viewModelWasUpdated;
    }

    let indexInView = listViewModel.findIndex(id => id === item.id);

    if (indexInView === -1 && item.parentCount > 1) {
      this.expandAllSelected([item.id], itemsMap);

      updateListViewModel(false);
      viewModelWasUpdated = true;

      indexInView = listViewModel.findIndex(id => {
        return id === item.id;
      });
    }

    if (indexInView === -1) {
      console.error(
        `[TreeListViewService.scrollToItem]:
        Item ${item.id} was not found in view.`
      );
      return viewModelWasUpdated;
    }

    setTimeout(() => {
      const itemElement = listElement.children[indexInView] as HTMLElement;
      listElement.scrollTop =
        itemElement.offsetTop - (item.parentCount - 1) * LIST_EL_HEIGHT;
      console.log('actual scrollTop 2', listElement.scrollTop);
    }, 0);

    return viewModelWasUpdated;
  }

  public getItemViewContext(
    id: itemID,
    index: number,
    config: {
      itemsMap: TreeListItemMap;
      listViewModel: itemID[];
    }
  ): TreeListItemViewContext {
    const { itemsMap, listViewModel } = config;
    const item = itemsMap.get(id);

    return {
      index,
      item,
      groupSelected: this.isGroupSelected(item, itemsMap),
    };
  }

  private isGroupSelected(
    item: TreeListItem,
    itemsMap: TreeListItemMap
  ): boolean {
    return item.parentIDs.some(groupID => itemsMap.get(groupID).selected);
  }
}
