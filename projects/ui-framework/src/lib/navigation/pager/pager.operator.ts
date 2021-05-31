import { combineLatest, defer, Observable, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, filter, startWith, tap } from 'rxjs/operators';

import { isArray, isNumber } from '../../services/utils/functional-utils';
import { PagerComponent } from './pager.component';

export function pager<T = any>(
  pagerCmpnt: PagerComponent<T>,
  minItems?: number
): OperatorFunction<T[], T[]> {
  return function (items$: Observable<T[]>): Observable<T[]> {
    //
    return defer(() => {
      let hidePager = false;

      return new Observable<T[]>((subscriber) => {
        return combineLatest([
          items$.pipe(
            filter(isArray),
            tap((itms) => {
              if (
                !pagerCmpnt.items ||
                (isNumber(pagerCmpnt.items) && pagerCmpnt.items !== itms.length)
              ) {
                minItems &&
                  (hidePager = pagerCmpnt.hidden = itms.length <= minItems);
                pagerCmpnt.items = itms.length;

                if (!pagerCmpnt.pagesViewModel) {
                  pagerCmpnt.ngOnInit();
                } else {
                  pagerCmpnt['initViewModel']();
                }
              }
            })
          ),

          (pagerCmpnt.sliceChange as Observable<number[]>).pipe(
            filter(isArray),
            startWith([0, minItems])
          ),
          //
        ])
          .pipe(
            // debounceTime(3),
            distinctUntilChanged((prev, curr) => {
              return (
                prev[0] === curr[0] &&
                prev[1][0] === curr[1][0] &&
                prev[1][1] === curr[1][1]
              );
            })
          )
          .subscribe({
            next: ([itms, slice]: [T[], [number, number?]]) => {
              subscriber.next(hidePager === true ? itms : itms.slice(...slice));
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
