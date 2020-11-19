import {
  TreeListItem,
  TreeListItemMap,
  TreeListOption,
  TreeListKeyMap,
} from '../tree-list.interface';
import {
  isNullOrUndefined,
  stringify,
  simpleArrayAddItemUnique,
  objectRemoveKeys,
  isNotEmptyArray,
} from '../../../services/utils/functional-utils';
import {
  BTL_KEYMAP_DEF,
  BTL_ROOT_ID,
  BTL_VALUE_SEPARATOR_DEF,
} from '../tree-list.const';
import { itemID } from '../../list.interface';

export interface IDsAndItemsSets {
  IDs: Set<itemID>;
  items: Set<TreeListItem>;
}

export type ChildrenToggleSelectReducer = (
  acc: IDsAndItemsSets,
  id: itemID
) => IDsAndItemsSets;

export interface TreeListConverterConfig {
  keyMap: TreeListKeyMap;
  separator?: string;
  collapsed?: boolean;
  removeKeys?: string[];
  onlyValue?: boolean;
}

export class TreeListModelUtils {
  //
  public static getIDtoValueMap(
    list: TreeListOption[],
    keyMap: TreeListKeyMap = BTL_KEYMAP_DEF,
    separator: string = BTL_VALUE_SEPARATOR_DEF
  ): Map<itemID, string> {
    const map = (this.getListItemsMap(list, new Map(), {
      keyMap,
      separator,
      collapsed: false,
      onlyValue: true,
    }) as any) as Map<itemID, string>;
    map.delete(BTL_ROOT_ID);
    return map;
  }

  public static getListItemsMap(
    list: TreeListOption[],
    itemsMap: TreeListItemMap = new Map(),
    config: TreeListConverterConfig = {
      keyMap: BTL_KEYMAP_DEF,
      separator: BTL_VALUE_SEPARATOR_DEF,
      collapsed: false,
      onlyValue: false,
    },
    counter = -1,
    maxItems = 5000
  ): TreeListItemMap {
    const { keyMap, separator, collapsed, onlyValue } = config;
    counter = -1;

    if (isNullOrUndefined(keyMap)) {
      console.error(
        `[TreeListModelUtils.getListItemsMap]:
        keyMap is ${keyMap}`
      );
    }
    const removeKeys = [...Object.values(keyMap || {}), 'selected', 'disabled'];

    this.convertItem(
      // item
      {
        [keyMap.children]: list || [],
      },
      // map
      itemsMap,
      // set
      {
        id: BTL_ROOT_ID,
        name: BTL_ROOT_ID,
        parentIDs: [],
        parentCount: 0,
        selectedCount: 0,
        childrenCount: 0,
        selectedIDs: new Set(),
      },
      // config
      {
        keyMap,
        separator,
        collapsed,
        removeKeys,
        onlyValue,
      },
      counter,
      maxItems
    );

    return itemsMap;
  }

  public static convertItem(
    item: TreeListOption,
    itemsMap: TreeListItemMap,
    set: Partial<TreeListItem> = {
      parentIDs: [],
    },
    config: TreeListConverterConfig = {
      keyMap: BTL_KEYMAP_DEF,
      separator: BTL_VALUE_SEPARATOR_DEF,
      collapsed: false,
      removeKeys: [],
      onlyValue: false,
    },
    counter = -1,
    maxItems = 5000
  ): TreeListItem {
    if (counter > maxItems) {
      console.error(
        `[TreeListModelUtils.convertItem]:
        List too complex! List with more than ${maxItems} items are not supported. Truncating to first ${maxItems} items.`
      );
      return;
    }

    const { keyMap, collapsed, removeKeys, onlyValue } = config;
    let { separator } = config;
    if (separator === undefined) {
      separator = BTL_VALUE_SEPARATOR_DEF;
    }

    const converted: TreeListItem = {
      ...objectRemoveKeys(item, removeKeys),
      ...set,
      id: set.id || this.getItemId(item, keyMap),
      name: set.name || this.getItemName(item, keyMap),
      childrenIDs: [],
      groupsCount: 0,
      originalIndex: counter,
    };

    if (isNotEmptyArray(item[keyMap.children])) {
      converted.childrenIDs = [];
      converted.selectedIDs = new Set();
      converted.selectedCount = 0;

      for (const itm of item[keyMap.children]) {
        ++counter;

        const cnvrtd = this.convertItem(
          itm,
          itemsMap,
          // set
          {
            value: this.concatValue(
              set.value || '',
              this.getItemName(itm, keyMap),
              separator
            ),
            parentIDs: [...(set.parentIDs || []), converted.id],
          },
          // config
          {
            keyMap,
            separator,
            collapsed,
            removeKeys,
            onlyValue,
          },
          counter,
          maxItems
        );

        if (!cnvrtd) {
          break;
        }

        cnvrtd.parentCount = cnvrtd.parentIDs.length;
        converted.childrenIDs.push(cnvrtd.id);

        if (cnvrtd.childrenCount) {
          ++converted.groupsCount;
        }

        this.updateMap(itemsMap, cnvrtd.id, cnvrtd, onlyValue);
      }

      converted.collapsed = collapsed && converted.id !== BTL_ROOT_ID;
      converted.childrenCount = converted.childrenIDs.length;
    }

    this.updateMap(itemsMap, converted.id, converted, onlyValue);

    return converted;
  }

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

      itm.parentIDs = parentIDs.slice();
      itm.parentCount = itm.parentIDs.length;

      maxDepth = Math.max(maxDepth, itm.parentCount);

      if (itm.childrenCount) {
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

  public static getAllDescendantsIDs(
    item: TreeListItem,
    itemsMap: TreeListItemMap
  ): itemID[] {
    const collector = (collection: itemID[], id: itemID) => {
      const child = itemsMap.get(id);

      collection.push(id);

      if (child.childrenCount) {
        collection = child.childrenIDs.reduce(collector, collection);
      }
      return collection;
    };

    return (item.childrenIDs || []).reduce(collector, []);
  }

  public static getAllSiblingsIDs(
    item: TreeListItem,
    itemsMap: TreeListItemMap
  ): itemID[] {
    return this.getParent(item, itemsMap).childrenIDs || [];
  }

  public static getParent(
    item: TreeListItem,
    itemsMap: TreeListItemMap
  ): TreeListItem {
    return item && itemsMap.get(item.parentIDs[item.parentCount - 1]);
  }

  public static isTreeListItem(thing: any): thing is TreeListItem {
    return Boolean(
      thing &&
        typeof thing.id !== 'undefined' &&
        typeof thing.name !== 'undefined'
    );
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
        `[TreeListModelUtils.getItemId]:
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
        `[TreeListModelUtils.getItemName]:
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
