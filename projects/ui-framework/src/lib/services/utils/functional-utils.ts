import { SimpleChanges, SimpleChange } from '@angular/core';
import { metaKeys } from '../../enums';
import { GenericObject } from '../../types';
import { isEqual, cloneDeep } from 'lodash';
import { RenderedComponent } from '../component-renderer/component-renderer.interface';
import { SelectGroupOption } from '../../lists/list.interface';

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

export const isFunction = (val: any): val is Function =>
  !!val && typeof val === 'function';

export const isNotEmptyString = (val: any): boolean =>
  isString(val) && val.trim() !== '';

export const isEmptyString = (val: any): boolean => !isNotEmptyString(val);

export const isArray = <T = any>(val: any): val is T[] =>
  !!val && Array.isArray(val);

export const isDate = (value: any): boolean =>
  String(value) !== 'Invalid Date' &&
  value instanceof Date &&
  typeof value.getMonth === 'function';

export const isNotEmptyArray = (val: any, min = 0): boolean =>
  isArray(val) && val.length > min;

export const isEmptyArray = (val: any): boolean =>
  isNullOrUndefined(val) || (Array.isArray(val) && val.length === 0);

export const isObject = (val: any): val is object =>
  !!val && val === Object(val) && typeof val !== 'function' && !isArray(val);

export const isPlainObject = (val: any): val is object =>
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

export const isFalsyOrEmpty = (smth: any, fuzzy = false): boolean =>
  isNullOrUndefined(smth) ||
  smth === false ||
  (fuzzy && !Boolean(smth)) ||
  isEmptyArray(smth) ||
  (isEmptyObject(smth) && !isDate(smth));

// truthy, string, number or null
export const isValuevy = (smth: any): boolean =>
  smth !== undefined &&
  (Boolean(smth) ||
    smth === null ||
    isBoolean(smth) ||
    isString(smth) ||
    isNumber(smth));

export const getType = (smth: any): string =>
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

