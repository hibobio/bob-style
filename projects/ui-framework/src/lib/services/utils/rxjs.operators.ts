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
  isArray,
  isEqualByValues,
  isFalsyOrEmpty,
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

export function clone<T = any>() {
  return map<T, T>((value) => cloneDeepSimpleObject<T>(value));
}

// https://indepth.dev/create-a-taponce-custom-rxjs-operator
export function tapOnce<T = any>(fn: (value: T) => void) {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      let first = true;
      return source.pipe(
        tap<T>((payload) => {
          if (first) {
            fn(payload);
          }
          first = false;
        })
      );
    });
}

// https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
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

export function counter<T = any>() {
  return function (source: Observable<T>): Observable<number> {
    return defer(() => {
      let i = 0;
      return source.pipe(map(() => ++i));
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

export function distinctFrom<T = any>(prev: T, config?: EqualByValuesConfig) {
  return filter<T>(
    (curr: T) =>
      !isEqualByValues<T>(prev, curr, {
        limit: 5000,
        primitives: true,
        sort: false,
        ...config,
      })
  );
}

export interface TimedSliceConfig {
  slice?: number;
  time?: number | boolean;
  loop?: boolean;
  shuffle?: boolean | 'auto';
}

export function timedSlice<T = unknown>(
  config: TimedSliceConfig = {}
): OperatorFunction<T[], T[]> {
  const { slice, time = null, loop = false, shuffle = false } = config;

  return function (source: Observable<T[]>): Observable<T[]> {
    //
    return defer(() => {
      return new Observable<T[]>((subscriber) => {
        //
        const intrvl = isNumber(time) ? interval(time) : EMPTY;
        let data: T[],
          dataSize: number,
          sliceSize: number,
          currentSlice: [number, number?],
          sliceIndex: number,
          doShuffle: boolean | 'auto';

        const reset = () => {
          data = dataSize = sliceSize = doShuffle = undefined;
          sliceIndex = -1;
          currentSlice = [0];
        };

        return merge(source, intrvl).subscribe({
          //
          next: (arrOrNum: T[] | number) => {
            //
            if (!isArray(arrOrNum) && !data) {
              return;
            }

            if (isArray(arrOrNum)) {
              reset();
              dataSize = arrOrNum.length;
              sliceSize = slice > 0 ? slice : dataSize;
              doShuffle =
                shuffle === 'auto' && loop && dataSize >= sliceSize * 2
                  ? true
                  : shuffle;

              data =
                doShuffle === true
                  ? randomFromArray(arrOrNum, null)
                  : arrOrNum.slice();
            }

            ++sliceIndex;
            if (!loop && currentSlice[1] >= dataSize) {
              reset();
              subscriber.complete();
              return;
            }

            (currentSlice || (currentSlice = [] as any))[0] =
              (sliceSize * sliceIndex) %
              (loop ? Math.max(dataSize, sliceSize) : dataSize);

            currentSlice[1] = currentSlice[0] + sliceSize;

            if (loop && currentSlice[1] > dataSize) {
              while (data.length < currentSlice[1]) {
                data.push(
                  ...(doShuffle === true ? randomFromArray(data, null) : data)
                );
              }
              dataSize = data.length;
            }

            if (currentSlice[0] > 0) {
              window.requestAnimationFrame(() => {
                subscriber.next(data.slice(...currentSlice));
              });
            } else {
              subscriber.next(data.slice(...currentSlice));
            }
          },

          error: (error) => {
            subscriber.error(error);
          },
          complete: () => {
            subscriber.complete();
          },
        });
      });
    });
  };
}
