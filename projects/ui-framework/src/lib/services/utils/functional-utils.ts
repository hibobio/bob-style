import { SimpleChanges } from '@angular/core';
import { metaKeys } from '../../enums';

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

export const getKeyByValue = (object: object, value: any) =>
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

export const hasProp = (obj: object, key: string): boolean =>
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

export const asArray = (smth: any): any[] =>
  !isNullOrUndefined(smth) ? (isArray(smth) ? smth : [smth]) : [];

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
  toPairs as _toPairs
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

export const getType = smth =>
  smth === null
    ? 'null'
    : isArray(smth)
    ? 'array'
    : smth instanceof Date
    ? 'date'
    : String(typeof smth);

export const arrayDifference = (arrA: any[], arrB: any[]) => {
  return arrA
    .filter(x => !arrB.includes(x))
    .concat(arrB.filter(x => !arrA.includes(x)));
};

export const dedupeArray = (arr: any[]): any[] => Array.from(new Set(arr));

export const joinArrays = (arr1: any[], ...rest): any[] =>
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

export const padWith0 = (number: string | number, digits = 2): string =>
  String(number).padStart(digits, '0');

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

export const applyChanges = (target: any, changes: SimpleChanges): void => {
  Object.keys(changes).forEach((change: string) => {
    target[change] = changes[change].currentValue;
  });
};

export const isDate = (value): boolean =>
  value instanceof Date && typeof value.getMonth === 'function';

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

export const thisYear = () => new Date().getFullYear();

export const thisMonth = (pad = true, mod = 0) => {
  const month = new Date().getMonth() + 1 + mod;
  return pad ? padWith0(month, 2) : month;
};

export const thisDay = (pad = true) => {
  const day = new Date().getDate();
  return pad ? padWith0(day, 2) : day;
};

export const cloneObject = (value: any) =>
  isObject(value) ? Object.assign({}, value) : value;

export const cloneArray = (value: any) =>
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

export const lastItem = (arr: any[]): any =>
  !isIterable(arr) ? arr : arr[arr.length - 1];
