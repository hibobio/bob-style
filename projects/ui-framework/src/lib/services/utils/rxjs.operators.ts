import { NgZone } from '@angular/core';
import { Subscription, Observable, defer } from 'rxjs';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { ɵɵdirectiveInject as directiveInject } from '@angular/core';
import {
  cloneDeepSimpleObject,
  EqualByValuesConfig,
  EQUAL_BY_VALUES_CONFIG_DEF,
  isEqualByValues,
  isFalsyOrEmpty,
  isKey,
} from './functional-utils';
import { Keys } from '../../enums';

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
export function debug<T = any>(tag: string) {
  return tap<T>({
    next(value) {
      console.log(
        `%c[${tag}: Next]`,
        'background: #009688; color: #fff; padding: 3px; font-size: 9px;',
        value
      );
    },
    error(error) {
      console.log(
        `%[${tag}: Error]`,
        'background: #E91E63; color: #fff; padding: 3px; font-size: 9px;',
        error
      );
    },
    complete() {
      console.log(
        `%c[${tag}]: Complete`,
        'background: #00BCD4; color: #fff; padding: 3px; font-size: 9px;'
      );
    },
  });
}

export function counter<T = any>() {
  return function (source: Observable<T>): Observable<number> {
    let i = 0;
    return source.pipe(map(() => ++i));
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
