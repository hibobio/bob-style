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
} from '../../../services/utils/functional-utils';
import { BTL_VALUE_SEPARATOR_DEF } from '../tree-list.const';

export class TreeListModelUtils {
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
