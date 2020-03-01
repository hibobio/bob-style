import { Injectable } from '@angular/core';
import { TreeListItem, itemID, TreeListItemMap } from '../tree-list.interface';
import { isEmptyArray } from '../../../services/utils/functional-utils';
import { LIST_EL_HEIGHT } from '../../list.consts';

// interface TreeListScrollToItemConfig {
//   listViewModel: itemID[];
//   listElement: HTMLElement;
//   itemsMap: TreeListItemMap;
//   updateListViewModel: (expand: boolean) => void;
// }

@Injectable()
export class TreeListViewService {
  //
  //
  public expandAllSelected(
    selectedIDs: itemID[],
    itemsMap: TreeListItemMap
  ): void {
    selectedIDs.forEach(id => {
      const item = itemsMap.get(id);

      if (item.parentCount > 1) {
        item.parentIDs.forEach(groupID => {
          itemsMap.get(groupID).collapsed = false;
        });
      }
    });
  }

  public scrollToItem(
    item: TreeListItem,
    listViewModel: itemID[],
    listElement: HTMLElement,
    maxHeightItems: number
  ): void {
    if (isEmptyArray(listViewModel)) {
      return;
    }

    const indexInView = listViewModel.findIndex(id => id === item.id);

    if (indexInView === -1) {
      console.error(
        `[TreeListViewService.scrollToItem]:
        Item ${item.id} was not found in view.`
      );
      return;
    }

    setTimeout(() => {
      const itemElement = listElement.children[indexInView] as HTMLElement;
      const listElScrollTopMax =
        itemElement.offsetTop - (item.parentCount - 1) * LIST_EL_HEIGHT;
      const listElScrollTopMin =
        listElScrollTopMax -
        (maxHeightItems - item.parentCount) * LIST_EL_HEIGHT;

      if (
        listElement.scrollTop < listElScrollTopMin ||
        listElement.scrollTop > listElScrollTopMax
      ) {
        listElement.scrollTop =
          itemElement.offsetTop - (item.parentCount - 1) * LIST_EL_HEIGHT;
      }
    }, 0);
  }

  // private isGroupSelected(
  //   item: TreeListItem,
  //   itemsMap: TreeListItemMap
  // ): boolean {
  //   return item.parentIDs.some(groupID => itemsMap.get(groupID).selected);
  // }
}
