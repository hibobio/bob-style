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
  asArray,
  simpleArrayAddItemUnique,
} from '../../../services/utils/functional-utils';
import { BTL_VALUE_SEPARATOR_DEF } from '../tree-list.const';

export interface IDsAndItemsSets {
  IDs: Set<itemID>;
  items: Set<TreeListItem>;
}

export type ChildrenToggleSelectReducer = (
  acc: IDsAndItemsSets,
  id: itemID
) => IDsAndItemsSets;

export class TreeListModelUtils {
  //
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
        (id) => {
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
      (item) => Object.assign(item, set),
      itemsMap
    );
    return affectedIDs;
  }

  public static updateItemParentsSelectedCount(
    item: TreeListItem,
    itemsMap: TreeListItemMap
  ): void {
    (item.parentIDs || []).forEach((groupID) => {
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
  ): IDsAndItemsSets {
    //
    const childrenToggleSelectReducer = (
      parentSelected: boolean
    ): ChildrenToggleSelectReducer => (
      deselected: IDsAndItemsSets,
      id: itemID
    ): IDsAndItemsSets => {
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

    return (parentGroupItem.childrenIDs || []).reduce(
      childrenToggleSelectReducer(
        parentGroupItem.selected || parentGroupItem.parentSelected
      ),
      {
        IDs: new Set(),
        items: new Set(),
      } as IDsAndItemsSets
    );
  }

  public static updateItemAndChildrenParentsIDs(
    item: TreeListItem,
    topParentIDs: itemID[],
    itemsMap: TreeListItemMap
  ): number {
    let maxDepth = 0;

    const parentsUpdateReducer = (
      parentIDs: itemID[],
      id: itemID
    ): itemID[] => {
      const itm = itemsMap.get(id);

      // console.log(`updateItemAndChildrenParentsIDs: item: ${itm.name},
      // parentIDs: ${stringify(itm.parentIDs)},
      // new parentIDs: ${stringify(parentIDs)}
      // `);

      itm.parentIDs = parentIDs.slice();
      itm.parentCount = itm.parentIDs.length;

      maxDepth = Math.max(maxDepth, itm.parentCount);

      if (itm.childrenCount) {
        //
        // parentIDs.push(itm.id);
        // parentIDs = simpleArrayAddItemUnique(parentIDs, id);

        itm.childrenIDs.reduce(
          parentsUpdateReducer,
          simpleArrayAddItemUnique(parentIDs, id)
        );
      }

      return parentIDs;
    };

    [item.id].reduce(parentsUpdateReducer, topParentIDs);

    return maxDepth;
  }

  public static collectAllChildren(
    list: itemID[] | itemID,
    itemsMap: TreeListItemMap
  ): itemID[] {
    const collector = (collection: itemID[], id: itemID) => {
      const item = itemsMap.get(id);

      collection.push(id);
      // collection = simpleArrayAddItemUnique(collection, id);

      if (item.childrenCount) {
        collection = item.childrenIDs.reduce(collector, collection);
      }
      return collection;
    };

    return asArray(list).reduce(collector, []);
  }

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
