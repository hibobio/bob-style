import {
  asArray,
  compareAsStrings,
  getType,
  hasProp,
  isArray,
  isDate,
  isDateFormat,
  isDateISO8601,
  isNullOrUndefined,
  isNumber,
  isObject,
  isString,
  parseToNumber,
  stringify,
  isEmptyArray,
} from './functional-utils';

import { format, parseISO } from 'date-fns';
import { InputTypes } from '../../form-elements/input/input.enum';
import { SERVER_DATE_FORMAT } from '../../consts';
import { GenericObject } from '../../types';
import { SelectType } from '../../lists/list.enum';
import { itemID } from '../../lists/tree-list/tree-list.interface';

// -------------------------------
// Transformers
// -------------------------------

export const truthyOrFalse = (value) => {
  const truthy = ['true', '1', 1, 'on', 'yes'];
  if (typeof value !== 'boolean') {
    value = truthy.includes(value) ? true : false;
  }
  return value;
};

export const stringListToArray = (
  list: string,
  test = /[^\w\u0020]+/
): string[] => {
  if (isArray(list) || !list) {
    return list as any;
  }
  if (!isString(list)) {
    return [list];
  }
  return Array.from(new Set(list.split(test).map((i) => i.trim()))).filter(
    Boolean
  );
};

export const arrayOfStringsOrArrayFromString = (value: any): string[] =>
  isArray(value) ? value : isString(value) ? stringListToArray(value) : [];

export const valueToObjectWithKeyOfValueFromArray = (
  value: any,
  key: string,
  array: GenericObject[]
): GenericObject => {
  if (isNullOrUndefined(value) || isNullOrUndefined(array)) {
    return undefined;
  }
  return array.find((i) => compareAsStrings(i[key], value));
};

export const stringToDate = (date: string | Date): Date => {
  if (isDate(date) || isNullOrUndefined(date)) {
    return date as Date;
  }
  let converted = parseISO(date as string);
  if (String(converted) === 'Invalid Date') {
    converted = new Date(date);
  }
  return String(converted) !== 'Invalid Date' ? converted : undefined;
};

export const dateToString = (
  date: Date | string,
  frmt: string = SERVER_DATE_FORMAT
): string => (isDate(date) ? format(date as Date, frmt) : date) as string;

export const valueToObjectKey = (key: string) => (value: any) => {
  return hasProp(value, key) ? value : { [key]: value };
};

export const arrayOfValuesToArrayOfObjects = (key: string) => (
  value: any[]
) => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  value = asArray(value);
  return value.map(valueToObjectKey(key));
};

export const valueAsNumber = (
  inputType: InputTypes | boolean,
  value: any,
  def: any = undefined
): number => {
  if (
    !value ||
    (inputType !== InputTypes.number && inputType !== true) ||
    value === '-'
  ) {
    return value;
  }
  const parsed = parseToNumber(value, 3);
  if (parsed !== parsed && value !== '--') {
    console.warn(`Value (${stringify(value)}) is not parseable to number.`);
  }
  return parsed === parsed ? parsed : def;
};

export const arrayToFirstItemOrNull = <T>(value: T[] | T): T => {
  return isEmptyArray(value) ? null : !Array.isArray(value) ? value : value[0];
};

export const selectValueMultiOrSingle = (
  type: SelectType,
  value: itemID | itemID[]
): itemID | itemID[] => {
  return type === SelectType.single
    ? arrayToFirstItemOrNull<itemID>(value)
    : value;
};

// -------------------------------
// Typecheckers
// -------------------------------

export const booleanOrFail = (value: any): boolean => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (typeof value !== 'boolean') {
    throw new Error(
      `Value (${stringify(value)}) must be of type boolean, instead ${getType(
        value
      )} was provided.`
    );
  }
  return value;
};

export const arrayOrFail = <T = any>(value: any): T[] => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (!isArray(value)) {
    throw new Error(
      `Value (${stringify(value)}) must be an array, instead ${getType(
        value
      )} was provided.`
    );
  }
  return value;
};

export const objectOrFail = (value) => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (!isObject(value)) {
    throw new Error(
      `Value (${stringify(value)}) must be an object, instead ${getType(
        value
      )} was provided.`
    );
  }
  return value;
};

export const stringyOrFail = (value) => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (value !== value) {
    return undefined;
  }
  if (!(isString(value) || isNumber(value))) {
    throw new Error(
      `Value (${stringify(value)}) should not be ${getType(
        value
      ).toUpperCase()}.`
    );
  }
  return value + '';
};

export const dateOrFail = (value) => {
  if (isDate(value) || isNullOrUndefined(value)) {
    return value;
  }
  if (!value) {
    return undefined;
  }
  if (!isDateISO8601(value)) {
    throw new Error(
      `Date string (${stringify(value)}) must be in ISO8601 format to parse.`
    );
  }
  return stringToDate(value);
};

export const dateFormatOrFail = (value) => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (!value) {
    return undefined;
  }
  if (!isDateFormat(value)) {
    throw new Error(
      `Provided string (${stringify(value)}) does not describe Date format.`
    );
  }
  return value;
};

export const timeyOrFail = (value) => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (!value) {
    return undefined;
  }
  if (!isString(value) || value.indexOf(':') === -1) {
    throw new Error(`Value (${stringify(value)}) could not be parsed to Time.`);
  }
  return value;
};

export const selectValueOrFail = (value) => {
  if (isNullOrUndefined(value)) {
    return value;
  }

  if (!(isString(value) || isNumber(value) || isArray(value))) {
    throw new Error(
      `Value (${stringify(
        value
      )}) should be string, number or (string | number)[], instead ${getType(
        value
      ).toUpperCase()} was provided.`
    );
  }
  return asArray(value);
};

// -------------------------------
// Validators
// -------------------------------

export const defaultValue = (def) => (value) =>
  isNullOrUndefined(value) ? def : value;

export const objectHasKeyOrFail = (
  key: string | string[],
  fuzzyFalsey = false
) => (value: object) => {
  if (isNullOrUndefined(value)) {
    return value;
  }
  if (fuzzyFalsey && !value) {
    return undefined;
  }
  if (isNullOrUndefined(key) || !isObject(value)) {
    throw new Error(
      `Value (${stringify(
        value
      )}) is  not an object or key (${key}) is invalid.`
    );
  }
  for (const k of asArray(key)) {
    if (!hasProp(value, k as string)) {
      throw new Error(
        `Value object (${stringify(value)}) has no key (${key}).`
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
    (key && !array.find((i) => i[key] === value[key])) ||
    (!key && !array.includes(value))
  ) {
    value = stringify(value);
    array = array.map((i) => stringify(i));
    throw new Error(
      `Value (${stringify(value)}) is not part of array (${stringify(array)}).`
    );
  }

  return value;
};

// -------------------------------
// Helpers
// -------------------------------

export const logValue = <T = any>(value: T): T => {
  console.log(value);
  return value;
};

export const logValueComment = <T = any>(comment: string) => (value: T): T => {
  console.log(comment + ': ', value);
  return value;
};
