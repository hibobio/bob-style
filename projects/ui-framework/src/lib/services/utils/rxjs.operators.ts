import {
  defer,
  EMPTY,
  interval,
  merge,
  Observable,
  OperatorFunction,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  finalize,
  map,
  tap,
} from 'rxjs/operators';

import { NgZone, ɵɵdirectiveInject as directiveInject } from '@angular/core';

import { Keys } from '../../enums';
import {
  asArray,
  cloneDeepSimpleObject,
  EqualByValuesConfig,
  getEventPath,
  isEmpty,
  isEqualByValues,
  isFalsyOrEmpty,
  isFunction,
  isNumber,
  isString,
  randomFromArray,
} from './functional-utils';
import { log } from './logger';

// Source: https://netbasal.com/optimizing-angular-change-detection-triggered-by-dom-events-d2a3b2e11d87

export function outsideZone<T>(zone?: NgZone) {
  return function (source: Observable<T>): Observable<T> {
    return new Observable<T>((observer) => {
      let sub: Subscription;
      (zone || directiveInject(NgZone)).runOutsideAngular(() => {
        sub = source.subscribe(observer);
      });

      return sub;
    });
  };
}

export function insideZone<T>(zone?: NgZone) {
  return function (source: Observable<T>): Observable<T> {
    return new Observable<T>((observer) => {
      let sub: Subscription;
      (zone || directiveInject(NgZone)).run(() => {
        sub = source.subscribe(observer);
      });

      return sub;
    });
  };
}

// https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
export function filterNil<T = any>() {
  return filter<T>((value) => value !== undefined && value !== null);
}

export function filterEmpty<T = any>(discardAllFalsey = false) {
  return filter<T>((value) => !isFalsyOrEmpty(value, discardAllFalsey));
}

/**
 * Deep clone any incoming object or array
 * with primitive values. Any functions or class instances will be removed
 * from the clone. Cloning is based on JSON.stringify/JSON.parse.
 * ```ts
 * smth$.pipe(clone())
 * ```
 * ...
 */
export function clone<T = any>() {
  return map<T, T>((value) => cloneDeepSimpleObject<T>(value));
}

// https://indepth.dev/create-a-taponce-custom-rxjs-operator
/**
 * An operator similar to tap(), but it will invoke the callback
 * function only once
 * @param fn callback to perform
 * @param ignoreFalsy if callback should be performed only on non-empty incoming value; defaults to false
 * ```ts
 * smth$.pipe( tapOnce((v)=> console.log('stream init')) )
 * ```
 * ...
 */
export function tapOnce<T = any>(fn: (value: T) => void, ignoreFalsy = false) {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      let first = true;
      return source.pipe(
        tap<T>((payload) => {
          if ((!ignoreFalsy || !isEmpty(payload)) && first) {
            fn(payload);
          }
          first = false;
        })
      );
    });
}

// https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
/**
 * An operator that will console.log any incoming values,
 * as well as observable status (subscribed, complete etc)
 * @param tag string to use as a prefix to the log, for identification
 * (put component/service/method/observable name here)
 * @param config supported options: color - hex color string to use for
 * color-coding of the log; onlyValues - if true, will not log observable
 * status (subscribed, complete etc)
 */
export function debug<T = any>(
  tag: string,
  config: {
    onlyValues?: boolean;
    color?: string;
  } = {}
): OperatorFunction<T, T> {
  const { onlyValues, color } = config;
  const logger = log.logger(tag, color);

  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      !onlyValues && logger.success('Subscribed');

      return source.pipe(
        tap({
          next(value) {
            logger.info('Next', value);
          },
          error(error) {
            logger.error('Error', error);
          },
          complete() {
            !onlyValues && logger.attention('Complete');
          },
        }),
        finalize(() => {
          !onlyValues && logger.attention('Unsubscribed');
        })
      );
    });
}

/**
 * Convert any incoming values to increasing numbers, acting as a "counter"
 *
 * ...
 */
export function counter<T = any>(startWith = 1, multiplier = 1) {
  return function (source: Observable<T>): Observable<number> {
    return defer(() => {
      let i = startWith - 1;
      return source.pipe(map(() => ++i * multiplier));
    });
  };
}

export function filterKey(key: Keys | string | (Keys | string)[]) {
  return filter<KeyboardEvent>((event) => asArray(key).includes(event.key));
}

export const filterByEventKey = filterKey;

export function filterByEventPath<
  E extends Event = Event | KeyboardEvent | MouseEvent | FocusEvent
>(element: HTMLElement) {
  return filter<E>((event) => {
    return getEventPath(event).includes(element);
  });
}

export function filterByEventTarget<
  E extends Event = Event | KeyboardEvent | MouseEvent | FocusEvent
>(target: string | HTMLElement) {
  return filter<E>((event) => {
    const targetEl = event.target as HTMLElement;
    return isString(target) ? targetEl.matches(target) : targetEl === target;
  });
}

export function filterDOMevent<
  E extends Event = Event | KeyboardEvent | MouseEvent | FocusEvent
