import {
  assign as _assign,
  cloneDeep as _cloneDeep,
  get as _get,
  merge as _merge,
  omit as _omit,
  pick as _pick,
  set as _set,
  sortBy as _sortBy,
} from 'lodash';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
} from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { delay, take } from 'rxjs/operators';

import { ElementRef, SimpleChange, SimpleChanges, Type } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { controlKeys, KEYCODES, Keys, metaKeys } from '../../enums';
import { SelectGroupOption } from '../../lists/list.interface';
import { Color, GenericObject, SortType } from '../../types';
import {
  ColorPalette,
  PalletteColorSet,
} from '../color-service/color-palette.enum';
import {
  ColorPaletteService,
  PaletteColorGenerator,
  PaletteColorGeneratorConfig,
} from '../color-service/color-palette.service';
import { ColorService } from '../color-service/color.service';
import { RenderedComponent } from '../component-renderer/component-renderer.interface';
import { Styles } from '../html/html-helpers.interface';
import { log } from './logger';
import { WindowLike } from './window-ref.service';

// ----------------------
// TYPES
// ----------------------

export const isPrimitive = (val: any): boolean => {
  return val !== Object(val);
};

export const isNullOrUndefined = (val: any): boolean =>
  val === undefined || val === null;

export const isString = (val: any): val is string => typeof val === 'string';

export const isNumber = (val: any): val is number =>
  typeof val === 'number' && val === val;

export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';

export const isFalsey = (val: any): boolean => !val;

export const isFunction = (val: any): val is Function =>
  !!val && typeof val === 'function';

export const isNotEmptyString = (val: any): val is string =>
  isString(val) && val.trim() !== '';

export const isEmptyString = (val: any): boolean => !isNotEmptyString(val);

export const isArray = <T = any>(val: any): val is T[] =>
  !!val && Array.isArray(val);

export const isArrayOrNull = <T = any>(val: T) =>
  isArray<T>(val) || val === null;

export const isObjectOrNull = (val: any) => isObject(val) || val === null;

export const isDate = (value: any): value is Date =>
  value instanceof Date &&
  typeof value.getMonth === 'function' &&
  String(value) !== 'Invalid Date';

export const isNotEmptyArray = <T = any>(val: T, min = 0): boolean =>
  isArray(val) && val.length > min;

export const isEmptyArray = (val: any, falsyIsEmpty = true): boolean =>
  (falsyIsEmpty && isNullOrUndefined(val)) ||
  (Array.isArray(val) && val.length === 0);

export const isObject = <T = object>(val: any): val is T =>
  !!val && val === Object(val) && typeof val !== 'function' && !isArray(val);

export const isPlainObject = <T = GenericObject>(val: any): val is T =>
  isObject(val) &&
  val.constructor === Object &&
  Object.getPrototypeOf(val) === Object.prototype;

export const isNotEmptyObject = (val: any): boolean =>
  isObject(val) && Object.keys(val).length > 0;

export const isEmptyObject = (val: any): boolean =>
  isNullOrUndefined(val) || (isObject(val) && Object.keys(val).length === 0);

export const isMap = (val: any): boolean => {
  return !!val && val instanceof Map;
};

export const isNotEmptyMap = (val: any, min = 0): boolean =>
  isMap(val) && val.size > min;

export const isEmptyMap = (val: any): boolean =>
  isNullOrUndefined(val) || (isMap(val) && val.size === 0);

export const isSet = (val: any): boolean => {
  return !!val && val instanceof Set;
};

export const isRegExp = (val: any): val is RegExp =>
  !!val && typeof val === 'object' && val instanceof RegExp;

export const isNode = (
  val: any,
  nodeType: number = null,
  win: (Window & typeof globalThis) | WindowLike = window
): val is Node => {
  if (!val) {
    return;
  }

  win = win || getElementWindow(val);

  return (
    win &&
    val instanceof win['Node'] &&
    typeof val.nodeName === 'string' &&
    ((nodeType !== null && val.nodeType === nodeType) ||
      (nodeType === null && typeof val.nodeType === 'number'))
  );
};

export const isTextNode = (
  val: any,
  win: (Window & typeof globalThis) | WindowLike = window
): val is Node => isNode(val, Node.TEXT_NODE, win);

export const isDomElement = (
  val: any,
  win: (Window & typeof globalThis) | WindowLike = window
): val is HTMLElement => isNode(val, Node.ELEMENT_NODE, win);

export const isElementRef = (val: any): val is ElementRef =>
  isDomElement(val?.nativeElement);

export const isSafeUrl = (val: any): val is SafeResourceUrl =>
  hasProp(val, 'changingThisBreaksApplicationSecurity');

export const isFalsyOrEmpty = (smth: any, fuzzy = false): boolean =>
  (!Boolean(smth) && (fuzzy || (!isString(smth) && !isNumber(smth)))) ||
  (Array.isArray(smth) && smth.length === 0) ||
  (smth instanceof Map && smth.size === 0) ||
  (smth instanceof Set && smth.size === 0) ||
  (smth === Object(smth) &&
    Object.keys(smth).length === 0 &&
    smth.constructor === Object &&
    Object.getPrototypeOf(smth) === Object.prototype);

export const isEmpty = (smth: any, fuzzy = false): boolean =>
  isFalsyOrEmpty(smth, true);

// truthy, string, number, boolean or null
export const isValuevy = (smth: any): boolean =>
  smth !== undefined &&
  (Boolean(smth) ||
    smth === null ||
    isBoolean(smth) ||
    isString(smth) ||
    isNumber(smth));

export const getType = (
  smth: any
):
  | 'null'
  | 'undefined'
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'map'
  | 'set'
  | 'date'
  | 'regex'
  | 'NaN'
  | 'DOM node'
  | string =>
  smth === null
    ? 'null'
    : isArray(smth)
    ? 'array'
    : isMap(smth)
    ? 'map'
    : isSet(smth)
    ? 'set'
    : isDate(smth)
    ? 'date'
    : isRegExp(smth)
    ? 'regex'
    : smth !== smth
    ? 'NaN'
    : isNode(smth)
    ? 'DOM node'
    : String(typeof smth);

export const getEmptyOfSameType = <T = unknown>(item: T): T => {
  const type = getType(item);
  switch (type) {
    case 'null':
      return null;
    case 'object':
      return {} as T;
    case 'array':
      return ([] as unknown) as T;
    case 'map':
      return (new Map() as unknown) as T;
    case 'set':
      return (new Set() as unknown) as T;
    default:
      return undefined;
  }
};

// ----------------------
// NUMBERS
// ----------------------

export const numberMinMax = (
  number: number,
  min: number = 0,
  max: number = 100
): number => Math.max(Math.min(max, number), min);

export const countDecimals = (value: number): number => {
  if (isNullOrUndefined(value) || Math.floor(value) === value || isNaN(value)) {
    return 0;
  }
  return value.toString().split('.')[1].length || 0;
};

export const isInteger = (num: number): boolean => {
  return isNumber(num) && Math.floor(num) === num;
};

