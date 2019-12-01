import { SimpleChanges } from '@angular/core';
import { metaKeys } from '../../enums';
import { GenericObject } from '../../types';
import { isEqual } from 'lodash';

export function MixIn(baseCtors: Function[]) {
  return function(derivedCtor: Function) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
  };
}

export const randomNumber = (min = 0, max = 100): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomFromArray = (array: any[] = [], num: number = 1) => {
  if (!num) {
    num = array.length;
  }
  const random = array
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, num);
  return num === 1 ? random[0] : random;
};

export const keysFromArrayOrObject = (smth: string[] | {}): string[] =>
  Array.isArray(smth) ? smth : Object.keys(smth);

export const getKeyByValue = (object: GenericObject, value: any) =>
  Object.keys(object).find(key => object[key] === value);

export const isString = (val: any): boolean => typeof val === 'string';

export const isNumber = (val: any): boolean =>
  typeof val === 'number' && val === val;

export const isNotEmptyString = (val: any): boolean =>
  isString(val) && val.trim() !== '';

export const isEmptyString = (val: any): boolean => !isNotEmptyString(val);

export const isArray = (val: any): boolean => val && Array.isArray(val);

export const isNotEmptyArray = (val: any): boolean =>
  isArray(val) && val.length > 0;

export const isEmptyArray = (val: any): boolean => !isNotEmptyArray(val);

export const isObject = (val: any): boolean =>
  val && !isArray(val) && typeof val !== 'function' && val === Object(val);

export const hasProp = (obj: GenericObject, key: string): boolean =>
  isObject(obj) && obj.hasOwnProperty(key);

export const isNotEmptyObject = (val: any): boolean =>
  isObject(val) && Object.keys(val).length > 0;

export const isEmptyObject = (val: any): boolean => !isNotEmptyObject(val);

export const isNullOrUndefined = (val: any): boolean =>
  val === undefined || val === null;

export const isFalsyOrEmpty = (smth: any, fuzzy = false): boolean =>
  isNullOrUndefined(smth) ||
  smth === false ||
  (fuzzy && smth === '') ||
  (fuzzy && smth === 0) ||
  isEmptyArray(smth) ||
  isEmptyObject(smth);

export const isRenderedComponent = (obj: any): boolean =>
  hasProp(obj, 'component');

export const simpleUID = (
  prefix: string = '',
  length: number = 5,
  suffix: string = ''
): string => {
  return (
    prefix +
    Math.random()
      .toString(16)
      .substr(2, length) +
    suffix
  );
};

export const pass = (a: any): any => a;

export const isKey = (key: string, expected: string): boolean =>
  key && expected && key.toUpperCase() === expected.toUpperCase();

export const isMetaKey = (key: string): boolean =>
  metaKeys.includes(key as any);

export const asArray = <T = any>(smth: T | T[]): T[] =>
  !isNullOrUndefined(smth)
    ? isArray(smth)
      ? (smth as T[])
      : ([smth] as T[])
    : [];

export const asNumber = (smth: any): number => (smth ? parseFloat(smth) : 0);

export const parseToNumber = asNumber;

export const compareAsNumbers = (
  a: string | number,
  b: string | number
): boolean => asNumber(a) === asNumber(b);

export const compareAsStrings = (a: any, b: any): boolean =>
  String(a) === String(b);

export const countChildren = (parentSelector, parent) => {
  parent = parentSelector ? document.querySelector(parentSelector) : parent;
  if (!parent) {
    return 0;
  }
  let relevantChildren = 0;
  for (const child of parent.childNodes) {
    if (child.nodeType !== 3 && child.nodeType !== 8) {
      if (child.tagName && child.tagName.toLowerCase() !== 'svg') {
        relevantChildren += countChildren(null, child);
      }
      relevantChildren++;
    }
  }
  return relevantChildren;
};

import {
  compose as _compose,
  isArray as _isArray,
  isPlainObject as _isPlainObject,
  merge as _merge,
  reduce as _reduce,
  set as _set,
  toPairs as _toPairs,
} from 'lodash/fp';

