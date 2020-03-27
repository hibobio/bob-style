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
  IDs: Set<itemID>;
  items: Set<TreeListItem>;
}

export type ChildrenToggleSelectReducer = (
  acc: TreeListChildrenToggleSelectReducerResult,
  id: itemID
) => TreeListChildrenToggleSelectReducerResult;

export class TreeListModelUtils {
  public static walkTree(
    direction: 'up' | 'down',
    startItem: TreeListItem,
    process: (item: TreeListItem) => void,
    itemsMap: TreeListItemMap,
    affectedIDs: itemID[] = []
  ): itemID[] {
    process(startItem);
    affectedIDs.push(startItem.id);

    if (startItem[direction === 'up' ? 'parentCount' : 'childrenCount']) {
      startItem[direction === 'up' ? 'parentIDs' : 'childrenIDs'].forEach(
        id => {
          const item = itemsMap.get(id);
          this.walkTree(direction, item, process, itemsMap, affectedIDs);
        }
      );
    }

    return affectedIDs;
  }

  public static walkTreeAndAssign(
    direction: 'up' | 'down',
    startItem: TreeListItem,
    set: Partial<TreeListItem> = {},
    itemsMap: TreeListItemMap,
    affectedIDs: itemID[] = []
  ): itemID[] {
    this.walkTree(
      direction,
      startItem,
      item => Object.assign(item, set),
      itemsMap
    );
    return affectedIDs;
  }

  public static toggleCollapseAllItemsInMap(
    itemsMap: TreeListItemMap,
    force: boolean = null,
    setHidden = false
  ): void {
    itemsMap.forEach(item => {
      if (item.childrenCount && item.id !== BTL_ROOT_ID) {
        this.toggleItemCollapsed(item, itemsMap, force, setHidden);
      }
    });
  }

  public static toggleItemCollapsed(
    item: TreeListItem,
    itemsMap: TreeListItemMap,
    force: boolean = null,
    setHidden = false
  ): void {
    item.collapsed = isBoolean(force) ? force : !item.collapsed;

    if (setHidden) {
      this.walkTree(
        'down',
        item,
        itm => {
          if (
            !itm.parentIDs.find(id => {
              const i = itemsMap.get(id);
              return i !== item && i.collapsed;
            })
          ) {
            itm.hidden = item.collapsed;
          }
        },
        itemsMap
      );

      item.hidden = false;
    }
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

  public static updateItemChildrenParentSelected(
    parentGroupItem: TreeListItem,
    itemsMap: TreeListItemMap
  ): TreeListChildrenToggleSelectReducerResult {
    //
    const childrenToggleSelectReducer = (
      parentSelected: boolean
    ): ChildrenToggleSelectReducer => (
      deselected = {
        IDs: new Set(),
        items: new Set(),
      },
      id
    ) => {
      const itm = itemsMap.get(id);

      if (itm.selected && parentSelected) {
        deselected.IDs.add(id);
        deselected.items.add(itm);
        itm.selected = false;
      }

      itm.parentSelected = parentSelected;

      if (itm.childrenCount) {
        return itm.childrenIDs.reduce(
          childrenToggleSelectReducer(parentSelected),
          deselected
        );
      }

      return deselected;
    };

    const result = (parentGroupItem.childrenIDs || []).reduce(
      childrenToggleSelectReducer(parentGroupItem.selected),
      undefined
    );
    return result;
  }

  //
  //
  //

  public static updateItemChildrenParentSelected2(
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
    //
    const reducer: ChildrenToggleSelectReducer = (
      acc = {
        IDs: new Set(),
        items: new Set(),
      },
      id
    ) => {
      const item = itemsMap.get(id);

      if (item.selected && parentSelected) {
        acc.IDs.add(id);
        acc.items.add(item);
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

  //
  //
  //

  public static updateMap<T = TreeListItem>(
    itemsMap: Map<itemID, T>,
    key: itemID,
    item: TreeListItem,
    onlyValue = false
  ): Map<itemID, T> {
    return itemsMap.set(key, ((!onlyValue ? item : item.value) as any) as T);
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
