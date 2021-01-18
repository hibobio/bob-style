import { ViewFilter, TreeListItem } from '../tree-list.interface';
import {
  getFuzzyMatcher,
  isRegExp,
  normalizeString,
} from '../../../services/utils/functional-utils';

export class TreeListSearchUtils {
  //
  public static getSearchViewFilter(searchValue: string): ViewFilter {
    return {
      show: {
        search: searchValue,
        searchBy: 'name',
      },
    };
  }

  public static itemFilter(
    item: TreeListItem,
    viewFilter: ViewFilter = {}
  ): boolean {
    let result = true;

    if (!viewFilter) {
      return result;
    }

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
      const matcher: RegExp = isRegExp(viewFilter.show.search)
        ? viewFilter.show.search
        : getFuzzyMatcher(viewFilter.show.search);

      const searchBy =
        (viewFilter.show && viewFilter.show.searchBy) ||
        (viewFilter.hide && viewFilter.hide.searchBy) ||
        'name';

      const matches = matcher.test(normalizeString(item[searchBy]));

      if (
        (viewFilter.show && viewFilter.show.search && !matches) ||
        (viewFilter.hide && viewFilter.hide.search && matches)
      ) {
        result = item.childrenCount ? null : false;
      }
    }

    return result;
  }
}
