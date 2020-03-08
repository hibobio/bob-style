import { Injectable } from '@angular/core';
import { ViewFilter, TreeListItem } from '../tree-list.interface';
import {
  isRegExp,
  stringToRegex,
} from '../../../services/utils/functional-utils';

@Injectable()
export class TreeListSearchService {
  constructor() {}

  public getSearchViewFilter(searchValue: string): ViewFilter {
    return {
      show: {
        search: searchValue,
        searchBy: 'name',
      },
    };
  }

  public itemFilter(item: TreeListItem, viewFilter: ViewFilter = {}): boolean {
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
}
