import { SimpleChanges } from '@angular/core';
import { metaKeys } from '../../enums';
import { GenericObject } from '../../types';
import { isEqual } from 'lodash';

// ----------------------
// TYPES
// ----------------------

export const isNullOrUndefined = (val: any): boolean =>
  val === undefined || val === null;

export const isString = (val: any): boolean => typeof val === 'string';

export const isNumber = (val: any): boolean =>
  typeof val === 'number' && val === val;

export const isBoolean = (val: any): boolean => typeof val === 'boolean';

export const isNotEmptyString = (val: any): boolean =>
  isString(val) && val.trim() !== '';

export const isEmptyString = (val: any): boolean => !isNotEmptyString(val);

export const isArray = (val: any): boolean => val && Array.isArray(val);

export const isDate = (value: any): boolean =>
  String(value) !== 'Invalid Date' &&
  value instanceof Date &&
  typeof value.getMonth === 'function';

export const isNotEmptyArray = (val: any, min = 0): boolean =>
  isArray(val) && val.length > min;

export const isEmptyArray = (val: any): boolean =>
  isNullOrUndefined(val) || (Array.isArray(val) && val.length === 0);

export const isObject = (val: any): boolean =>
  val && !isArray(val) && typeof val !== 'function' && val === Object(val);

export const isNotEmptyObject = (val: any): boolean =>
  isObject(val) && Object.keys(val).length > 0;

export const isEmptyObject = (val: any): boolean =>
  isNullOrUndefined(val) || (isObject(val) && Object.keys(val).length === 0);

export const isFalsyOrEmpty = (smth: any, fuzzy = false): boolean =>
  isNullOrUndefined(smth) ||
  smth === false ||
  (fuzzy && !Boolean(smth)) ||
  isEmptyArray(smth) ||
  (isEmptyObject(smth) && !isDate(smth));

export const getType = (smth: any): string =>
  smth === null
    ? 'null'
    : isArray(smth)
    ? 'array'
    : smth instanceof Date
    ? 'date'
    : smth !== smth
    ? 'NaN'
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

export const roundToDecimals = (num: number, decmls: number = 2): number => {
  return (
    Math.round((num + Number.EPSILON) * Math.pow(10, decmls)) /
    Math.pow(10, decmls)
  );
};

// ----------------------
// CONVERTERS
// ----------------------

export const asArray = <T = any>(smth: T | T[]): T[] =>
  !isNullOrUndefined(smth)
    ? isArray(smth)
      ? (smth as T[])
      : ([smth] as T[])
    : [];

export const asNumber = (smth: any, roundToDcmls = null): number => {
  if (!smth) {
    return 0;
  }
  if (!isNumber(smth)) {
    smth = parseFloat(smth);
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
  isNotEmptyObject(obj) && Boolean(Object.values(obj).find(v => Boolean(v)));

export const keysFromArrayOrObject = (smth: string[] | {}): string[] =>
  Array.isArray(smth) ? smth : Object.keys(smth);

export const getKeyByValue = (object: GenericObject, value: any) =>
  Object.keys(object).find(key => object[key] === value);

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

// ----------------------
// ARRAYS
// ----------------------

export const isIterable = (smth: any): boolean => {
  if (!smth || isNumber(smth) || isString(smth)) {
    return false;
  }
  return typeof smth[Symbol.iterator] === 'function';
};

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

export const lastItem = <T = any>(arr: T[]): T =>
  !isIterable(arr) ? ((arr as any) as T) : arr[arr.length - 1];

export const arrayFlatten = <T = any>(arr: any[]): T[] =>
  asArray(arr).reduce((acc, val) => acc.concat(val), []);

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

export const arrayMode = <T = any>(arr: T[]): T =>
  isArray(arr) &&
  arr
    .sort(
      (a, b) =>
        arr.filter(v => v === a).length - arr.filter(v => v === b).length
    )
    .pop();

// ----------------------
// STRINGS
// ----------------------

export const stringify = (smth: any): string =>
  isString(smth)
    ? smth
    : isArray(smth)
    ? smth.map(i => stringify(i)).join(', ')
    : isObject(smth)
    ? JSON.stringify(smth)
    : String(smth);

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

export const pass = (a: any): any => a;

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

// ----------------------
// RONDOMIZERS
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
// COMPARATORS
// ----------------------

export const compareAsNumbers = (
  a: string | number,
  b: string | number
): boolean => asNumber(a) === asNumber(b);

export const compareAsStrings = (a: any, b: any): boolean =>
  String(a) === String(b);

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

export const cloneDeepSimpleObject = <T = any>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

// ----------------------
// EVENTS
// ----------------------

export const isKey = (key: string, expected: string): boolean =>
  key && expected && key.toUpperCase() === expected.toUpperCase();

export const isMetaKey = (key: string): boolean =>
  metaKeys.includes(key as any);

export const eventHasCntrlKey = (event: KeyboardEvent | MouseEvent): boolean =>
  event.metaKey || event.ctrlKey;

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

export const hasChanges = (
  changes: SimpleChanges,
  keys: string[] = null,
  discardAllFalsey = false
): boolean => {
  if (!keys) {
    keys = Object.keys(changes);
  }
  return !!keys.find(
    i =>
      changes[i] !== undefined &&
      (changes[i].currentValue !== undefined ||
        changes[i].previousValue !== undefined) &&
      (!discardAllFalsey ||
        (discardAllFalsey && Boolean(changes[i].currentValue)))
  );
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
  skip: string[] = [],
  discardAllFalsey = false
): void => {
  Object.keys(changes).forEach((change: string) => {
    if (!skip.includes(change)) {
      target[change] =
        defaults[change] &&
        ((!discardAllFalsey &&
          isNullOrUndefined(changes[change].currentValue)) ||
          (discardAllFalsey && !Boolean(changes[change].currentValue)))
          ? defaults[change]
          : changes[change].currentValue;
    }
  });
};

// ----------------------
// MISC HELPERS
// ----------------------

export function MixIn(baseCtors: Function[]) {
  return function(derivedCtor: Function) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
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
    Math.random()
      .toString(16)
      .substr(2, length) +
    suffix.replace(/\s+/g, '_')
  );
};

export const isRenderedComponent = (obj: any): boolean =>
  hasProp(obj, 'component');