export const flatten = (obj, path = []) => {
  return _isPlainObject(obj) || _isArray(obj)
    ? _reduce(
        (acc, [k, v]) => _merge(acc, flatten(v, [...path, k])),
        {},
        _toPairs(obj)
      )
    : { [path.join('.')]: obj };
};

export const unflatten = _compose(
  _reduce((acc, [k, v]) => _set(k, v, acc), {}),
  _toPairs
);

export const stringify = (smth: any): string =>
  isString(smth)
    ? smth
    : isArray(smth)
    ? smth.join(', ')
    : isObject(smth)
    ? JSON.stringify(smth)
    : String(smth);

export const getType = (smth: any): string =>
  smth === null
    ? 'null'
    : isArray(smth)
    ? 'array'
    : smth instanceof Date
    ? 'date'
    : String(typeof smth);

export const arrayDifference = <T = any>(arrA: T[], arrB: T[]): T[] => {
  return arrA
    .filter(x => !arrB.includes(x))
    .concat(arrB.filter(x => !arrA.includes(x)));
};

export const arrayIntersection = <T = any>(arrA: T[], arrB: T[]): T[] =>
  arrA.filter(x => arrB.includes(x));

export const dedupeArray = <T = any>(arr: T[]): T[] => Array.from(new Set(arr));

export const joinArrays = <T = any>(arr1: T[], ...rest): T[] =>
  dedupeArray(arr1.concat(...rest));

export const makeArray = (length: number, fill: any = undefined): any[] =>
  Array(length).fill(fill);

export const arrayOfNumbers = (
  length: number,
  start = 0,
  asStrings = false
): (number | string)[] =>
  Array.from(
    Array(length),
    (e, i) => i + start + ((asStrings ? '' : 0) as any)
  );

export const padWith0 = (number: string | number, digits = 2): string => {
  if (isNullOrUndefined(number) || isNaN(parseInt(number as string, 10))) {
    return number as any;
  }

  return String(number).padStart(digits, '0');
};

export const hasChanges = (
  changes: SimpleChanges,
  keys: string[] = null
): boolean => {
  if (!keys) {
    keys = Object.keys(changes);
  }
  return !!keys.find(i => !!changes[i]);
};

export const firstChanges = (
  changes: SimpleChanges,
  keys: string[] = null
): boolean => {
  if (!keys) {
    keys = Object.keys(changes);
  }
  return !!keys.find(i => changes[i] && changes[i].firstChange);
};

export const notFirstChanges = (
  changes: SimpleChanges,
  keys: string[] = null
): boolean => {
  if (!keys) {
    keys = Object.keys(changes);
  }
  return !!keys.find(i => changes[i] && !changes[i].firstChange);
};

export const applyChanges = (
  target: any,
  changes: SimpleChanges,
  defaults: GenericObject = {},
  skip: string[] = []
): void => {
  Object.keys(changes).forEach((change: string) => {
    if (!skip.includes(change)) {
      target[change] =
        isNullOrUndefined(changes[change].currentValue) && defaults[change]
          ? defaults[change]
          : changes[change].currentValue;
    }
  });
};

export const onlyUpdatedProps = (
  oldObj: GenericObject,
  newObj: GenericObject
): GenericObject => {
  if (isEmptyObject(oldObj)) {
    return newObj;
  }

  if (!newObj) {
    return {};
  }

  return Object.keys(newObj)
    .filter(
      (key: string) =>
        !hasProp(oldObj, key) || !isEqual(oldObj[key], newObj[key])
    )
    .reduce((updObj, key) => {
      updObj[key] = newObj[key];
      return updObj;
    }, {});
};

export const cloneObject = <T = any>(value: T): T =>
  isObject(value) ? Object.assign({}, value) : value;

export const cloneArray = <T = any>(value: T[]): T[] =>
  isArray(value) ? value.slice() : value;

