import { Injectable } from '@angular/core';
import {
  hasProp,
  asArray,
  isNotEmptyArray,
} from '../../../services/utils/functional-utils';
import { TreeListValue, itemID, TreeListItemMap } from '../tree-list.interface';

@Injectable()
export class TreeListValueService {
  private isTreeListValue(
    value: TreeListValue | itemID[]
  ): value is TreeListValue {
    return hasProp(value, 'selectedValues');
  }

  public sortIDlistByItemIndex(
    IDlist: itemID[],
    itemsMap: TreeListItemMap
  ): itemID[] {
    return IDlist.sort((idA, idB) =>
      itemsMap.get(idA).originalIndex > itemsMap.get(idB).originalIndex ? 1 : -1
    );
  }

  public getDisplayValuesFromValue(
    value: TreeListValue | itemID[],
    itemsMap: TreeListItemMap,
    topLevelGroups = false
  ): string[] {
    if (!value) {
      return [];
    }

    if (!topLevelGroups) {
      if (this.isTreeListValue(value)) {
        return value.selectedValues;
      }

      return asArray(value as itemID[]).reduce((acc, id) => {
        const item = itemsMap.get(id);
        if (item) {
          acc.push(item.value);
        }
        return acc;
      }, []);
    }

    if (topLevelGroups) {
      const IDs: itemID[] = this.isTreeListValue(value)
        ? value.selectedIDs
        : asArray(value);

      return Array.from(
        IDs.reduce((acc, id) => {
          const item = itemsMap.get(id);

          if (item) {
            const topGroup =
              isNotEmptyArray(item.parentIDs, 1) &&
              itemsMap.get(item.parentIDs[1]);

            if (topGroup) {
              acc.add(`${topGroup.value} (${topGroup.selectedCount})`);
            } else {
              acc.add(item.value);
            }
          }

          return acc;
        }, new Set() as Set<string>)
      );
    }
  }
}