export const roundToDecimals = (num: number, decmls: number = 3): number => {
  return isInteger(num)
    ? num
    : Math.round((num + Number.EPSILON) * Math.pow(10, decmls)) /
        Math.pow(10, decmls);
};

export const closestNumber = (val: number, from: number[]): number => {
  return from[
    from
      .map(function (a, key) {
        return [Math.abs(a - val), key];
      })
      .sort((a, b) => a[0] - b[0])[0][1]
  ];
};

export const closestDivisable = (val: number, step: number = 1): number => {
  const polarity = val < 0 ? -1 : 1;
  val = Math.abs(val || 0);
  step = Math.abs(step || 1);
  const c1 = val - (val % step);
  const c2 = val + step - (val % step);
  return (val - c1 > c2 - val ? c2 : c1) * polarity;
};

// ----------------------
// CONVERTERS
// ----------------------

export const asArray = <T = unknown>(
  smth: T | T[] | Iterable<T>,
  castFalsey = true
): T[] =>
  isNullOrUndefined(smth) && castFalsey
    ? []
    : isArray(smth)
    ? smth
    : isIterable(smth)
    ? Array.from(smth)
    : [smth];

export const asNumber = (smth: any, roundToDcmls = null): number => {
  if (!smth) {
    return 0;
  }
  if (!isNumber(smth)) {
    smth = isString(smth)
      ? parseFloat(smth.replace(/[,\s]/g, '').slice(0, 16))
      : NaN;
  }
  return smth !== smth || !isNumber(roundToDcmls)
    ? smth
    : roundToDecimals(smth, roundToDcmls);
};

export const parseToNumber = asNumber;

// ----------------------
// OBJECTS
// ----------------------

export const hasProp = <T = GenericObject>(
  obj: T | any,
  key: string,
  strict = true
): boolean =>
  isObject(obj) &&
  ((strict && Object.prototype.hasOwnProperty.call(obj, key)) ||
    (!strict && typeof obj[key] !== 'undefined'));

export const objectHasTruthyValue = (obj: GenericObject): boolean =>
  isNotEmptyObject(obj) && Boolean(Object.values(obj).find((v) => Boolean(v)));

export const keysFromArrayOrObject = (smth: string[] | {}): string[] =>
  Array.isArray(smth) ? smth : Object.keys(smth);

export const getKeyByValue = (object: GenericObject, value: any) =>
  Object.keys(object).find((key) => object[key] === value);

export const onlyUpdatedProps = <T = GenericObject>(
  oldObj: Partial<T>,
  newObj: Partial<T>,
  equalCheck: (
    a: Partial<T>,
    b: Partial<T>
  ) => boolean = isEqualByValuesConfigured({
    limit: 5000,
    primitives: true,
    sort: false,
  })
): Partial<T> => {
  if (isEmptyObject(oldObj)) {
    return { ...newObj };
  }

  if (isEmptyObject(newObj)) {
    return {};
  }

  return Object.keys(newObj)
    .filter(
      (key: string) =>
        !hasProp(oldObj, key) || !equalCheck(oldObj[key], newObj[key])
    )
    .reduce((updObj, key) => {
      updObj[key] = newObj[key];
      return updObj;
    }, {});
};

export const objectRemoveKey = <T = GenericObject>(
  object: T,
  key: string
): T => {
  if (!isObject(object)) {
    return object;
  }
  const { [key]: deletedKey, ...otherKeys } = object as GenericObject;
  return otherKeys as T;
};

export const objectRemoveKeys = <T = GenericObject>(
  object: T,
  keys: string[]
): T => {
  return (
    object &&
    Object.keys(object)
      .filter((key) => !asArray(keys).includes(key))
      .reduce((acc, key) => {
        acc[key] = object[key];
        return acc;
      }, {} as T)
  );
};

export const objectRemoveEntriesByValue = <T = GenericObject>(
  object: T,
  values: any[]
): T => {
  return (
    object &&
    Object.keys(object)
      .filter((key) => !asArray(values).includes(object[key]))
      .reduce((acc, key) => {
        acc[key] = object[key];
        return acc;
      }, {} as T)
  );
};

export const objectRemoveEntriesWithFalseyValue = <T = GenericObject>(
  object: T,
  config: { remove?: any | any[]; allow?: any | any[] } = {}
): T => {
  const allow = asArray(config?.allow, false);
  const remove = asArray(config?.remove, false);

  return (
    object &&
    Object.keys(object)
      .filter((key) => {
        return remove
          ? !remove.includes(object[key])
          : allow
          ? Boolean(object[key]) || allow.includes(object[key])
          : Boolean(object[key]);
      })
      .reduce((acc, key) => {
        acc[key] = object[key];
        return acc;
      }, {} as T)
  );
};

export interface ObjectStringIDConfig {
  key?: string;
  limit?: number;
  addId?: boolean;
  primitives?: boolean;
  ignoreProps?: string[];
}

