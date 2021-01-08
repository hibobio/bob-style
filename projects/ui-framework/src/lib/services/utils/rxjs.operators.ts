import { NgZone } from '@angular/core';
import {
  Subscription,
  Observable,
  defer,
  OperatorFunction,
  interval,
  merge,
  EMPTY,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  tap,
  finalize,
} from 'rxjs/operators';
import { ɵɵdirectiveInject as directiveInject } from '@angular/core';
import {
  cloneDeepSimpleObject,
  EqualByValuesConfig,
  isEqualByValues,
  isFalsyOrEmpty,
  isKey,
  randomFromArray,
  isArray,
  asArray,
} from './functional-utils';
import { Keys } from '../../enums';
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

export function filterKey(key: Keys | string) {
  return filter<KeyboardEvent>((event) => isKey(event.key, key));
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

export function shuffle<T = unknown>(
  slice: number = null,
  time: number = null
): OperatorFunction<T[], T[]> {
  return function (source: Observable<T[]>): Observable<T[]> {
    //
    return defer(() => {
      return new Observable<T[]>((subscriber) => {
        const intrvl = time ? interval(time) : EMPTY;
        let original: T[];
        let shuffled: T[];

        return merge(source, intrvl).subscribe({
          next: (arrOrNum: T[] | number) => {
            if (isArray(arrOrNum)) {
              original = arrOrNum.slice();
            }
            shuffled = asArray(randomFromArray(original, slice));
            subscriber.next(shuffled);
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
