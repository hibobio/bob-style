import { Injectable } from '@angular/core';
import {
  TreeListItemMap,
  TreeListOption,
  TreeListItem,
  itemID,
  ViewFilter,
  TreeListKeyMap,
} from '../tree-list.interface';
import {
  isNotEmptyArray,
  isNullOrUndefined,
  isEmptyArray,
  objectRemoveKeys,
  stringify,
  simpleArraysEqual,
  joinArrays,
  arrayDifference,
} from '../../../services/utils/functional-utils';
import {
  BTL_ROOT_ID,
  BTL_KEYMAP_DEF,
  BTL_VALUE_SEPARATOR_DEF,
} from '../tree-list.const';
import { TreeListSearchUtils } from './tree-list-search.static';
import { TreeListModelUtils } from './tree-list-model.static';
import { SelectType } from '../../list.enum';
import { selectValueOrFail } from '../../../services/utils/transformers';
import { TreeListValueUtils } from './tree-list-value.static';

interface TreeListGetListViewModelConfig {
  keyMap: TreeListKeyMap;
  viewFilter?: ViewFilter;
  expand?: boolean;
}

interface TreeListConverterConfig {
  keyMap: TreeListKeyMap;
  separator?: string;
  collapsed?: boolean;
  removeKeys?: string[];
  onlyValue?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TreeListModelService {
  constructor() {}

  private counter = 0;
  private maxItems = 5000;

  public getListViewModel(
    list: TreeListOption[],
    itemsMap: TreeListItemMap,
    config: TreeListGetListViewModelConfig = {
      viewFilter: {},
      keyMap: BTL_KEYMAP_DEF,
      expand: false,
    }
  ): itemID[] {
    const { keyMap, expand, viewFilter } = config;

    if (!list || !itemsMap) {
      return [];
    }

    const addIDs = (items: TreeListOption[]): itemID[] => {
      let model = [];

      for (const item of items) {
        const itemData = itemsMap.get(
          TreeListModelUtils.getItemId(item, keyMap)
        );

        if (!itemData) {
          console.error(
            `[TreeListModelService.getListViewModel]:
            Cannot find item data for ${stringify(item, 70)}.`
          );
          continue;
        }

        itemData.nextInViewIsGroup = false;

        // null if group name does not match, false if option name does not match
        const filterResult = TreeListSearchUtils.itemFilter(
          itemData,
          viewFilter
        );

        if (filterResult !== false) {
          const itemIndexInView = model.push(itemData.id) - 1;
          const itemIsGroup = isNotEmptyArray(item[keyMap.children]);

          if (itemIsGroup && (!itemData.collapsed || expand)) {
            const childrenModel = addIDs(item[keyMap.children]);

            if (childrenModel.length) {
              itemData.collapsed = false;
              itemData.allOptionsHidden = false;
              model = model.concat(childrenModel);
            } else {
              if (!filterResult) {
                model.pop();
                continue;
              } else {
                itemData.collapsed = true;
                itemData.allOptionsHidden = true;
              }
            }
          }
          if (itemIsGroup) {
            const prevInViewItem = itemsMap.get(model[itemIndexInView - 1]);
            if (prevInViewItem) {
              prevInViewItem.nextInViewIsGroup = true;
            }
          }
        }
      }

      return model;
    };

    return addIDs(list);
  }

  public getListItemsMap(
    list: TreeListOption[],
    itemsMap: TreeListItemMap = new Map(),
    config: TreeListConverterConfig = {
      keyMap: BTL_KEYMAP_DEF,
      separator: BTL_VALUE_SEPARATOR_DEF,
      collapsed: false,
      onlyValue: false,
    }
  ): TreeListItemMap {
    const { keyMap, separator, collapsed, onlyValue } = config;
    this.counter = -1;

    if (isNullOrUndefined(keyMap)) {
      console.error(
        `[TreeListModelService.getListItemsMap]:
        keyMap is ${keyMap}`
      );
    }
    const removeKeys = [...Object.values(keyMap || {}), 'selected', 'disabled'];

    if (isEmptyArray(list)) {
      return itemsMap;
    }

    this.convertItem(
      // item
      {
        [keyMap.children]: list,
      },
      // map
      itemsMap,
      // set
      {
        id: BTL_ROOT_ID,
        name: BTL_ROOT_ID,
        parentIDs: null,
        parentCount: 0,
        selectedCount: 0,
        childrenCount: 0,
      },
      // config
      {
        keyMap,
        separator,
        collapsed,
        removeKeys,
        onlyValue,
      }
    );

    return itemsMap;
  }

  private convertItem(
    item: TreeListOption,
    itemsMap: TreeListItemMap,
    set: Partial<TreeListItem> = {
      parentIDs: null,
    },
    config: TreeListConverterConfig = {
      keyMap: BTL_KEYMAP_DEF,
      separator: BTL_VALUE_SEPARATOR_DEF,
      collapsed: false,
      removeKeys: [],
      onlyValue: false,
    }
  ): TreeListItem {
    if (this.counter > this.maxItems) {
      console.error(
        `[TreeListModelService.convertItem]:
        List too complex! List with more than ${this.maxItems} items are not supported. Truncating to first ${this.maxItems} items.`
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
      id: set.id || TreeListModelUtils.getItemId(item, keyMap),
      name: set.name || TreeListModelUtils.getItemName(item, keyMap),
      childrenIDs: null,
      groupsCount: 0,
      originalIndex: this.counter,
    };

    if (isNotEmptyArray(item[keyMap.children])) {
      converted.childrenIDs = [];
      converted.selectedIDs = new Set();
      converted.selectedCount = 0;

      for (const itm of item[keyMap.children]) {
        ++this.counter;

        const cnvrtd = this.convertItem(
          itm,
          itemsMap,
          // set
          {
            value: TreeListModelUtils.concatValue(
              set.value || '',
              TreeListModelUtils.getItemName(itm, keyMap),
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
          }
        );

        if (!cnvrtd) {
          break;
        }

        cnvrtd.parentCount = cnvrtd.parentIDs.length;
        converted.childrenIDs.push(cnvrtd.id);

        if (cnvrtd.childrenCount) {
          ++converted.groupsCount;
        }

        TreeListModelUtils.updateMap(itemsMap, cnvrtd.id, cnvrtd, onlyValue);
      }

      converted.collapsed = collapsed;
      converted.childrenCount = converted.childrenIDs.length;
    }

    TreeListModelUtils.updateMap(itemsMap, converted.id, converted, onlyValue);

    return converted;
  }

  public getIDtoValueMap(
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

  public applyValueToMap(
    value: itemID[],
    itemsMap: TreeListItemMap,
    selectType: SelectType
  ) {
    value = selectValueOrFail(value) || [];
    if (selectType === SelectType.single) {
      value = value.slice(0, 1);
    }

    if (!itemsMap.size) {
      return { value };
    }

    const previousValue = Array.from(itemsMap.get(BTL_ROOT_ID).selectedIDs);
    const isSameValue = simpleArraysEqual(previousValue, value);
    let firstSelectedItem: TreeListItem;

    if (isSameValue) {
      firstSelectedItem = itemsMap.get(
        selectType === SelectType.single || value.length === 1
          ? value[0]
          : TreeListValueUtils.sortIDlistByItemIndex(value, itemsMap)[0]
      );
    } else {
      const affectedIDs: itemID[] = TreeListValueUtils.sortIDlistByItemIndex(
        joinArrays(previousValue, value),
        itemsMap
      );

      affectedIDs.forEach(id => {
        const item = itemsMap.get(id);

        if (!item) {
          console.error(
            `[TreeListComponent.applyValue]:
            No item data for ID: "${stringify(id)}". Removing ID from value.`
          );
          value = value.filter(valId => valId !== id);
          return;
        }

        item.selected = value.includes(item.id);

        if (!firstSelectedItem && item.selected) {
          firstSelectedItem = item;
        }

        TreeListModelUtils.updateItemParentsSelectedCount(item, itemsMap);

        if (item.childrenCount) {
          const deselected = TreeListModelUtils.updateChildrenParentSelected(
            item,
            itemsMap
          );

          deselected.items.forEach((itm: TreeListItem) => {
            TreeListModelUtils.updateItemParentsSelectedCount(itm, itemsMap);
          });
        }
      });
    }

    return {
      value,
      previousValue,
      isSameValue,
      firstSelectedItem,
    };
  }
}
