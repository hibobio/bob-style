import { TreeListItem, itemID, TreeListItemMap } from '../tree-list.interface';
import {
  isEmptyArray,
  isEmptyMap,
  isNullOrUndefined,
  isBoolean,
} from '../../../services/utils/functional-utils';
import { LIST_EL_HEIGHT } from '../../list.consts';
import { TreeListModelUtils } from './tree-list-model.static';
import { BTL_ROOT_ID } from '../tree-list.const';

interface TreeListItemElementContext {
  item: TreeListItem;
  itemElement: HTMLElement;
  indexInView: number;
  listElement: HTMLElement;
  listViewModel?: itemID[];
  itemsMap?: TreeListItemMap;
  maxHeightItems?: number;
}

export class TreeListViewUtils {
  //
  public static toggleCollapseAllItemsInMap(
    itemsMap: TreeListItemMap,
    force: boolean = null
  ): void {
    itemsMap.forEach((item) => {
      if (item.childrenCount && item.id !== BTL_ROOT_ID) {
        this.toggleItemCollapsed(item, force);
      }
    });
  }

  public static toggleItemCollapsed(
    item: TreeListItem,
    force: boolean = null
  ): void {
    item.collapsed = isBoolean(force) ? force : !item.collapsed;
  }

  public static expandTillItemsByID(
    IDs: itemID[] = [],
    itemsMap: TreeListItemMap
  ) {
    IDs.forEach((id) => {
      const item = itemsMap.get(id);
      TreeListModelUtils.walkTree(
        'up',
        item,
        (itm) => (itm.collapsed = false),
        itemsMap
      );
    });
  }

  public static scrollToItem(
    config: Partial<TreeListItemElementContext>
  ): void {
    const {
      item,
      itemElement,
      listElement,
      maxHeightItems,
    } = this.getItemElementContext(config);

    if (!itemElement) {
      console.error(`[TreeListViewUtils.scrollToItem]:
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

  public static getItemElementContext(
    config: Partial<TreeListItemElementContext>
  ): TreeListItemElementContext {
    let { item, itemElement, listElement, indexInView } = config;
    const { listViewModel, itemsMap } = config;

    if (
      (!itemElement &&
        (!item || !listElement || isEmptyArray(listViewModel))) ||
      (itemElement &&
        !item &&
        (isEmptyMap(itemsMap) || isEmptyArray(listViewModel)))
    ) {
      console.error(`[TreeListViewUtils.getItemElementContext]:
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
          `[TreeListViewUtils.scrollToItem]:
        Data for item ${itemElement.getAttribute('id')} was not found.`
        );
        return;
      }
    }

    if (item && isNullOrUndefined(indexInView)) {
      indexInView = listViewModel.findIndex((id) => id === item.id);

      if (indexInView === -1) {
        console.error(
          `[TreeListViewUtils.scrollToItem]:
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

  public static getItemFromElement(
    itemElement: HTMLElement,
    itemsMap: TreeListItemMap,
    listViewModel: itemID[]
  ): Partial<TreeListItemElementContext> {
    itemElement = itemElement.closest('[data-index]');

    const indexInView: number =
      itemElement && parseInt(itemElement.getAttribute('data-index'), 10);
    const item: TreeListItem =
      itemElement && itemsMap.get(listViewModel[indexInView]);

    return { itemElement, indexInView, item };
  }

  public static findInputInElement(itemElement: HTMLElement): HTMLInputElement {
    return itemElement?.querySelector('.betl-item-input') as HTMLInputElement;
  }

  public static findAndFocusInput(
    element: HTMLElement,
    at: 'start' | 'end'
  ): void {
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