export const objectStringID = <T = GenericObject>(
  obj: T,
  config: ObjectStringIDConfig = { limit: 1500, primitives: true }
): string => {
  const { key, limit, addId, primitives, ignoreProps } = config;

  if (isArray(ignoreProps) && isObject(obj)) {
    obj = objectRemoveKeys<T>(obj, ignoreProps);
  }

  const str = String(
    primitives !== false || obj instanceof Date
      ? JSON.stringify(obj)
      : stringify(obj, null, 1)
  ).replace(/[\s\//'"\.,:\-_\+={}()\[\]]+/gi, '');
  const len = str.length;
  const slice =
    limit && len > limit
      ? [Math.floor((len - limit) / 2), Math.floor((len - limit) / 2) + limit]
      : null;

  const sliced = slice
    ? str.slice(0, 30) + '__' + str.slice(...slice) + '__' + str.slice(-30)
    : str;

  return (
    (key ? key + '__' : '') +
    (sliced || typeof obj + (addId ? '__' + simpleUID() : '[empty]')) +
    ('__' + len)
  ).toLowerCase();
};

export const objectStringIDconfigured = <T = GenericObject>(
  config: ObjectStringIDConfig | EqualByValuesConfig = {
    limit: 400,
    primitives: true,
  }
) => (obj: T): string => {
  return objectStringID<T>(
    config['sort'] !== false
      ? (dataDeepSort<T>(obj, config?.ignoreProps || null) as T)
      : obj,
    config
  );
};

export const objectGetPropertyDescriptor = (
  obj: any,
  key: string
): PropertyDescriptor => {
  if (!obj || isPrimitive(obj)) {
    return undefined;
  }
  let descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
    obj,
    key
  );

  while (!descriptor && Object.getPrototypeOf(obj)) {
    obj = Object.getPrototypeOf(obj);
    descriptor = Object.getOwnPropertyDescriptor(obj, key);
  }

  return descriptor;
};

// objectGetDeepestValid(error, 'error.error')
export const objectGetDeepestValid = <T = any, V = any>(
  obj: T,
  path: string,
  fallback?: V
): V => {
  if (!isObject(obj) || !isString(path)) {
    return fallback;
  }

  if (!isNullOrUndefined(obj[path])) {
    return obj[path] as V;
  }

  const pathParts = path.split('.');
  let index = 0;
  let value: T | V = obj;

  while (!isNullOrUndefined(value[pathParts[index]])) {
    value = value[pathParts[index]];
    ++index;
  }

  return (fallback !== undefined && (value === undefined || value === obj)
    ? fallback
    : value) as V;
};

// ----------------------
// ARRAYS
// ----------------------

export const isIterable = <T = any>(smth: any): smth is Iterable<T> => {
  if (!smth || isNumber(smth) || isString(smth)) {
    return false;
  }
  return typeof smth[Symbol.iterator] === 'function';
};

export const arrayDifference = <T = any>(arrA: T[], arrB: T[]): T[] => {
  return arrA
    .filter((x) => !arrB.includes(x))
    .concat(arrB.filter((x) => !arrA.includes(x)));
};

export const arrayIntersection = <T = any>(arrA: T[], arrB: T[]): T[] =>
  (arrA && arrB && arrA.filter((x) => arrB.includes(x))) || [];

export const arrayCommon = arrayIntersection;

// compares by values, ignoring order and if !strict - letter case
export const simpleArraysEqual = <T>(arr1: T[], arr2: T[], strict = true) => {
  if (!isArray(arr1) || !isArray(arr2) || arr1.length !== arr2.length) {
    return false;
  }
  if (arr1 === arr2) {
    return true;
  }

  return strict
    ? arrayDifference(arr1, arr2).length === 0
    : arr1
        .map((i) => stringify(i))
        .sort()
        .join('|')
        .toLowerCase() ===
        arr2
          .map((i) => stringify(i))
          .sort()
          .join('|')
          .toLowerCase();
};

export const dedupeArray = <T = any>(arr: T[]): T[] => Array.from(new Set(arr));

export const joinArrays = <T = any>(arr1: T[], ...rest: (T | T[])[]): T[] =>
  dedupeArray((arr1 || []).concat(...rest.filter((i) => i !== undefined)));

export const simpleArrayAddItemUnique = <T = any>(arr: T[], item: T): T[] =>
  arr.filter((i) => i !== item).concat(item);

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

export const arrayInsertAt = <T = any>(
  arr: T[],
  val: any | any[],
  index = 0,
  overwrite = false
): T[] => {
  return (arr || [])
    .slice(0, index)
    .concat(val, (arr || []).slice(!overwrite ? index : index + 1));
};

export const arrayRemoveAtIndex = <T = any>(
  arr: T[],
  index: number,
  itemsCount = 1
): T[] => {
  arr = arr.slice();
  arr.splice(index, itemsCount);
  return arr;
};

export const arrayRemoveAtIndexMutate = <T = any>(
  arr: T[],
  index: number,
  itemsCount = 1
): T[] => {
  arr.splice(index, itemsCount);
  return arr;
};

export const arrayRemoveItemMutate = <T = any>(arr: T[], item: T): T[] => {
  arrayRemoveAtIndexMutate(
    arr,
    arr.findIndex((i) => i === item)
  );
  return arr;
};

export const arrayRemoveItemsMutate = <T = any>(arr: T[], items: T[]): T[] => {
  const arrCopy = arr.slice();
  arr.length = 0;
  arr.push(...arrCopy.filter((id) => !items.includes(id)));
  return arr;
};

export const lastItem = <T = any>(arr: T[]): T =>
  !isIterable(arr) ? ((arr as any) as T) : arr[arr.length - 1];

// export const arrayFlatten = <T = any>(arr: any[]): T[] =>
//   asArray(arr).reduce((acc, val) => acc.concat(val), []);

export const arrayFlatten = <T = any>(smth: any[]): T[] =>
  Array.isArray(smth)
    ? smth.reduce((result, val) => result.concat(arrayFlatten(val)), [])
    : smth;

export const arrayMode = <T = any>(arr: T[]): T =>
  isArray(arr) &&
  arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();

export const joinWithAnd = (arr: string[], translation = 'and'): string => {
  arr = asArray(arr).filter(Boolean);
  const end = arr.pop() || '';
  const start = arr.join(', ');

  return start ? `${start} ${translation} ${end}` : end;
};

export const splitArrayToChunks = <T = any>(
  array: T[],
  chunkLength: number
): T[][] => {
  const temparray: T[][] = [];

  for (let i = 0, j = array.length; i < j; i += chunkLength) {
    temparray.push(array.slice(i, i + chunkLength));
  }

  return temparray;
};

// ----------------------
// SETS
// ----------------------

export const addToSet = <T = unknown>(
  targetSet: Set<T>,
  values: T | T[] | Set<T> | Iterable<T>
): Set<T> => {
  if (!targetSet) {
    return new Set(asArray<T>(values));
  }
  asArray<T>(values).forEach((v) => targetSet.add(v));
  return targetSet;
};

export const removeFromSet = <T = unknown>(
  targetSet: Set<T>,
  values: T | T[] | Set<T> | Iterable<T>
): Set<T> => {
  if (!targetSet) {
    return new Set();
  }
  asArray<T>(values).forEach((v) => targetSet.delete(v));
  return targetSet;
};

// ----------------------
// MAPS
// ----------------------

export const withMapItemsInIndexRange = <K = unknown, V = unknown>(
  map: Map<K, V>,
  callback: (key: K, value: V) => void,
  startindex?: number,
  endindex?: number
): void => {
  if (!isMap(map) || map.size === 0) {
    return;
  }

  const keys = Array.from(map.keys()).slice(
    startindex || 0,
    Math.min(endindex || map.size, map.size)
  );

  for (const k of keys) {
    callback(k, map.get(k));
  }
};

export const mapSplice = <K = unknown, V = unknown>(
  map: Map<K, V>,
  startindex: number,
  deleteCount?: number,
  ...elementsToInsert: [K, V][]
): Map<K, V> => {
  const deletedElementsMap: Map<K, V> = new Map();

  if (!isMap(map) || map.size === 0) {
    return deletedElementsMap;
  }

  withMapItemsInIndexRange(
    map,
    (key: K, value: V) => {
      deletedElementsMap.set(key, value);
      map.delete(key);
    },
    startindex,
    Math.min(startindex + (deleteCount || map.size), map.size)
  );

  return deletedElementsMap;
};

export const getMapValues = <K = string, V = unknown>(map: Map<K, V>): V[] => {
  return Array.from(map.values());
};

export const getMapKeys = <K = string, V = unknown>(map: Map<K, V>): K[] => {
  return Array.from(map.keys());
};

// ----------------------
// STRINGS
// ----------------------

export const stringify = (smth: any, limit = 300, limitKeys = null): string => {
  const stringified =
    isPrimitive(smth) || smth instanceof Date
      ? String(smth)
      : isArray(smth)
      ? '[' +
        smth
          .reduce((str, i) => {
            if (!limit || str.length < limit * 0.7) {
              str += `${stringify(i, limit, limitKeys)}, `;
            }
            return str;
          }, '')
          .replace(/[\s,]+$/, '') +
        ']'
      : isFunction(smth)
      ? String(smth).split('{')[0].trim().replace('function', 'fnc')
      : isObject(smth)
      ? '{' +
        Object.keys(smth)
          .reduce((str, k) => {
            if ((!limit || str.length < limit * 0.7) && smth[k] !== undefined) {
              str += `${limitKeys ? k.slice(0, limitKeys) : k}: ${stringify(
                smth[k],
                limit,
                limitKeys
              )}, `;
            }
            return str;
          }, '')
          .replace(/[\s,]+$/, '') +
        '}'
      : String(smth);

  return limit && stringified.length > limit
    ? stringified.slice(0, limit) + '...'
    : stringified;
};

export const capitalize = (smth: string): string => {
  if (!isString(smth)) {
    return smth;
  }
  smth = smth.trim();
  return smth.charAt(0).toUpperCase() + smth.slice(1);
};

export const capitalizeAll = (smth: string): string => {
  if (!isString(smth)) {
    return smth;
  }
  return smth
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((ss) => capitalize(ss))
    .join(' ');
};
// smth
//   .trim()
//   .toLowerCase()
//   .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

export const padWith0 = (number: string | number, digits = 2): string => {
  if (isNullOrUndefined(number) || isNaN(parseInt(number as string, 10))) {
    return number as any;
  }

  return String(number).padStart(digits, '0');
};

export const sameStringsDifferentCase = (a: string, b: string): boolean => {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  a = a.trim();
  b = b.trim();
  return (
    a !== b && a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
  );
};

export const normalizeString = (value: string): string => {
  return (
    value &&
    String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  );
};

export const testNormalized = (partial: string, full: string): boolean => {
  const matcher = getMatcher(partial);
  return matcher.test(normalizeString(full));
};

// ----------------------
// FUNCTIONS
// ----------------------

export type Func<A = any, B = A> = (val: A, ...args: any[]) => B;

export const pass = <T = any>(a: T): T => a;

export const chainCall = <A = any, B = A>(
  funcs: Func<A | B, A | B>[],
  value: A,
  ...args: any[]
): B => {
  return funcs.reduce(
    (previousResult, fn) => fn(previousResult, ...args),
    value
  ) as B;
};

export const pipe = <T = any>(...functions: ((val: T) => T)[]) => (
  value: T
) => {
  return functions.reduce((currentValue, currentFunction) => {
    return currentFunction(currentValue);
  }, value);
};

export const compose = <T = any>(...functions: ((val: T) => T)[]) => (
  value: T
) => {
  return functions.reduceRight(
    (currentValue, currentFunction) => currentFunction(currentValue),
    value
  );
};

// ----------------------
// DATES
// ----------------------

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

export const isDateISO8601 = (date: string): boolean => {
  if (!isString(date)) {
    return false;
  }

  const parts = date.split('-');
  return (
    parts.length === 3 && parts[0].length === 4 && parseInt(parts[1], 10) < 13
  );
};

export const isDateOrDateString = (value: Date | string) =>
  value && isDate(new Date(value));

export const isDateFormat = (frmt: string): boolean => {
  if (!isString(frmt)) {
    return false;
  }
  const split = frmt.toUpperCase().split(/[.|\-|/|:| ]+/);

  return (
    split.length > 1 &&
    (!!split.find((i) => i === 'DD') ||
      !!split.find((i) => i === 'YYYY') ||
      !!split.find((i) => i.includes('MM')))
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
      (i) => i.toLowerCase() === (month as string).toLowerCase()
    );
    if (num === -1) {
      return month as any;
    }
  } else if (minusOne) {
    num = num - 1;
  }
  return Math.max(0, Math.min(11, num));
};

