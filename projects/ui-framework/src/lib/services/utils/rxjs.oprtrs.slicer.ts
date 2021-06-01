import {
  BehaviorSubject,
  defer,
  EMPTY,
  interval,
  merge,
  Observable,
  OperatorFunction,
} from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import {
  isArray,
  isFunction,
  isNumber,
  randomFromArray,
} from './functional-utils';

export interface SlicerConfig {
  loop?: boolean;
  grow?: boolean;
  shuffle?: boolean | 'auto';
  state$?: BehaviorSubject<any>;
}

/**
 * Emit partials of incoming data array at set
 * interval, until the data is depleted. Can optionally loop, shuffle
 * or emit a single slice of data.
 * @param slice slice - the slice size, set to 0 to emit all the data at once
 * @param time the timeout between slice emissions, set to false
 * to only emit the first slice
 * @param config additional options: grow - on every iteration will enlarge
 * the slice, instead of moving it; loop - if true, once the values in array
 * are depleted, will loop and emit from the start again (has no effect, if grow is true);
 * shuffle - if true, will randomize the data, set to 'auto' and it will only shuffle if loop
 * is enabled and the array lengh is at least 2 times the size of slice
 *
 * ...
 */
export function timedSlice<T = unknown>(
  slice: number,
  time: number | false,
  config?: SlicerConfig
): OperatorFunction<T[], T[]> {
  return slicer(slice, isNumber(time) ? interval(time) : EMPTY, null, config);
}

/**
 *
 * @param slice slice size
 * @param next$ observable/subject that will trigger Next slice
 * @param prev$ observable/subject that will trigger Prev slice
 * @param config additional options: grow - instead of moving the slice, it will enlarge it,
 * so on each iteration you will get more and more items, until depleted;
 * loop - will endlessly loop through
 * the items; shuffle - will randmize the array; state$ - provide a subject
 * to emit current slice state - 'first', 'last' or curent slice indexes
 *
 * ```ts
 * prev$ = new Subject();
 * next$ = new Subject();
 * sliceState$ = new BehaviorSubject(null);
 *
 * items$ = of([1, 2, 3, 4, 5]).pipe(
 *    slicer(1, this.next$, this.prev$, { state$: this.sliceState$ })
 * );
 * ```
 * ```html
 * <ng-container *ngFor="let itm of items$|async">
 *   {{ itm }}
 * </ng-container>
 *
 * <button (click)="prev$.next()" [disabled]="(sliceState$|async)==='first'">prev</button>
 *
 * <button (click)="next$.next()" [disabled]="(sliceState$|async)==='last'">next</button>
 * ```
 */
export function slicer<T = unknown>(
  slice: number,
  next$: Observable<any>,
  prev$: Observable<any> = null,
  config?: SlicerConfig
): OperatorFunction<T[], T[]> {
  if (prev$ === next$) {
    prev$ = null;
  }
  const { loop, shuffle, grow } = config || {};
  //
  return function (source: Observable<T[]>): Observable<T[]> {
    //
    return defer(() => {
      return new Observable<T[]>((subscriber) => {
        //
        let data: T[],
          dataSize: number,
          sliceSize: number,
          currentSlice: [number, number?],
          sliceIndex: number,
          cntr = -1;

        return merge(
          source.pipe(
            filter(isArray),
            tap((newData) => {
              dataSize = newData.length;
              sliceSize = slice > 0 ? slice : dataSize;
              sliceIndex = 0;
              currentSlice = [0];

              data =
                shuffle === true ||
                (shuffle === 'auto' && loop && dataSize >= sliceSize * 2)
                  ? randomFromArray(newData, null)
                  : newData.slice();
            })
          ),
          next$.pipe(
            filter(
              () =>
                data && (!currentSlice[1] || loop || currentSlice[1] < dataSize)
            ),
            map(() => ++sliceIndex)
          ),
          prev$?.pipe(
            filter(() => data && (loop || sliceIndex > 0)),
            map(() => --sliceIndex)
          ) || EMPTY
        ).subscribe({
          //
          next: () => {
            if (!data) {
              return;
            }

            // this actually never happens because of the next/prev filters
            if (currentSlice[1] >= dataSize && !prev$ && !loop) {
              data = undefined;
              currentSlice = [0];
              subscriber.complete();
              return;
            }

            if (grow) {
              currentSlice[1] = sliceSize * sliceIndex + sliceSize;
              //
            } else {
              //
              currentSlice[0] = loop
                ? (sliceSize * sliceIndex) % dataSize
                : sliceSize * sliceIndex;

              currentSlice[1] =
                (loop
                  ? (currentSlice[0] + sliceSize) % dataSize
                  : currentSlice[0] + sliceSize) || undefined;
            }

            const dataSlice =
              currentSlice[1] < currentSlice[0] ||
              (currentSlice[0] < 0 && currentSlice[1] > 0)
                ? data
                    .slice(currentSlice[0])
                    .concat(data.slice(0, currentSlice[1]))
                : data.slice(...currentSlice);

            if (isFunction(config?.state$?.next)) {
              config.state$.next(
                !loop && currentSlice[0] === 0
                  ? 'first'
                  : !loop && currentSlice[1] >= dataSize
                  ? 'last'
                  : [...currentSlice]
              );
            }

            ++cntr > 0
              ? window.requestAnimationFrame(() => {
                  subscriber.next(dataSlice);
                })
              : subscriber.next(dataSlice);
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
