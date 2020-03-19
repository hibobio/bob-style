import {
  hasProp,
  asArray,
  isNotEmptyArray,
} from '../../../services/utils/functional-utils';
import { TreeListValue, itemID, TreeListItemMap } from '../tree-list.interface';

export class TreeListValueUtils {
  private static isTreeListValue(
    value: TreeListValue | itemID[]
  ): value is TreeListValue {
    return hasProp(value, 'selectedValues');
  }

  public static sortIDlistByItemIndex(
    IDlist: itemID[],
    itemsMap: TreeListItemMap
  ): itemID[] {
    const sorted = IDlist.sort((idA, idB) => {
      const itemA = itemsMap.get(idA),
        itemB = itemsMap.get(idB);
      if (!itemA || !itemB) {
        return 0;
      }
      return itemA.originalIndex > itemB.originalIndex ? 1 : -1;
    });
    return sorted;
  }

  public static getDisplayValuesFromValue(
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

      const displayValues = asArray(value as itemID[]).reduce((acc, id) => {
        const item = itemsMap.get(id);
        if (item) {
          acc.push(item.value);
        }
        return acc;
      }, []);

      return displayValues;
    }

    if (topLevelGroups) {
      const IDs: itemID[] = this.isTreeListValue(value)
        ? value.selectedIDs
        : asArray(value);

      const displayValues = Array.from(
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

      return displayValues;
    }
  }
}