>({
  pathIncludes,
  targetMatches,
  pathIncludesNot,
  targetMatchesNot,
  allowedKeys,
}: {
  pathIncludes?: HTMLElement;
  targetMatches?: string | HTMLElement;
  pathIncludesNot?: HTMLElement;
  targetMatchesNot?: string | HTMLElement;
  allowedKeys?: Keys | string | (Keys | string)[];
}) {
  return filter<E>((event) => {
    const targetEl = event.target as HTMLElement;

    return (
      (allowedKeys ? asArray(allowedKeys).includes(event['key']) : true) &&
      (targetMatches
        ? isString(targetMatches)
          ? targetEl.matches(targetMatches)
          : targetEl === targetMatches
        : true) &&
      (pathIncludes ? getEventPath(event).includes(pathIncludes) : true) &&
      (targetMatchesNot
        ? isString(targetMatchesNot)
          ? !targetEl.matches(targetMatchesNot)
          : targetEl !== targetMatchesNot
        : true) &&
      (pathIncludesNot ? !getEventPath(event).includes(pathIncludesNot) : true)
    );
  });
}

/**
 * Operator similar to distinctUntilChanged(isEqual), that will
 * perform deep comparison of incoming values and let only unique through.
 * Compared to distinctUntilChanged(isEqual), it uses a bit
 * different comparison mechanism - for example, it will consider differently
 * ordered arrays/objects with same absolute values equal
 * @param config Additional options: ignoreProps - an array of object properties
 * to ignore during comparison; sort (defaults to true) - set to false
 * if order of array values and/or object keys is important
 */
export function onlyDistinct<T = any>(config?: EqualByValuesConfig) {
  return distinctUntilChanged((prev: T, curr: T) =>
    isEqualByValues<T>(prev, curr, {
      limit: 5000,
      primitives: true,
      sort: false,
      ...config,
    })
  );
}

/**
 * Operator similar to onlyDistinct (and distinctUntilChanged),
 * that will perform deep comparison of incoming values and the provided reference
 * and let only different through. (onlyDistinct/distinctUntilChanged compare
 * incoming value to previous).
 * @param prev the value to compare any incoming values to
 * @param config Additional options: ignoreProps - an array of
 * object properties to ignore during comparison; sort (defaults to
 * true) - set to false if order of array values and/or object keys
 * is important
 *
 * ...
 */
export function distinctFrom<T = any>(
  prev: T | (() => T),
  config?: EqualByValuesConfig
) {
  return filter<T>(
    (curr: T) =>
      !isEqualByValues<T>(isFunction(prev) ? prev() : prev, curr, {
        limit: 5000,
        primitives: true,
        sort: false,
        ...config,
      })
  );
}

export interface SlicerConfig {
  loop?: boolean;
  shuffle?: boolean | 'auto';
}

/**
 * Emit partials of incoming data array at set
 * interval, until the data is depleted. Can optionally loop, shuffle
 * or emit a single slice of data.
 * @param config additional options: slice - the slice size, set to 0
 * to emit all the data at once; time - the timeout
 * between slice emissions, set to false to only emit the first slice;
 * loop - if true, once the values in array
 * are depleted, will loop and emit from the start again; shuffle - if true,
 * will randomize the data, set to 'auto' and it will only shuffle if loop
 * is enabled and the array lengh is at least 2 times the size of slice
 *
 * ...
 */
export function timedSlice<T = unknown>(
  slice: number,
  time: number | false,
  config: SlicerConfig
): OperatorFunction<T[], T[]> {
  return slicer(slice, isNumber(time) ? interval(time) : EMPTY, null, config);
}

/**
 *
 * @param slice slice size
 * @param next$ observable/subject that will trigger Next slice
 * @param prev$ observable/subject that will trigger Prev slice
 *
 * ```ts
 * prev$ = new Subject();
 * next$ = new Subject();
 * items$ = of([1, 2, 3, 4, 5]).pipe(
 *    slicer(1, this.next$, this.prev$)
 * );
 * ```
 * ```html
 * <ng-container *ngFor="let itm of items$|async">
 *   {{ itm }}
 * </ng-container>
 * <button (click)="prev$.next()">prev</button>
 * <button (click)="next$.next()">next</button>
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
  const { loop, shuffle } = config || {};
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

            currentSlice[0] = loop
              ? (sliceSize * sliceIndex) % dataSize
              : sliceSize * sliceIndex;

            currentSlice[1] =
              (loop
                ? (currentSlice[0] + sliceSize) % dataSize
                : currentSlice[0] + sliceSize) || undefined;

            const dataSlice =
              currentSlice[1] < currentSlice[0] ||
              (currentSlice[0] < 0 && currentSlice[1] > 0)
                ? data
                    .slice(currentSlice[0])
                    .concat(data.slice(0, currentSlice[1]))
                : data.slice(...currentSlice);

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

/**
 * Collect all incoming values into an array.
 * On every incoming value received, emit the expanding array with
 * all so far collected values.
 * @param startArray an array of items that w
 * @param clearValue defaults to null. if such value is received,
 * the collection will be cleared
 * ```ts
 * smth$.pipe(collectToArray())
 * ```
 * ...
 */
export function collectToArray<T = unknown>(
  startArray: T[] = [],
  clearValue = null
): OperatorFunction<T, T[]> {
  return function (source: Observable<T>): Observable<T[]> {
    //
    return new Observable<T[]>((subscriber) => {
      const collection = new Set(startArray);

      return source.subscribe({
        next: (value: T) => {
          if (value === clearValue) {
            collection.clear();
          } else if (value !== undefined) {
            collection.add(value);
          }
          subscriber.next(Array.from(collection));
        },
        complete: () => {
          subscriber.complete();
        },
        error: (error) => {
          subscriber.error(error);
        },
      });
    });
  };
}
