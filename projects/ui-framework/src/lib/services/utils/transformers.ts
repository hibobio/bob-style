import {
  isArray,
  isString,
  stringListToArray,
  isObject,
  isNullOrUndefined,
  compareAsStrings,
  asArray,
  stringify,
  getType
} from './functional-utils';

import { parse, format, isDate } from 'date-fns';
import { InputTypes } from '../../form-elements/input/input.enum';
import { Input } from '@angular/core';

// -------------------------------
// Transformers
// -------------------------------

export const truthyOrFalse = value => {
  const truthy = ['true', '1', 1, 'on', 'yes'];
  if (typeof value !== 'boolean') {
    value = truthy.includes(value) ? true : false;
  }
  return value;
};

export const arrayOfStringsOrArrayFromString = value =>
  isArray(value) ? value : isString(value) ? stringListToArray(value) : [];

export const valueToObjectWithKeyOfValueFromArray = (
  value: any,
  key: string,
  array: object[]
) => {
  if (isNullOrUndefined(value) || isNullOrUndefined(array)) {
    return undefined;
  }
  return array.find(i => compareAsStrings(i[key], value));
};

export const stringToDate = date => {
  if (isNullOrUndefined(date)) {
    return date;
  }
  const converted = parse(date);
  return isDate(date)
    ? date
    : String(converted) !== 'Invalid Date'
      ? converted
      : undefined;
};

export const dateToString = (date, frmt) =>
  isDate(date) ? format(date, frmt) : date;

export const valueToObjectKey = key => value => {
  return isObject(value) && value[key] ? value : { [key]: value };
};

// -------------------------------
// Typecheckers
// -------------------------------

export const booleanOrFail = value => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (typeof value !== 'boolean') {
    throw new Error(
      `Value (${ stringify(value) }) must be of type boolean, instead ${
        value === null ? 'null' : getType(value)
        } was provided.`
    );
  }
  return value;
};

export const arrayOrFail = value => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (!isArray(value)) {
    throw new Error(
      `Value (${ stringify(value) }) must be an array, instead ${ getType(
        value
      ) } was provided.`
    );
  }
  return value;
};

export const objectOrFail = value => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (!isObject(value)) {
    throw new Error(
      `Value (${ stringify(value) }) must be an object, instead ${ getType(
        value
      ) } was provided.`
    );
  }
  return value;
};

export const stringyOrFail = value => {
  if (isNullOrUndefined(value)) {
    return '';
  }
  if (isArray(value) || isObject(value)) {
    throw new Error(
      `Value (${ stringify(value) }) should not be ${ getType(
        value
      ).toUpperCase() }.`
    );
  }
  return String(value);
};

export const dateyOrFail = value => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  const converted = stringToDate(value);
  if (
    typeof value === 'boolean' ||
    Date.parse(value) <= 0 ||
    converted === undefined
  ) {
    throw new Error(`Value (${ stringify(value) }) could not be parsed to Date.`);
  }
  return converted;
};

// -------------------------------
// Validators
// -------------------------------

export const defaultValue = def => value =>
  isNullOrUndefined(value) ? def : value;

export const objectHasKeyOrFail = (key: string | string[]) => (
  value: object
) => {
  const c = 0;
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (isNullOrUndefined(key) || !isObject(value)) {
    throw new Error(
      `Value (${ stringify(
        value
      ) }) is  not an object or key (${ key }) is invalid.`
    );
  }
  for (const k of asArray(key)) {
    if (!value.hasOwnProperty(k)) {
      throw new Error(
        `Value object (${ stringify(value) }) has no key (${ key }).`
      );
    }
  }
  return value;
};

export const valueInArrayOrFail = (
  value: any,
  array: any[],
  key: string = null
) => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (isNullOrUndefined(array)) {
    return undefined;
  }
  if (
    (key && !array.find(i => i[key] === value[key])) ||
    (!key && !array.includes(value))
  ) {
    value = stringify(value);
    array = array.map(i => stringify(i));
    throw new Error(
      `Value (${ stringify(value) }) is not part of array (${ stringify(array) }).`
    );
  }

  return value;
};

export const asNumber = (inputType: InputTypes, value: any) =>
  inputType === InputTypes.number
    ? parseFloat(value)
    : value;
