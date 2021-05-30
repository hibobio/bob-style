import { combineLatest, defer, Observable, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';

import {
  get,
  getFuzzyMatcher,
  getSearchableValue,
  isArray,
  isPrimitive,
  stringifyValue,
} from '../../services/utils/functional-utils';
import { RegExpWrapper } from '../../types';
import { CompactSearchComponent } from '../compact-search/compact-search.component';
import { SearchComponent } from './search.component';

export function search<T = any>(
  searchCmpnt: SearchComponent | CompactSearchComponent,
  searchPath?: string,
  minLength?: number
): OperatorFunction<T[], T[]> {
  return function (items$: Observable<T[]>): Observable<T[]> {
    //
    return defer(() => {
      return new Observable<T[]>((subscriber) => {
        return combineLatest([
          items$.pipe(filter(isArray)),

          searchCmpnt.searchChange.pipe(
            startWith(''),
            distinctUntilChanged(),
            map(
              (searchStr) =>
                searchStr?.length >= (minLength || 2) &&
                getFuzzyMatcher(searchStr)
            )
          ),
          //
        ]).subscribe({
          next: ([itms, matcher]: [T[], RegExpWrapper]) => {
            subscriber.next(
              !matcher
                ? itms
                : itms.filter((item) => {
                    //
                    const value = get(item, searchPath, item);
                    const searcheableValue: string = getSearchableValue(
                      isPrimitive(value) ? String(value) : stringifyValue(value)
                    );
                    return matcher.test(searcheableValue);
                  })
            );
          },
          complete: () => {
            subscriber.complete();
          },
          error: (error) => {
            subscriber.error(error);
          },
        });
      });
    });
  };
}
