import { defer, merge, Observable, OperatorFunction, Subscription } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  pairwise,
  startWith,
  tap,
} from 'rxjs/operators';

import { NgZone, ɵɵdirectiveInject as directiveInject } from '@angular/core';

import { Keys } from '../../enums';
import { DOMAnyEvent, DOMKeyboardEvent, GenericObject } from '../../types';
import {
  asArray,
  cloneDeepSimpleObject,
  EqualByValuesConfig,
  getEventPath,
  isEmpty,
  isEqualByValues,
  isFalsyOrEmpty,
  isFunction,
  isNotEmptyObject,
  isString,
  onlyUpdatedProps,
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
 *
 * .
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
 *
 * .
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
 * .
 */
export function counter<T = any>(startVal = 1, multiplier = 1) {
  return function (source: Observable<T>): Observable<number> {
    return defer(() => {
      let i = startVal - 1;
      return source.pipe(map(() => ++i * multiplier));
    });
  };
}

export function filterKey(key: Keys | string | (Keys | string)[]) {
  return filter<DOMKeyboardEvent | KeyboardEvent>((event) =>
    asArray(key).includes(event.key)
  );
}

export const filterByEventKey = filterKey;

export function filterByEventPath(element: HTMLElement) {
  return filter<DOMAnyEvent>((event) => {
    return getEventPath(event).includes(element);
  });
}

export function filterByEventTarget(target: string | HTMLElement) {
  return filter<DOMAnyEvent>((event) => {
    const targetEl = event.target;
    return isString(target) ? targetEl.matches(target) : targetEl === target;
  });
}

export function filterDOMevent<T extends DOMAnyEvent>({
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
}): OperatorFunction<T, T> {
  return filter<T>((event) => {
    const targetEl = event.target;

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
 * @param prev the value to compare incoming values to,
 * or a function that will return such value (for dynamic values)
 * @param config Additional options: ignoreProps - an array of
 * object properties to ignore during comparison; sort (defaults to
 * true) - set to false if order of array values and/or object keys
 * is important
 *
 * .
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
 *
 * .
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

/**
 * For every incoming value, repeat the same value after specified delay time, once.
 * @param delayTime time before repeated emission
 */
export function repeatAfter<T = unknown>(
  delayTime: number
): OperatorFunction<T, T> {
  return function (source: Observable<T>): Observable<T> {
    //
    return new Observable<T>((subscriber) => {
      return merge(source, source.pipe(delay(delayTime))).subscribe({
        next: (value: T) => {
          subscriber.next(value);
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

/**
 * Assuming the stream values are 1 level deep relatively simple
 * objects, will compare each previous value with
 * each current and pick only changed/different properties
 * @param equalCheck optionally, provide a function for comparison -
 * takes 2 arguments and should return true if they should be
 * considered equal
 * .
 */
export function pickChangedProps<T extends GenericObject>(
  equalCheck?: (a: Partial<T>, b: Partial<T>) => boolean
): OperatorFunction<T, Partial<T>> {
  return (source: Observable<T>): Observable<Partial<T>> => {
    return source.pipe(
      startWith({}),
      pairwise(),
      map(([prev, curr]) => onlyUpdatedProps<T>(prev, curr, equalCheck)),
      filter(isNotEmptyObject)
    );
  };
}