export const cloneValue = (value: any) =>
  isObject(value)
    ? cloneObject(value)
    : isArray(value)
    ? cloneArray(value)
    : value;

export const isIterable = (smth: any): boolean => {
  if (!smth || isNumber(smth) || isString(smth)) {
    return false;
  }
  return typeof smth[Symbol.iterator] === 'function';
};

export const lastItem = <T = any>(arr: T[]): T =>
  !isIterable(arr) ? ((arr as any) as T) : arr[arr.length - 1];

export const arrayInsertAt = <T = any>(
  arr: T[],
  val: any | any[],
  index = 0,
  overwrite = false
): T[] => {
  return arr
    .slice(0, index)
    .concat(val, arr.slice(!overwrite ? index : index + 1));
};

export const capitalize = (smth: string): string =>
  smth.charAt(0).toUpperCase() + smth.slice(1);

export const objectHasTruthyValue = (obj: GenericObject): boolean =>
  isNotEmptyObject(obj) && Boolean(Object.values(obj).find(v => Boolean(v)));

export type Func<A = any, B = A> = (val: A, ...args: any[]) => B;

export const chainCall = <A = any>(
  funcs: Func<A>[],
  value: A,
  ...args: any[]
): A => {
  return funcs.reduce(
    (previousResult, fn) => fn(previousResult, ...args),
    value
  );
};

export const arrayFlatten = <T = any>(arr: any[]): T[] =>
  asArray(arr).reduce((acc, val) => acc.concat(val), []);

export const getEventPath = (event: Event): HTMLElement[] =>
  ((event['path'] as any[]) ||
    (event.composedPath && (event.composedPath() as any[])) ||
    []) as HTMLElement[];

export const numberMinMax = (
  number: number,
  min: number = 0,
  max: number = 100
): number => Math.max(Math.min(max, number), min);

export const arrayMode = <T = any>(arr: T[]): T =>
  isArray(arr) &&
  arr
    .sort(
      (a, b) =>
        arr.filter(v => v === a).length - arr.filter(v => v === b).length
    )
    .pop();

// DATES

export const monthShortNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const isDate = (value: any): boolean =>
  String(value) !== 'Invalid Date' &&
  value instanceof Date &&
  typeof value.getMonth === 'function';

export const isDateISO8601 = (date: string): boolean =>
  isString(date) &&
  date.split('-').length === 3 &&
  date.split('-')[0].length === 4 &&
  parseInt(date.split('-')[1], 10) < 13;

export const isDateFormat = (frmt: string): boolean => {
  if (!isString(frmt)) {
    return false;
  }
  const split = frmt.toUpperCase().split(/[.|\-|/|:| ]+/);

  return (
    split.length > 1 &&
    (!!split.find(i => i === 'DD') ||
      !!split.find(i => i === 'YYYY') ||
      !!split.find(i => i.includes('MM')))
  );
};

export const thisYear = <T = number>(short = false): T => {
  const year = new Date().getFullYear();
  return ((short ? (year + '').slice(2) : year) as any) as T;
};

export const thisMonth = <T = string>(pad = true, mod = 0, name = false): T => {
  if (name) {
    return (monthShortNames[new Date().getMonth()] as any) as T;
  }
  const month = new Date().getMonth() + 1 + mod;
  return ((pad ? padWith0(month, 2) : month) as any) as T;
};

export const thisDay = <T = string>(pad = true): T => {
  const day = new Date().getDate();
  return ((pad ? padWith0(day, 2) : day) as any) as T;
};

export const lastDayOfMonth = (month: number, year: number = thisYear()) =>
  32 - new Date(year, month, 32).getDate();

export const monthIndex = (month: number | string, minusOne = true): number => {
  let num = parseInt(month as string, 10);
  if (isNaN(num)) {
    num = monthShortNames.findIndex(
      i => i.toLowerCase() === (month as string).toLowerCase()
    );
    if (num === -1) {
      return month as any;
    }
  } else if (minusOne) {
    num = num - 1;
  }
  return Math.max(0, Math.min(11, num));
};