export const isSameDay = (
  dateA: Date | string,
  dateB: Date | string
): boolean => {
  const isTruthyStringOrDate = (smth: any) =>
    Boolean(smth) && (isString(smth) || isDate(smth));

  if (
    [isTruthyStringOrDate(dateA), isTruthyStringOrDate(dateB)].join() !==
      [isTruthyStringOrDate(dateB), isTruthyStringOrDate(dateA)].join() ||
    (isString(dateA) && isString(dateB) && dateA !== dateB) ||
    (isDate(dateA) &&
      isDate(dateB) &&
      [dateA.getFullYear(), dateA.getMonth(), dateA.getDay()].join() !==
        [dateB.getFullYear(), dateB.getMonth(), dateB.getDay()].join())
  ) {
    return false;
  }

  return true;
};

// ----------------------
// REGEX
// ----------------------

export const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
};

export const stringToRegex = (value: string, options = 'i'): RegExp => {
  return new RegExp(escapeRegExp(value), options);
};

export const getMatcher = (searchStr: string): RegExp =>
  stringToRegex(normalizeString(searchStr), 'i');

export const getFuzzyMatcher = (searchStr: string): RegExp =>
  new RegExp(
    normalizeString(searchStr)
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\*\[\]\+><@\s]+/g, '')
      .split('')
      .join('[.,\\/#!$%\\^&\\*;:{}=\\-_`~()\\*\\[\\]\\+><@\\s]*'),
    'i'
  );

// ----------------------
// RANDOMIZERS
// ----------------------

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

// ----------------------
// SORTERS
// ----------------------

export const sortByLength = (
  strA: string | any[],
  strB: string | any[],
  dir: SortType = 'asc'
) => {
  if (!dir) {
    return 0;
  }
  return dir === 'desc'
    ? (strB?.length || 0) - (strA?.length || 0)
    : (strA?.length || 0) - (strB?.length || 0);
};

export const arrOfObjSortByProp = <T = GenericObject<string | number>>(
  arr: T[],
  prop: string,
  dir: SortType = 'asc'
): T[] => {
  if (isEmptyArray(arr) || !dir) {
    return arr;
  }

  arr.sort((a: GenericObject, b: GenericObject) => {
    const x: string | number = isString(a[prop])
      ? a[prop].toLowerCase()
      : a[prop];
    const y: string | number = isString(b[prop])
      ? b[prop].toLowerCase()
      : b[prop];
    return dir === 'desc'
      ? x < y
        ? 1
        : x > y
        ? -1
        : 0
      : x < y
      ? -1
      : x > y
      ? 1
      : 0;
  });

  return arr;
};

export const objectSortKeys = <T = GenericObject>(
  obj: T,
  removeKeys: string[] = null
): T => {
  if (!isPlainObject(obj)) {
    return obj;
  }
  return Object.keys(obj)
    .sort()
    .reduce((newObj: T, key: string) => {
      if (
        (isArray(removeKeys) && removeKeys.includes(key)) ||
        obj[key] === undefined
      ) {
        return newObj;
      }
      newObj[key] = obj[key];
      return newObj;
    }, {} as T);
};

