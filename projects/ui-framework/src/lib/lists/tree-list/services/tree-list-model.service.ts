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
  isRegExp,
  stringToRegex,
  isEmptyArray,
  objectRemoveKeys,
  stringify,
} from '../../../services/utils/functional-utils';
import { BTL_ROOT_ID, BTL_KEYMAP_DEF } from '../tree-list.const';

interface TreeListConverterConfig {
  keyMap: TreeListKeyMap;
  separator: string;
  collapsed: boolean;
  removeKeys?: string[];
  onlyValue?: boolean;
}

@Injectable()
export class TreeListModelService {
  private counter = 0;
  private errorCounter = 0;
  private maxItems = 5000;

  public getIDtoValueMap(
    list: TreeListOption[],
    keyMap: TreeListKeyMap = BTL_KEYMAP_DEF,
    separator: string = ' / '
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

  public getListViewModel(
    list: TreeListOption[],
    itemsMap: TreeListItemMap,
    config: {
      viewFilter: ViewFilter;
      keyMap: TreeListKeyMap;
      expand: boolean;
    } = {
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
        const itemData = itemsMap.get(this.getItemId(item, keyMap));

        if (!itemData) {
          console.error(
            `[TreeListModelService.getListViewModel]:
            Cannot find item data for ${stringify(item, 70)}.`
          );
          continue;
        }

        itemData.nextInViewIsGroup = false;

        const filterResult = this.itemFilter(itemData, viewFilter);

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
      separator: ' / ',
      collapsed: false,
      onlyValue: false,
    }
  ): TreeListItemMap {
    const { keyMap, separator, collapsed, onlyValue } = config;
    this.counter = 0;
    this.errorCounter = 0;

    const removeKeys = [...Object.values(keyMap), 'selected', 'disabled'];

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
      separator: ' / ',
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

    const { keyMap, separator, collapsed, removeKeys, onlyValue } = config;

    const converted: TreeListItem = {
      ...objectRemoveKeys(item, removeKeys),
      ...set,
      id: set.id || this.getItemId(item, keyMap),
      name: set.name || this.getItemName(item, keyMap),
      childrenIDs: null,
      groupsCount: 0,
    };

    if (isNotEmptyArray(item[keyMap.children])) {
      converted.childrenIDs = [];

      for (const itm of item[keyMap.children]) {
        ++this.counter;

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

        this.updateMap(itemsMap, cnvrtd.id, cnvrtd, onlyValue);
      }

      converted.collapsed = collapsed;
      converted.childrenCount = converted.childrenIDs.length;
    }

    this.updateMap(itemsMap, converted.id, converted, onlyValue);

    return converted;
  }

  public getSearchViewFilter(searchValue: string): ViewFilter {
    return {
      show: {
        search: searchValue,
        searchBy: 'name',
      },
    };
  }

  private itemFilter(item: TreeListItem, viewFilter: ViewFilter = {}): boolean {
    let result = true;

    if (viewFilter.hide) {
      if (viewFilter.hide.id && viewFilter.hide.id.includes(item.id)) {
        result = false;
      }

      if (
        viewFilter.hide.prop &&
        item[viewFilter.hide.prop.key] === viewFilter.hide.prop.value
      ) {
        result = false;
      }
    }

    if (viewFilter.show) {
      if (viewFilter.show.id && !viewFilter.show.id.includes(item.id)) {
        result = false;
      }

      if (
        viewFilter.show.prop &&
        item[viewFilter.show.prop.key] !== viewFilter.show.prop.value
      ) {
        result = false;
      }
    }

    if (
      (viewFilter.hide && viewFilter.hide.search) ||
      (viewFilter.show && viewFilter.show.search)
    ) {
      const regex: RegExp = isRegExp(viewFilter.show.search)
        ? viewFilter.show.search
        : stringToRegex(viewFilter.show.search);

      const searchBy =
        (viewFilter.show && viewFilter.show.searchBy) ||
        (viewFilter.hide && viewFilter.hide.searchBy) ||
        'name';

      const matches = regex.test(item[searchBy]);

      if (
        (viewFilter.show && viewFilter.show.search && !matches) ||
        (viewFilter.hide && viewFilter.hide.search && matches)
      ) {
        result = item.childrenCount ? null : false;
      }
    }

    return result;
  }

  private updateMap<T = TreeListItem>(
    itemsMap: Map<itemID, T>,
    key: itemID,
    item: TreeListItem,
    onlyValue = false
  ): Map<itemID, T> {
    return itemsMap.set(
      key,
      ((!onlyValue
        ? Object.assign(itemsMap.get(key) || {}, item)
        : item.value) as any) as T
    );
  }

  private getItemId(item: TreeListOption, keyMap: TreeListKeyMap): itemID {
    if (isNullOrUndefined(item[keyMap.id]) && this.errorCounter < 5) {
      console.error(
        `[TreeListModelService.getItemId]:
        Item ${stringify(item, 70)} does not have a unique ID (${keyMap.id})!
        Or your KeyMap (${stringify(keyMap)}) is wrong.
        Every item list should have unique ID. Item Name will be used in place of ID, but proper behaviour is not guaranteed.`
      );
      ++this.errorCounter;
    }
    return (
      (!isNullOrUndefined(item[keyMap.id]) && item[keyMap.id]) ||
      this.getItemName(item, keyMap)
    );
  }

  private getItemName(item: TreeListOption, keyMap: TreeListKeyMap): string {
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

  private concatValue(
    start: string,
    current: string = null,
    separator = ' / '
  ): string {
    const sprtrReg = stringToRegex(separator, 'gi');
    return (
      (start ? start.replace(sprtrReg, '-') : '') +
      (current ? (start ? separator : '') + current.replace(sprtrReg, '-') : '')
    );
  }
}