export const roundToDecimals = (num: number, decmls: number = 2): number => {
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

export const closestDivisable = (val: number, step: number): number => {
  const c1 = val - (val % step);
  const c2 = val + step - (val % step);
  return val - c1 > c2 - val ? c2 : c1;
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

export const hasProp = (
  obj: GenericObject,
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

export const objectRemoveKey = (
  object: GenericObject,
  key: string
): GenericObject => {
  const { [key]: deletedKey, ...otherKeys } = object;
  return otherKeys;
};

export const objectRemoveKeys = (
  object: GenericObject,
  keys: string[]
): GenericObject => {
  return Object.keys(object)
    .filter((key) => !asArray(keys).includes(key))
    .reduce((acc, key) => {
      acc[key] = object[key];
      return acc;
    }, {});
};

export const objectRemoveEntriesByValue = (
  object: GenericObject,
  values: any[]
): GenericObject => {
  return Object.keys(object)
    .filter((key) => !asArray(values).includes(object[key]))
    .reduce((acc, key) => {
      acc[key] = object[key];
      return acc;
    }, {});
};

export const objectRemoveEntriesWithFalseyValue = (
  object: GenericObject,
  config: { remove?: any[]; allow?: any[] } = {}
): GenericObject => {
  const { allow, remove } = config;

  return Object.keys(object)
    .filter((key) => {
      return remove
        ? !asArray(remove).includes(object[key])
        : allow
        ? Boolean(object[key]) || asArray(allow).includes(object[key])
        : Boolean(object[key]);
    })
    .reduce((acc, key) => {
      acc[key] = object[key];
      return acc;
    }, {});
};

export const objectStringID = (
  obj: any,
  config: {
    key?: string;
    limit?: number;
    addId?: boolean;
    primitives?: boolean;
  } = { limit: 400, primitives: true }
): string => {
  const { key, limit, addId, primitives } = config;

  const str = String(
    primitives ? JSON.stringify(obj) : stringify(obj, null)
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
  );
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

export const simpleArraysEqual = <T>(arr1: T[], arr2: T[]) => {
  if (!isArray(arr1) || !isArray(arr2) || arr1.length !== arr2.length) {
    return false;
  }
  if (arr1 === arr2) {
    return true;
  }

  return arrayDifference(arr1, arr2).length === 0;
};

export const dedupeArray = <T = any>(arr: T[]): T[] => Array.from(new Set(arr));

export const joinArrays = <T = any>(arr1: T[], ...rest: (T | T[])[]): T[] =>
  dedupeArray(arr1.concat(...rest));

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

export const arrayFlatten = <T = any>(arr: any[]): T[] =>
  asArray(arr).reduce((acc, val) => acc.concat(val), []);

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

export const withMapItemsInIndexRange = <K = any, V = any>(
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

export const mapSplice = <K = any, V = any>(
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

// ----------------------
// STRINGS
// ----------------------

export const stringify = (smth: any, limit = 200): string => {
  const stringified = isString(smth)
    ? smth
    : isArray(smth)
    ? '[' +
      smth
        .reduce((str, i) => {
          if (!limit || str.length < limit * 0.7) {
            str += `${stringify(i, limit)}, `;
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
            str += `${k}: ${stringify(smth[k], limit)}, `;
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

export const capitalize = (smth: string): string =>
  smth.charAt(0).toUpperCase() + smth.slice(1);

export const padWith0 = (number: string | number, digits = 2): string => {
  if (isNullOrUndefined(number) || isNaN(parseInt(number as string, 10))) {
    return number as any;
  }

  return String(number).padStart(digits, '0');
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

export const arrOfObjSortByProp = (
  arr: GenericObject[],
  prop: string,
  asc = true
): GenericObject[] => {
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

export const objectSortKeys = <T = any>(obj: T): T => {
  if (!isPlainObject(obj)) {
    return obj;
  }
  return Object.keys(obj)
    .sort()
    .reduce((newObj: T, key: string) => {
      newObj[key] = obj[key];
      return newObj;
    }, {} as T);
};

export const dataDeepSort = <T = any>(data: T | T[]): T | T[] => {
  const sortedData: T[] = asArray(data, false)
    .map((di: T) => {
      if (isArray(di)) {
        return dataDeepSort(di) as T;
      }

      if (isPlainObject(di)) {
        const srtd: T = objectSortKeys(di);
        Object.keys(srtd).forEach((key) => {
          srtd[key] = dataDeepSort(srtd[key]);
        });
        return srtd;
      }

      return di;
    })
    .sort((a: T, b: T) => {
      if (isNumber(a) && isNumber(b)) {
        return a - b;
      }
      if (isString(a) && isString(b)) {
        return a.localeCompare(b);
      }
      return objectStringID(a, {
        limit: 30,
        primitives: true,
      }).localeCompare(
        objectStringID(b, {
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

// ignores order in arrays, only cares about values
export const isEqualByValues = (
  dataA: any,
  dataB: any,
  config: {
    key?: string;
    limit?: number;
    addId?: boolean;
    primitives?: boolean;
  } = { limit: 400, primitives: true }
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
    objectStringID(dataDeepSort(dataA), config) ===
    objectStringID(dataDeepSort(dataB), config)
  );
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

export const cloneDeepSimpleObject = <T = any>(obj: T): T => {
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
  falseyCheck?: Function;
}

export const CHANGES_HELPER_CONFIG_DEF: ChangesHelperConfig = {
  falseyCheck: Boolean,
};

const simpleChangeFilter = (
  change: SimpleChange,
  discardAllFalsey = false,
  falseyCheck: Function = Boolean
): boolean => {
  return (
    change !== undefined &&
    // (change.currentValue !== undefined || change.previousValue !== undefined)
    change.currentValue !== change.previousValue &&
    (!discardAllFalsey ||
      (discardAllFalsey && falseyCheck(change.currentValue)))
  );
};

export const hasChanges = (
  changes: SimpleChanges,
  keys: string[] = null,
  discardAllFalsey = false,
  config: ChangesHelperConfig = CHANGES_HELPER_CONFIG_DEF
): boolean => {
  const falseyCheck = config.falseyCheck || Boolean;
  if (!keys) {
    keys = Object.keys(changes);
  }
  return !!keys.find((i) =>
    simpleChangeFilter(changes[i], discardAllFalsey, falseyCheck)
  );
};

export const firstChanges = (
  changes: SimpleChanges,
  keys: string[] = null,
  discardAllFalsey = false,
  config: ChangesHelperConfig = CHANGES_HELPER_CONFIG_DEF
): boolean => {
  const falseyCheck = config.falseyCheck || Boolean;
  if (!keys) {
    keys = Object.keys(changes);
  }
  return !!keys.find(
    (i) =>
      changes[i]?.firstChange &&
      simpleChangeFilter(changes[i], discardAllFalsey, falseyCheck)
  );
};

export const notFirstChanges = (
  changes: SimpleChanges,
  keys: string[] = null,
  discardAllFalsey = false,
  config: ChangesHelperConfig = CHANGES_HELPER_CONFIG_DEF
): boolean => {
  const falseyCheck = config.falseyCheck || Boolean;
  if (!keys) {
    keys = Object.keys(changes);
  }
  return !!keys.find(
    (i) =>
      !changes[i]?.firstChange &&
      simpleChangeFilter(changes[i], discardAllFalsey, falseyCheck)
  );
};

export interface ApplyChangesConfig {
  defaults: GenericObject;
  skip: string[];
  discardAllFalsey: boolean;
  config: ChangesHelperConfig;
}

export const applyChanges = (
  target: any,
  changes: SimpleChanges,
  defaults: GenericObject = {},
  skip: string[] = [],
  discardAllFalsey = false,
  config: ChangesHelperConfig = CHANGES_HELPER_CONFIG_DEF
): SimpleChanges => {
  const falseyCheck = config.falseyCheck || Boolean;
  const keyMap = config.keyMap;

  if (keyMap) {
    Object.keys(keyMap).forEach((targetKey: string) => {
      changes[targetKey] = changes[keyMap[targetKey]];
      skip.push(keyMap[targetKey]);
    });
  }

  Object.keys(changes).forEach((changeKey: string) => {
    if (!skip.includes(changeKey)) {
      target[changeKey] =
        defaults.hasOwnProperty(changeKey) &&
        ((!discardAllFalsey &&
          isNullOrUndefined(changes[changeKey]?.currentValue)) ||
          (discardAllFalsey && !falseyCheck(changes[changeKey].currentValue)))
          ? defaults[changeKey]
          : changes[changeKey]?.currentValue;
    }
  });

  return changes;
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

export const batchProcessWithAnimationFrame = <T = any>(
  items: T[],
  config: {
    batchSize?: number;
    processItem?: (itm: T) => void;
    processBatch?: (chnk: T[]) => void;
    beforeAll?: (itms?: T[]) => void;
    afterAll?: (itms?: T[]) => void;
  }
): void => {
  const processItem = isFunction(config.processItem)
      ? config.processItem
      : null,
    processBatch = isFunction(config.processBatch) ? config.processBatch : null,
    beforeAll = isFunction(config.beforeAll) ? config.beforeAll : null,
    afterAll = isFunction(config.afterAll) ? config.afterAll : null,
    batchSize = isNumber(config.batchSize) ? config.batchSize : 15;

  const chunks: T[][] = splitArrayToChunks(items, batchSize);

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

    window.requestAnimationFrame(() => {
      process();
    });
  };

  window.requestAnimationFrame(() => {
    process();
  });
};