export const dataDeepSort = <T = any>(
  data: T | T[],
  removeKeys = null
): T | T[] => {
  if (isPrimitive(data) || isEmpty(data)) {
    return data;
  }

  const sortedData: T[] = asArray(data, false)
    .map((di: T) => {
      if (isArray(di)) {
        return dataDeepSort<T>(di) as T;
      }

      if (isPlainObject(di)) {
        const srtd: T = objectSortKeys<T>(di, removeKeys);
        Object.keys(srtd).forEach((key) => {
          srtd[key] = dataDeepSort<T>(srtd[key]);
        });
        return srtd;
      }

      return di;
    })
    .sort((a: T, b: T) => {
      if (a === b) {
        return 0;
      }
      if (isNumber(a) && isNumber(b)) {
        return a - b;
      }
      if (isPrimitive(a) && isPrimitive(b)) {
        return String(a).localeCompare(String(b));
      }
      if (!a || !b) {
        return Boolean(a) ? 1 : -1;
      }

      return objectStringID<T>(a, {
        limit: 30,
        primitives: true,
      }).localeCompare(
        objectStringID<T>(b, {
          limit: 30,
          primitives: true,
        })
      );
    });

  return isArray(data) ? (sortedData as T[]) : (sortedData[0] as T);
};

// let testArr = [
//   '02-03',
//   '1985-02-25',
//   '09-24',
//   '12-30',
//   '12-15',
//   '01-05',
//   '01-15',
// ].sort(sortBirthDateStrings);
// => [ '01-05', '01-15', '02-03', '1985-02-25', '09-24', '12-15', '12-30' ]
export const sortBirthDateStrings = (bd1: string, bd2: string): number => {
  const [bd1num, bd2num] = [bd1, bd2].map(
    (bdstr) =>
      bdstr
        .split(/\W/)
        .slice(-2)
        .reduce((res, num, indx) => {
          return indx === 0
            ? (res = Math.round((parseInt(num, 10) * 100) / 12))
            : (res = res * 100 + Math.round((parseInt(num, 10) * 100) / 31));
        }, 0) || 0 // 0 if NaN
  );
  return bd1num - bd2num;
};

// ----------------------
// COMPARATORS
// ----------------------

export const compareAsNumbers = (
  a: string | number,
  b: string | number
): boolean => asNumber(a) === asNumber(b);

