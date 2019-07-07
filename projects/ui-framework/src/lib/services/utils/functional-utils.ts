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

export const randomFromArray = (array: any[], num: number = 1) => {
  if (!num) {
    num = array.length;
  }
  const random = array.sort(() => 0.5 - Math.random()).slice(0, num);
  return num === 1 ? random[0] : random;
};

export const keysFromArrayOrObject = (smth: string[] | {}): string[] =>
  Array.isArray(smth) ? smth : Object.keys(smth);

export const getKeyByValue = (object: object, value: any) =>
  Object.keys(object).find(key => object[key] === value);

export const isString = (val: any): boolean => val && typeof val === 'string';

export const isArray = (val: any): boolean => val && Array.isArray(val);

export const isObject = (val: any): boolean =>
  val && !isArray(val) && val === Object(val);

export const isNullOrUndefined = (val: any): boolean =>
  val === undefined || val === null;

export const isRenderedComponent = (obj: any): boolean =>
  obj && !!obj.component;

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
  key.toUpperCase() === expected.toUpperCase();

export const asArray = (smth: any): any[] =>
  !isNullOrUndefined(smth) ? (isArray(smth) ? smth : [smth]) : [];

export const asNumber = (smth: any): number => parseInt(smth, 10);

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

export const domainFromUrl = (url: string) => {
  let a = document.createElement('a');
  a.href = url;
  const domain = a.hostname || '.com';
  a = null;
  return domain;
};

export const arrayDifference = (arrA: any[], arrB: any[]) => {
  return arrA
    .filter(x => !arrB.includes(x))
    .concat(arrB.filter(x => !arrA.includes(x)));
};

export const makeArray = (length: number, fill: any = undefined): any[] =>
  Array(length).fill(fill);

export const padWith0 = (number: string | number, digits = 2): string =>
  String(number).padStart(digits, '0');
