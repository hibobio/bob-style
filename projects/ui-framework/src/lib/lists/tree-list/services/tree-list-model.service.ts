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
}

@Injectable()
export class TreeListModelService {
  private counter = 0;
  private errorCounter = 0;
  private maxItems = 10000;

  public getListViewModel(
    list: TreeListOption[],
    map: TreeListItemMap,
    viewFilter: ViewFilter = {},
    config: {
      keyMap: TreeListKeyMap;
      expand: boolean;
    } = {
      keyMap: BTL_KEYMAP_DEF,
      expand: false,
    }
  ): itemID[] {
    const { keyMap, expand } = config;

    const addIDs = (items: TreeListOption[]): itemID[] => {
      let model = [];

      for (const item of items) {
        const itemData = map.get(this.getItemId(item, keyMap));

        if (!itemData) {
          console.error(
            `[TreeListModelService]: Cannot find item data for ${stringify(
              item
            )}`
          );
          break;
        }

        const filterResult = this.itemFilter(itemData, viewFilter);

        if (filterResult !== false) {
          model.push(itemData.id);

          if (item[keyMap.children] && (!itemData.collapsed || expand)) {
            const childrenModel = addIDs(item[keyMap.children]);

            if (childrenModel.length) {
              itemData.collapsed = false;
              itemData.allOptionsHidden = false;
              model = model.concat(childrenModel);
            } else {
              if (!filterResult) {
                model.pop();
              } else {
                itemData.collapsed = true;
                itemData.allOptionsHidden = true;
              }
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
    map: TreeListItemMap = new Map(),
    config: TreeListConverterConfig = {
      keyMap: BTL_KEYMAP_DEF,
      separator: ' / ',
      collapsed: false,
    }
  ): TreeListItemMap {
    const { keyMap, separator, collapsed } = config;
    this.counter = 0;
    this.errorCounter = 0;

    if (isEmptyArray(list)) {
      return map;
    }

    const rootItem: TreeListItem = {
      id: BTL_ROOT_ID,
      name: BTL_ROOT_ID,
      parentIDs: null,
      childrenIDs: [],
      parentCount: 0,
      groupsCount: 0,
      selectedCount: 0,
    };

    for (const item of list) {
      ++this.counter;

      const itemId = this.getItemId(item, keyMap);

      const converted = this.convertItem(
        item,
        map,
        {
          id: itemId,
          value: this.concatValue(this.getItemName(item, keyMap)),
          parentIDs: [rootItem.id],
        },
        { keyMap, separator, collapsed }
      );

      if (!converted) {
        break;
      }

      rootItem.childrenIDs.push(itemId);
      if (converted.childrenCount) {
        ++rootItem.groupsCount;
      }
      this.updateMap(map, itemId, converted);
    }

    rootItem.childrenCount = rootItem.childrenIDs.length;
    this.updateMap(map, rootItem.id, rootItem);

    return map;
  }

  private convertItem(
    item: TreeListOption,
    map: TreeListItemMap,
    set: Partial<TreeListItem> = {
      parentIDs: null,
    },
    config: TreeListConverterConfig = {
      keyMap: BTL_KEYMAP_DEF,
      separator: ' / ',
      collapsed: false,
    }
  ): TreeListItem {
    if (this.counter > this.maxItems) {
      console.error(
        `[TreeListModelService]: List too complex! List with more than ${this.maxItems} items are not supported. Truncating to first ${this.maxItems} items.`
      );
      return;
    }

    const { keyMap, separator, collapsed } = config;

    const converted: TreeListItem = {
      ...objectRemoveKeys(item, [
        ...Object.values(keyMap),
        'selected',
        'disabled',
      ]),
      ...set,
      id: set.id || this.getItemId(item, keyMap),
      name: this.getItemName(item, keyMap),
      childrenIDs: null,
      groupsCount: 0,
    };

    if (isNotEmptyArray(item[keyMap.children])) {
      converted.childrenIDs = [];

      for (const itm of item[keyMap.children]) {
        ++this.counter;

        const cnvrtd = this.convertItem(
          itm,
          map,
          {
            value: this.concatValue(
              set.value || '',
              this.getItemName(itm, keyMap),
              separator
            ),
            parentIDs: [...(set.parentIDs || []), converted.id],
          },
          {
            keyMap,
            separator,
            collapsed,
          }
        );

        if (!cnvrtd) {
          break;
        }

        cnvrtd.parentCount = cnvrtd.parentIDs.length;
        converted.childrenIDs.push(cnvrtd.id);
        this.updateMap(map, cnvrtd.id, cnvrtd);
      }

      ++converted.groupsCount;
      converted.collapsed = collapsed;
      converted.childrenCount = converted.childrenIDs.length;
    }

    return converted;
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

  public getSearchViewFilter(searchValue: string): ViewFilter {
    return {
      show: {
        search: searchValue,
        searchBy: 'name',
      },
    };
  }

  private updateMap(
    map: TreeListItemMap,
    key: itemID,
    value: TreeListItem
  ): TreeListItemMap {
    return map.set(key, Object.assign(map.get(key) || {}, value));
  }

  private getItemId(item: TreeListOption, keyMap: TreeListKeyMap): itemID {
    if (isNullOrUndefined(item[keyMap.id]) && this.errorCounter < 5) {
      console.error(
        `[TreeListModelService]:
        Item ${stringify(item, 70)} does not have a unique ID (${keyMap.id})!
        Or your KeyMap (${stringify(keyMap)}) is wrong.
        Every item list should have unique one. Item name will be used in place of ID, but proper behaviour is not guaranteed.`
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
        `[TreeListModelService]:
        Item ${stringify(item, 70)} does not have a name (${keyMap.name})!
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
