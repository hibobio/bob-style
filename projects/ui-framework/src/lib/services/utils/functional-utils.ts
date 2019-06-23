import { SimpleChanges } from '@angular/core';

export function MixIn(baseCtors: Function[]) {
  return function(derivedCtor: Function) {
    baseCtors.forEach((baseCtor) => {
      const fieldCollector = {};
      baseCtor.apply(fieldCollector);
      Object.getOwnPropertyNames(fieldCollector).forEach((name) => {
        derivedCtor.prototype[name] = fieldCollector[name];
      });

      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        if (name !== 'constructor') {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        }
      });
    });
  };
}

export const randomFromArray = (array: any[], num: number = 1) => array.sort(() => 0.5 - Math.random()).slice(0, num);

export const keysFromArrayOrObject = (smth: string[] | {}): string[] =>
  Array.isArray(smth) ? smth : Object.keys(smth);

export const getKeyByValue = (object: object, value: any) => Object.keys(object).find((key) => object[key] === value);

export const isString = (val: any): boolean => val && typeof val === 'string';

export const isArray = (val: any): boolean => val && Array.isArray(val);

export const isObject = (val: any): boolean => val && !isArray(val) && val === Object(val);

export const isNullOrUndefined = (val: any): boolean => val === undefined || val === null;

export const isRenderedComponent = (obj: any): boolean => obj && !!obj.component;

export const simpleUID = (prefix: string = '', length: number = 5, suffix: string = ''): string => {
  return (
    prefix +
    Math.random()
      .toString(16)
      .substr(2, length) +
    suffix
  );
};

export const pass = (a: any): any => a;

export const isKey = (key: string, expected: string): boolean => key.toUpperCase() === expected.toUpperCase();

export const stringListToArray = (list: string): string[] => {
  if (isArray(list) || !list) {
    return list as any;
  }
  if (!isString(list)) {
    return [list];
  }
  return Array.from(new Set(list.split(/[^\w\u0020]+/).map((i) => i.trim()))).filter((i) => !!i);
};

export const asArray = (smth: any): any[] => (!isNullOrUndefined(smth) ? (isArray(smth) ? smth : [smth]) : []);

export const asNumber = (smth: any): number => parseInt(smth, 10);

export const compareAsNumbers = (a: string | number, b: string | number): boolean =>
  parseInt(a as string, 10) === parseInt(b as string, 10);

export const compareAsStrings = (a: any, b: any): boolean => String(a) === String(b);

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
  isPlainObject as _isPlainObject,
  isArray as _isArray,
  reduce as _reduce,
  merge as _merge,
  toPairs as _toPairs,
  set as _set,
  compose as _compose
} from 'lodash/fp';
import { type } from 'os';

export const flatten = (obj, path = []) => {
  return _isPlainObject(obj) || _isArray(obj)
    ? _reduce((acc, [k, v]) => _merge(acc, flatten(v, [...path, k])), {}, _toPairs(obj))
    : { [path.join('.')]: obj };
};

export const unflatten = _compose(_reduce((acc, [k, v]) => _set(k, v, acc), {}), _toPairs);

export const domainFromUrl = (url: string) => {
  let a = document.createElement('a');
  a.href = url;
  const domain = a.hostname || '.com';
  a = null;
  return domain;
};

export const stringify = (smth: any): string =>
  isString(smth) ? smth : isArray(smth) ? smth.join(', ') : isObject(smth) ? JSON.stringify(smth) : String(smth);

export const getType = (smth) =>
  smth === null ? 'null' : isArray(smth) ? 'array' : smth instanceof Date ? 'date' : String(typeof smth);
