import { SimpleChanges, SimpleChange, ElementRef } from '@angular/core';
import { controlKeys, KEYCODES, Keys, metaKeys } from '../../enums';
import { GenericObject } from '../../types';
import { isEqual, cloneDeep, set, get, merge } from 'lodash';
import { RenderedComponent } from '../component-renderer/component-renderer.interface';
import { SelectGroupOption } from '../../lists/list.interface';
import { Observable, Subscription } from 'rxjs';
import { delay, take } from 'rxjs/operators';

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

export const isNotEmptyString = (val: any): boolean =>
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

export const isNode = (val: any, nodeType: number = null): val is Node =>
  !!val &&
  // typeof val === 'object' &&
  val instanceof Node &&
  typeof val.nodeName === 'string' &&
  ((nodeType !== null && val.nodeType === nodeType) ||
    (nodeType === null && typeof val.nodeType === 'number'));

export const isTextNode = (val: any): val is Node =>
  isNode(val, Node.TEXT_NODE);

export const isDomElement = (val: any): val is HTMLElement =>
  isNode(val, Node.ELEMENT_NODE);

export const isElementRef = (val: any): val is ElementRef =>
  isDomElement(val?.nativeElement);

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

export const asArray = <T = any>(smth: T | T[], castFalsey = true): T[] =>
  isNullOrUndefined(smth) && castFalsey
    ? []
    : isArray(smth)
    ? (smth as T[])
    : isIterable(smth)
    ? Array.from(smth)
    : ([smth] as T[]);

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
  obj: T,
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
  config: ObjectStringIDConfig = { limit: 400, primitives: true }
): string => {
  const { key, limit, addId, primitives, ignoreProps } = config;

  if (isArray(ignoreProps) && isObject(obj)) {
    obj = objectRemoveKeys<T>(obj, ignoreProps);
  }

  const str = String(
    primitives !== false ? JSON.stringify(obj) : stringify(obj, null, 1)
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
  path: string
): V => {
  if (!isObject(obj) || !isString(path)) {
    return undefined;
  }
  const pathParts = path.split('.');
  let index = 0;
  let value: T | V = obj;

  while (!isNullOrUndefined(value[pathParts[index]])) {
    value = value[pathParts[index]];
    ++index;
  }

  return value as V;
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

// ----------------------
// STRINGS
// ----------------------

export const stringify = (smth: any, limit = 300, limitKeys = null): string => {
  const stringified = isPrimitive(smth)
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

// ----------------------
// FUNCTIONS
// ----------------------

export type Func<A = any, B = A> = (val: A, ...args: any[]) => B;

export const pass = <T = any>(a: T): T => a;

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

export const arrOfObjSortByProp = <T = GenericObject>(
  arr: T[],
  prop: string,
  asc = true
): T[] => {
  arr.sort((a: GenericObject, b: GenericObject) => {
    const x = a[prop].toLowerCase();
    const y = b[prop].toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

  if (!asc) {
    arr.reverse();
  }

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
    ((isPrimitive(dataA) || isPrimitive(dataB)) && dataA !== dataB)
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

export const cloneDeepSimpleObject = <T = GenericObject>(obj: T): T => {
  if (!obj || obj !== obj || isPrimitive(obj)) {
    return obj;
  }
  if (!isPlainObject(obj) && !isArray(obj)) {
    console.warn(`[cloneDeepSimpleObject]:
    ${getType(obj)} (${stringify(obj, 100)}) is not a simple object`);
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
  equalCheck?: <T = unknown>(valA: T, valB: T) => boolean;
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
// OBSERVABLES
// ----------------------

export const prefetchSharedObservables = (
  observables: Observable<any> | Observable<any>[]
): Promise<void> => {
  if (isEmptyArray(observables)) {
    return;
  }
  observables = asArray(observables);
  const total = observables.length;
  let counter = 0;

  return new Promise((resolve, reject) => {
    asArray(observables).forEach((o) => {
      o?.pipe(take(1), delay(0)).subscribe(
        () => {
          if (++counter === total) {
            resolve();
          }
        },
        (err) => {
          console.error(
            '[prefetchSharedObservables] failed:',
            err?.error?.error || err?.error || err
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
  prefix: string = '',
  length: number = 5,
  suffix: string = ''
): string => {
  return (
    prefix.replace(/\s+/g, '_') +
    Math.random().toString(16).substr(2, length) +
    suffix.replace(/\s+/g, '_')
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

export const invoke = <T = unknown, R = any>(smth: T, method: string): R => {
  return smth && isFunction(smth[method]) && smth[method]();
};

// ----------------------
// LODASH WRAPS
// ----------------------

export const _cloneDeep = <T = unknown>(smth: T): T => {
  return cloneDeep(smth) as T;
};

export const _set = <T = unknown, V = unknown>(
  target: T,
  path: string,
  value: V
): T => {
  return set(target, path, value);
};

export const _get = <V = unknown, T = unknown>(
  smth: T,
  path: string,
  defVal?: V
): V => {
  return get(smth, path, defVal);
};

export const _merge = <T = unknown>(
  target: Partial<T>,
  ...sources: Partial<T>[]
): T => {
  return merge(target, ...sources) as T;
};
