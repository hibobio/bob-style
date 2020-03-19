import {
  TreeListItem,
  itemID,
  TreeListItemMap,
  TreeListOption,
  TreeListKeyMap,
} from '../tree-list.interface';
import {
  isNullOrUndefined,
  stringify,
  isBoolean,
} from '../../../services/utils/functional-utils';
import { BTL_VALUE_SEPARATOR_DEF, BTL_ROOT_ID } from '../tree-list.const';

export interface TreeListChildrenToggleSelectReducerResult {
  IDs: itemID[];
  items: TreeListItem[];
}

export type ChildrenToggleSelectReducer = (
  acc: TreeListChildrenToggleSelectReducerResult,
  id: itemID
) => TreeListChildrenToggleSelectReducerResult;

export class TreeListModelUtils {
  public static toggleCollapseAllItemsInMap(
    itemsMap: TreeListItemMap,
    force: boolean = null
  ): void {
    itemsMap.forEach(item => {
      if (item.childrenCount && item.id !== BTL_ROOT_ID) {
        item.collapsed = isBoolean(force) ? force : !item.collapsed;
      }
    });
  }

  public static updateItemParentsSelectedCount(
    item: TreeListItem,
    itemsMap: TreeListItemMap
  ): void {
    (item.parentIDs || []).forEach(groupID => {
      const parent = itemsMap.get(groupID);

      if (item.selected) {
        parent.selectedIDs.add(item.id);
      } else {
        parent.selectedIDs.delete(item.id);
      }

      parent.selectedCount = parent.selectedIDs.size;
    });
  }

  public static updateChildrenParentSelected(
    item: TreeListItem,
    itemsMap: TreeListItemMap
  ): TreeListChildrenToggleSelectReducerResult {
    const result = item.childrenIDs.reduce(
      this.childrenToggleSelectReducer(item.selected, itemsMap),
      undefined
    );
    return result;
  }

  private static childrenToggleSelectReducer(
    parentSelected: boolean,
    itemsMap: TreeListItemMap
  ): ChildrenToggleSelectReducer {
    const reducer: ChildrenToggleSelectReducer = (
      acc = {
        IDs: [],
        items: [],
      },
      id
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

    return reducer;
  }

  public static updateMap<T = TreeListItem>(
    itemsMap: Map<itemID, T>,
    key: itemID,
    item: TreeListItem,
    onlyValue = false
  ): Map<itemID, T> {
    return itemsMap.set(key, ((!onlyValue ? item : item.value) as any) as T);
  }

  public static setPropToTreeDown(
    topItem: TreeListItem,
    set: Partial<TreeListItem> = {},
    itemsMap: TreeListItemMap
  ): void {
    Object.assign(topItem, set);
    if (topItem.childrenCount) {
      topItem.childrenIDs.forEach(id => {
        const child = itemsMap.get(id);
        this.setPropToTreeDown(child, set, itemsMap);
      });
    }
  }

  public static setPropToTreeUp(
    deepItem: TreeListItem,
    set: Partial<TreeListItem> = {},
    itemsMap: TreeListItemMap
  ): void {
    Object.assign(deepItem, set);
    if (deepItem.parentCount > 1) {
      deepItem.parentIDs.forEach(id => {
        const parent = itemsMap.get(id);
        this.setPropToTreeUp(parent, set, itemsMap);
      });
    }
  }

  public static getItemId(
    item: TreeListOption,
    keyMap: TreeListKeyMap
  ): itemID {
    if (isNullOrUndefined(item[keyMap.id])) {
      console.error(
        `[TreeListModelService.getItemId]:
        Item ${stringify(item, 70)} does not have a unique ID (${keyMap.id})!
        Or your KeyMap (${stringify(keyMap)}) is wrong.
        Every item list should have unique ID. Item Name will be used in place of ID, but proper behaviour is not guaranteed.`
      );
    }
    return (
      (!isNullOrUndefined(item[keyMap.id]) && item[keyMap.id]) ||
      this.getItemName(item, keyMap)
    );
  }

  public static getItemName(
    item: TreeListOption,
    keyMap: TreeListKeyMap
  ): string {
    if (isNullOrUndefined(item[keyMap.name])) {
      throw new Error(
        `[TreeListModelService.getItemName]:
        Item ${stringify(item, 70)} does not have a Name (${keyMap.name})!
        Or your KeyMap (${stringify(keyMap)}) is wrong.
        Cannot continue.`
      );
    }
    return item[keyMap.name];
  }

  public static concatValue(
    start: string,
    current: string = null,
    separator = BTL_VALUE_SEPARATOR_DEF
  ): string {
    return (
      (start ? start : '') + (current ? (start ? separator : '') + current : '')
    );
  }
}