export const compareAsStrings = (a: any, b: any, strict = true): boolean => {
  return strict
    ? String(a) === String(b)
    : String(a)
        .trim()
        .toLowerCase()
        .replace(/[./\\()\"':,.;<>~!@#$%^&*|+=[\]{}`~\?-]/g, '') ===
        String(b)
          .trim()
          .toLowerCase()
          .replace(/[./\\()\"':,.;<>~!@#$%^&*|+=[\]{}`~\?-]/g, '');
};

export interface EqualByValuesConfig extends ObjectStringIDConfig {
  sort?: boolean;
}

export const EQUAL_BY_VALUES_CONFIG_DEF: EqualByValuesConfig = {
  limit: 5000,
  primitives: true,
  sort: true,
};

// ignores order in arrays, only cares about values
export const isEqualByValues = <T = any>(
  dataA: T,
  dataB: T,
  config: EqualByValuesConfig = EQUAL_BY_VALUES_CONFIG_DEF
): boolean => {
  const truthyA = Boolean(dataA),
    truthyB = Boolean(dataB);

  if (dataA === dataB) {
    return true;
  }
  if (
    truthyA !== truthyB ||
    typeof dataA !== typeof dataB ||
    dataA.constructor !== dataB.constructor ||
    ((isPrimitive(dataA) || isPrimitive(dataB)) && dataA !== dataB) ||
    dataA['length'] !== dataB['length'] ||
    dataA['size'] !== dataB['size']
  ) {
    return false;
  }

  return (
    objectStringID(
      config.sort !== false
        ? dataDeepSort<T>(dataA, config?.ignoreProps || null)
        : dataA,
      config
    ) ===
    objectStringID(
      config.sort !== false
        ? dataDeepSort<T>(dataB, config?.ignoreProps || null)
        : dataB,
      config
    )
  );
};

export const isEqualByValuesConfigured = <T = any>(
  config: EqualByValuesConfig
) => (dataA: T, dataB: T): boolean => {
  return isEqualByValues<T>(dataA, dataB, config);
};

// ----------------------
// FILTERS
// ----------------------

/**
 *
 * @param array The array the filter is applied on
 * @param childrenKey The recursive key in the object, i.e: children
 * @param fn The function predicate for the filter
 * // returns a copy of the array
 const array = [
 { v: 'a', archived: false,
   y: [ {v: 'a-1', archived: true}, {v: 'a-2', archived: false } ]
 },
 { v: 'b', archived: true,
   y: [ {v: 'b-1', archived: false} ]
 }
 ];
 recursiveFilter(array, 'y', o => !o.archived); // [{ v: 'a', archived: false, y: [{v: 'a-2', x: false}]}]
 */
export const recursiveFilter = <T = any>(
  array: T[],
  childrenKey: string,
  fn: (item: T) => boolean
): T[] => {
  return array.reduce((acc: T[], o) => {
    if (fn(o)) {
      const children = recursiveFilter(o[childrenKey] || [], childrenKey, fn);
      acc.push(
        Object.assign(
          {},
          o,
          children.length ? { [childrenKey]: children } : { [childrenKey]: [] }
        )
      );
    }
    return acc;
  }, []);
};

// ----------------------
// CLONES
// ----------------------

export const cloneObject = <T = GenericObject>(value: T): T =>
  isObject(value) ? Object.assign({}, value) : value;

export const cloneArray = <T = unknown>(value: T[]): T[] =>
  isArray<T>(value) ? value.slice() : value;

export const cloneValue = <T = unknown>(value: T): T =>
  (isObject(value)
    ? cloneObject(value)
    : isArray(value)
    ? cloneArray(value)
    : value) as T;

export const cloneDeepSimpleObject = <T = GenericObject>(obj: T): T => {
  if (!obj || obj !== obj || isPrimitive(obj)) {
    return obj;
  }
  if (!isPlainObject(obj) && !isArray(obj)) {
    log.wrn(
      `${getType(obj)} (${stringify(obj, 100)}) is not a simple object`,
      'cloneDeepSimpleObject'
    );
    return cloneDeep(obj);
  }
  return JSON.parse(JSON.stringify(obj));
};

// ----------------------
// EVENTS
// ----------------------

export const isKey = (key: string, expected: string): boolean =>
  key && expected && key.toUpperCase() === expected.toUpperCase();

export const isMetaKey = (key: string): boolean =>
  metaKeys.includes(key as any);

export const eventHasCntrlKey = (event: KeyboardEvent | MouseEvent): boolean =>
  event.metaKey || event.ctrlKey;

export const eventHasShiftlKey = (event: KeyboardEvent | MouseEvent): boolean =>
  event.shiftKey;

export const eventHasMetaKey = (event: KeyboardEvent | MouseEvent): boolean =>
  event.metaKey || event.shiftKey || event.ctrlKey || event.altKey;

export const getEventPath = (event: Event): HTMLElement[] =>
  ((event['path'] as any[]) ||
    (event.composedPath && (event.composedPath() as any[])) ||
    []) as HTMLElement[];

export const keyEventIsCharacter = (event: KeyboardEvent): boolean => {
  // tslint:disable-next-line: deprecation
  const code = event.which || event.keyCode;

  return (
    (!controlKeys.includes(event.key as Keys) && !eventHasCntrlKey(event)) ||
    code === KEYCODES.IME
  );
};

// ----------------------
// DOM
// ----------------------

export const isWindow = (val: any): val is Window & typeof globalThis => {
  return thisClassName(val) === 'Window' && val.document;
};

export const isDocument = (val: any): val is Document => {
  return (
    thisClassName(val) === 'HTMLDocument' &&
    (val.defaultView || val['parentWindow'])
  );
};

export const getElementDocument = (
  element: HTMLElement | Node | Document | Window
): Document => {
  return (
    element &&
    (isDocument(element)
      ? element
      : element['ownerDocument'] || element['document'])
  );
};

export const getElementWindow = (
  element: HTMLElement | Node | Document | Window
): Window & typeof globalThis => {
  if (!element || isWindow(element)) {
    return element as Window & typeof globalThis;
  }
  const doc = getElementDocument(element);
  return doc && (doc.defaultView || doc['parentWindow']);
};

export const insertAfter = (
  newNode: HTMLElement | Node,
  referenceNode: HTMLElement | Node,
  clone = false
): HTMLElement => {
  if (!isNode(newNode, null) || !isNode(referenceNode, null)) {
    return;
  }
  return referenceNode.parentNode.insertBefore(
    clone ? newNode.cloneNode(true) : newNode,
    referenceNode.nextSibling
  ) as HTMLElement;
};

export const countChildren = (
  parentSelector?: string,
  parent?: HTMLElement | Node
) => {
  parent = parentSelector ? document.querySelector(parentSelector) : parent;
  if (!parent) {
    return 0;
  }
  let relevantChildren = 0;
  for (const child of Array.from(parent.childNodes)) {
    if (child.nodeType !== 3 && child.nodeType !== 8) {
      if (child['tagName']?.toLowerCase() !== 'svg') {
        relevantChildren += countChildren(null, child);
      }
      relevantChildren++;
    }
  }
  return relevantChildren;
};

export const injectStyles = (
  styles: string = '',
  elem: HTMLElement | Document = document,
  win: (Window & typeof globalThis) | WindowLike = window
): void => {
  win = win || getElementWindow(elem);
  let styleEl: HTMLStyleElement, existingStyles: string;
  if (!elem || elem === win?.document) {
    elem = win?.document.head;
  }
  if (!elem) {
    return;
  }
  styleEl = elem.querySelector(`style[data-injected="true"]`);
  if (styleEl) {
    existingStyles = styleEl.innerHTML.replace(/\s*/gim, '');
  }
  if (!styleEl && styles) {
    styleEl = win.document.createElement('style');
    styleEl.setAttribute('data-injected', 'true');
    elem.appendChild(styleEl);
  }
  if (
    styles &&
    (!existingStyles ||
      (existingStyles && styles.replace(/\s*/gim, '') !== existingStyles))
  ) {
    styleEl.innerHTML = `${
      existingStyles ? existingStyles + '\n' : ''
    }${styles}`;
    return;
  }
  if (styleEl && !styles) {
    styleEl.remove();
  }
};

// set any css properties
// (provided as JSON with props in kebab-case),
// including css variables ('--color-red')
export const setCssProps = (
  element: HTMLElement,
  props: Styles,
  win: (Window & typeof globalThis) | WindowLike = window
): void => {
  win = win || getElementWindow(element);
  if (!isDomElement(element, win) || !isObject(props)) {
    return;
  }
  for (const prop of Object.keys(props)) {
    if (!isNullOrUndefined(props[prop])) {
      element.style.setProperty(prop, props[prop] as string);
    } else {
      element.style.removeProperty(prop);
    }
  }

  const currStyleAttr = element.getAttribute('style');
  if (!currStyleAttr) {
    return;
  }

  if (currStyleAttr.trim() === '') {
    element.removeAttribute('style');
  }
  if (currStyleAttr !== currStyleAttr.trim()) {
    element.setAttribute('style', currStyleAttr.trim());
  }
};

export const setAttributes = (
  element: HTMLElement,
  attrs: GenericObject,
  overWriteExisting = true,
  win: (Window & typeof globalThis) | WindowLike = window
): void => {
  win = win || getElementWindow(element);
  if (!isDomElement(element, win)) {
    return;
  }
  for (const attr of Object.keys(attrs)) {
    if (!isNullOrUndefined(attrs[attr])) {
      if (
        attr !== 'style' &&
        (overWriteExisting || !element.getAttribute(attr))
      ) {
        element.setAttribute(attr, attrs[attr]);
      }
      if (attr === 'style') {
        setCssProps(element, attrs[attr]);
      }
    } else {
      element.removeAttribute(attr);
    }
  }
};

export const elementIsInView = (
  element: HTMLElement,
  win: (Window & typeof globalThis) | WindowLike = window
): boolean => {
  win = win || getElementWindow(element);
  if (!isDomElement(element, win)) {
    return;
  }
  const { top, height } = element.getBoundingClientRect();
  const vpHeight = win.innerHeight || win.document.documentElement.clientHeight;

  return top <= vpHeight && top + height >= 0;
};

export const getClosestUntil = (
  element: HTMLElement | Node,
  closestSelector: string,
  until: string | HTMLElement,
  win: (Window & typeof globalThis) | WindowLike = window
): HTMLElement => {
  win = win || getElementWindow(element);

  if (
    !(isTextNode(element, win) || isDomElement(element, win)) ||
    !closestSelector ||
    !until
  ) {
    return null;
  }

  let parent =
    element.nodeType === Node.TEXT_NODE
      ? element.parentElement
      : (element as HTMLElement);

  if (!parent) {
    return null;
  }

  while (
    ((isDomElement(until, win) && until !== parent) ||
      (isString(until) && !parent.matches(until))) &&
    !parent.matches(closestSelector) &&
    parent !== win.document.documentElement &&
    parent.parentElement
  ) {
    parent = parent.parentElement;
  }

  return parent?.matches(closestSelector) ? parent : null;
};

export const getSiblingElement = (
  element: HTMLElement,
  selector: string = null,
  which: 'next' | 'prev' = 'next',
  win: (Window & typeof globalThis) | WindowLike = window
): HTMLElement => {
  win = win || getElementWindow(element);
  if (!isDomElement(element, win)) {
    return null;
  }
  let sibling: HTMLElement =
    which === 'prev'
      ? (element.previousElementSibling as HTMLElement)
      : (element.nextElementSibling as HTMLElement);
  if (!selector) {
    return sibling;
  }
  while (sibling) {
    if (sibling.matches(selector)) {
      return sibling;
    }
    sibling =
      which === 'prev'
        ? (sibling.previousElementSibling as HTMLElement)
        : (sibling.nextElementSibling as HTMLElement);
  }
  return null;
};

// ----------------------
// NGONCHANGES HELPERS
// ----------------------

export interface ChangesHelperConfig {
  keyMap?: { [targetKey: string]: string };
  firstChange?: boolean | null;
  skipSetters?: boolean;

  discardAllFalsey?: boolean;
  checkEquality?: boolean;

  truthyCheck?: (val: unknown) => boolean;
  equalCheck?: (valA: unknown, valB: unknown) => boolean;
  transform?: { [prop: string]: (val: any) => any };
}

export const CHANGES_HELPER_CONFIG_DEF: ChangesHelperConfig = {
  discardAllFalsey: false,
  truthyCheck: Boolean,
  checkEquality: false,
  equalCheck: isEqualByValuesConfigured({
    limit: 5000,
    primitives: true,
    sort: false,
  }),
  firstChange: null,
  skipSetters: true,
};

export const CHANGES_SET_PROPS = 'setProps';

export const simpleChange = (
  changes: GenericObject = {},
  firstChange = false,
  previousValues: GenericObject = {}
): SimpleChanges => {
  const simpleChanges = {};
  Object.keys(changes).forEach((key) => {
    simpleChanges[key] = new SimpleChange(
      previousValues && previousValues[key] !== undefined
        ? previousValues[key]
        : undefined,
      changes[key],
      firstChange
    );
  });
  return simpleChanges;
};

const simpleChangeFilter = (
  change: SimpleChange,
  config?: ChangesHelperConfig
): boolean => {
  config = { ...CHANGES_HELPER_CONFIG_DEF, ...config };
  const { discardAllFalsey, truthyCheck, checkEquality, equalCheck } = config;

  return (
    change !== undefined &&
    // (change.currentValue !== undefined || change.previousValue !== undefined)
    change.currentValue !== change.previousValue &&
    (!discardAllFalsey ||
      (discardAllFalsey && truthyCheck(change.currentValue))) &&
    (!checkEquality ||
      (checkEquality && !equalCheck(change.currentValue, change.previousValue)))
  );
};

export const hasChanges = (
  changes: SimpleChanges,
  keys: string[] = null,
  discardAllFalsey = CHANGES_HELPER_CONFIG_DEF.discardAllFalsey,
  config?: ChangesHelperConfig
): boolean => {
  if (!changes) {
    return false;
  }

  if (!keys) {
    keys = Object.keys(changes);
  }

  config = {
    ...config,
    discardAllFalsey: config?.discardAllFalsey || discardAllFalsey,
  };
  const { firstChange } = config;

  return Boolean(
    keys.find((i) => {
      if (
        !changes[i] &&
        changes[CHANGES_SET_PROPS]?.currentValue?.hasOwnProperty(i)
      ) {
        changes[i] = simpleChange(
          {
            [i]: changes[CHANGES_SET_PROPS].currentValue[i],
          },
          changes[CHANGES_SET_PROPS].firstChange,
          {
            [i]:
              changes[CHANGES_SET_PROPS].previousValue &&
              changes[CHANGES_SET_PROPS].previousValue[i],
          }
        )[i];
      }

      return (
        changes[i] &&
        (!isBoolean(firstChange) ||
          (firstChange === true && changes[i].firstChange) ||
          (firstChange === false && !changes[i].firstChange)) &&
        simpleChangeFilter(changes[i], config)
      );
    })
  );
};

export const firstChanges = (
  changes: SimpleChanges,
  keys: string[] = null,
  discardAllFalsey = CHANGES_HELPER_CONFIG_DEF.discardAllFalsey,
  config: ChangesHelperConfig = CHANGES_HELPER_CONFIG_DEF
): boolean =>
  hasChanges(changes, keys, discardAllFalsey, {
    ...config,
    firstChange: true,
  });

export const notFirstChanges = (
  changes: SimpleChanges,
  keys: string[] = null,
  discardAllFalsey = CHANGES_HELPER_CONFIG_DEF.discardAllFalsey,
  config: ChangesHelperConfig = CHANGES_HELPER_CONFIG_DEF
): boolean =>
  hasChanges(changes, keys, discardAllFalsey, {
    ...config,
    firstChange: false,
  });

export const applyChanges = (
  target: any,
  changes: SimpleChanges,
  defaults: GenericObject = {},
  skip: string[] = [],
  discardAllFalsey = CHANGES_HELPER_CONFIG_DEF.discardAllFalsey,
  config: ChangesHelperConfig = CHANGES_HELPER_CONFIG_DEF
): SimpleChanges => {
  if (!changes) {
    return changes;
  }

  config = { ...CHANGES_HELPER_CONFIG_DEF, ...config };
  const { keyMap, skipSetters, truthyCheck, transform } = config;
  discardAllFalsey = config.discardAllFalsey || discardAllFalsey;

  if (keyMap) {
    Object.keys(keyMap).forEach((targetKey: string) => {
      if (changes[keyMap[targetKey]]) {
        changes[targetKey] = changes[keyMap[targetKey]];
        delete changes[keyMap[targetKey]];
        skip.push(keyMap[targetKey]);
      }
    });
  }

  Object.keys(changes).forEach((changeKey: string) => {
    if (
      skip?.includes(changeKey) ||
      (skipSetters !== false &&
        (changeKey === CHANGES_SET_PROPS ||
          objectGetPropertyDescriptor(target, changeKey)?.set))
    ) {
      return;
    }

    target[changeKey] = changes[changeKey].currentValue =
      defaults?.hasOwnProperty(changeKey) &&
      ((!discardAllFalsey &&
        isNullOrUndefined(changes[changeKey]?.currentValue)) ||
        (discardAllFalsey && !truthyCheck(changes[changeKey].currentValue)))
        ? defaults[changeKey]
        : transform && isFunction(transform[changeKey])
        ? transform[changeKey](changes[changeKey]?.currentValue)
        : changes[changeKey]?.currentValue;
  });

  return changes;
};

// ----------------------
// RXJS / OBSERVABLES
// ----------------------

export const isSubject = <T extends Subject<unknown>>(smth: any): smth is T => {
  return (
    smth &&
    (smth instanceof BehaviorSubject ||
      smth instanceof AnonymousSubject ||
      smth instanceof ReplaySubject ||
      smth instanceof Subject ||
      (isFunction(smth.subscribe) &&
        isFunction(smth.next) &&
        isFunction(smth.asObservable)))
  );
};

export const getSubjectValue = <V, T extends BehaviorSubject<V>>(
  subj: T
): V => {
  if (!subj || !isSubject(subj)) {
    return undefined;
  }
  return isFunction(subj.getValue)
    ? subj.getValue()
    : isFunction(subj['destination']?.getValue)
    ? subj['destination'].getValue()
    : undefined;
};

export const prefetchSharedObservables = (
  observables: Observable<any> | Observable<any>[]
): Promise<void> => {
  if (isEmptyArray(observables)) {
    return;
  }
  observables = asArray(observables).filter(Boolean);
  const total = observables.length;
  let counter = 0;

  return new Promise((resolve, reject) => {
    observables.forEach((o) => {
      o?.pipe(take(1), delay(0)).subscribe(
        () => {
          if (++counter === total) {
            resolve();
          }
        },
        (err) => {
          log.err(
            err?.error?.error || err?.error || err,
            'prefetchSharedObservables'
          );
          reject();
        }
      );
    });
  });
};

export const unsubscribeArray = (subs: Subscription[]): void => {
  subs.forEach((sub) => {
    sub?.unsubscribe();
  });
  subs.length = 0;
};

// ----------------------
// MISC HELPERS
// ----------------------

export const thisClassName = <T = unknown>(that: T | Type<T>): string =>
  that?.constructor?.name;

export function MixIn(baseCtors: Function[]) {
  return function (derivedCtor: Function) {
    baseCtors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
  };
}

export const simpleUID = (
  prefix: string = null,
  length: number = 5,
  suffix: string | boolean = true
): string => {
  return (
    (isString(prefix) && prefix
      ? prefix.replace(/(^[\W_]|[\W_]$)/g, '').replace(/\s+/g, '_') + '-'
      : '') +
    Math.random().toString(16).substr(2, length) +
    (isString(suffix)
      ? (length ? '-' : '') + suffix.replace(/\s+/g, '_')
      : suffix !== false
      ? (length ? '-' : '') + String(new Date().getTime()).slice(-4)
      : '')
  );
};

export const isRenderedComponent = (obj: any): obj is RenderedComponent =>
  hasProp(obj, 'component');

export const isSelectGroupOptions = (
  options: any[]
): options is SelectGroupOption[] => {
  return Boolean(
    isNotEmptyArray(options) &&
      options[0] &&
      isArray((options as SelectGroupOption[])[0].options)
  );
};

interface BatchProcessConfig<T = any> {
  batchSize?: number;
  processItem?: (itm: T) => void;
  processBatch?: (chnk: T[]) => void;
  beforeAll?: (itms?: T[]) => void;
  afterAll?: (itms?: T[]) => void;
  processWith?: (callback: Function) => any;
}

export const batchProcess = <T = any>(
  items: T[],
  {
    batchSize = 15,
    processItem = null,
    processBatch = null,
    beforeAll = null,
    afterAll = null,
    processWith = null,
  }: BatchProcessConfig
): void => {
  const processor = isFunction(processWith)
    ? processWith
    : window.requestAnimationFrame;

  const chunks: T[][] = batchSize
    ? splitArrayToChunks(items, batchSize)
    : [items];

  let currentChunkIndex = 0;

  if (beforeAll) {
    beforeAll(items);
  }

  const process = () => {
    if (!chunks[currentChunkIndex]) {
      if (afterAll) {
        afterAll(items);
      }
      return;
    }

    if (processBatch) {
      processBatch(chunks[currentChunkIndex]);
    }

    if (!processBatch && processItem) {
      chunks[currentChunkIndex].forEach((el: T) => {
        processItem(el);
      });
    }

    ++currentChunkIndex;

    processor(() => {
      process();
    });
  };

  processor(() => {
    process();
  });
};

export const isChrome = () => {
  const isChromium = window['chrome'];
  const winNav = window.navigator;
  const vendorName = winNav.vendor;
  const isOpera = typeof window['opr'] !== 'undefined';
  const isIEedge = winNav.userAgent.indexOf('Edge') > -1;
  const isIOSChrome = winNav.userAgent.match('CriOS');

  return (
    isChromium !== null &&
    typeof isChromium !== 'undefined' &&
    vendorName === 'Google Inc.' &&
    isOpera === false &&
    isIEedge === false
  );
};

export const getCopyName = (val: string, copyStr = 'copy'): string => {
  if (!val) {
    return val;
  }
  const match = val.match(new RegExp(`(.+)(${copyStr})\\s*(\\d*)\\s*$`));
  return !match
    ? val + ' ' + copyStr
    : (
        match[1] +
        (match[2] || '') +
        ' ' +
        ((parseInt(match[3], 10) || 1) + 1)
      ).trim();
};

export const getColorGenerator = (
  colorSet = PalletteColorSet.main,
  config?: PaletteColorGeneratorConfig
): PaletteColorGenerator =>
  new ColorPaletteService().paletteColorGenerator(colorSet, config);

export const getPaletteColors = (
  count: number | null = null,
  colorSet: PalletteColorSet | number = PalletteColorSet.main
): ColorPalette[] =>
  new ColorPaletteService().getPaletteColors(count, colorSet);

export const getRandomPaletteColors = (
  count: number | null = null,
  colorSet: PalletteColorSet | number = PalletteColorSet.main
): ColorPalette[] =>
  new ColorPaletteService().getRandomPaletteColors(count, colorSet);

export const getRandomPaletteColor = (
  colorSet: PalletteColorSet | number = PalletteColorSet.main
): ColorPalette => new ColorPaletteService().getRandomPaletteColor(colorSet);

export const getPaletteColorByIndex = (
  index?: number,
  colorSet: PalletteColorSet | number = PalletteColorSet.main
): ColorPalette =>
  new ColorPaletteService().getPaletteColorByIndex(index, colorSet);

export const isDark = (color: Color, sensitivity?: number) =>
  ColorService.prototype.isDark(color, sensitivity);

export const invoke = <T = unknown, R = any>(smth: T, method: string): R => {
  return smth && isFunction(smth[method]) && smth[method]();
};

// ----------------------
// LODASH WRAPS
// ----------------------

export const cloneDeep = <T = unknown>(smth: T): T => {
  return _cloneDeep(smth) as T;
};

export const set = <T = unknown, V = unknown>(
  target: T,
  path: string,
  value: V
): T => {
  return _set(target, path, value);
};

export const get = <T = unknown, V = unknown>(
  source: T,
  path: string,
  defVal?: V | undefined | null
): V => {
  return _get(source, path, defVal);
};

export const merge = <
  T extends GenericObject,
  S extends Partial<T> & GenericObject,
  O extends T & S
>(
  target: T,
  ...sources: S[]
): O => {
  return _merge(target, ...sources);
};

export const assign = <
  T extends GenericObject,
  S extends Partial<T> & GenericObject,
  O extends T & S
>(
  target: T,
  ...sources: S[]
): O => {
  return _assign(target, ...sources);
};

export const pick = <
  T extends GenericObject,
  K extends Extract<keyof T, string>,
  O extends Pick<T, K> & GenericObject
>(
  object: T,
  props: K | K[]
): O => {
  return _pick(object, props);
};

export const omit = <
  T extends GenericObject,
  K extends Extract<keyof T, string>,
  O extends Omit<T, K> & GenericObject
>(
  object: T,
  props: K | K[]
): O => {
  return _omit(object, props);
};

export const sortBy = <T>(list: T[], idBy: (item: T) => string): T[] => {
  return _sortBy(list, idBy);
};
