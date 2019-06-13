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

// Typecheckers

export const booleanOrFail = value => {
  if (isNullOrUndefined(value)) {
    return undefined;
  }
  if (typeof value !== 'boolean') {
    throw new Error(
      `Value (${stringify(value)}) must be of type boolean, instead ${
        value === null ? 'null' : getType(value)
      } was provided.`
    );
  }
  return value;
};

export const arrayOrFail = value => {
  if (isNullOrUndefined(value)) {
    return undefined;
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

export const objectOrFail = value => {
  if (isNullOrUndefined(value)) {
    return undefined;
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

export const stringyOrFail = value => {
  if (isNullOrUndefined(value)) {
    return '';
  }
  if (isArray(value) || isObject(value)) {
    throw new Error(
      `Value (${stringify(value)}) should not be an ${getType(value)}.`
    );
  }
  return value;
};

// Validators

export const defaultValue = def => value =>
  isNullOrUndefined(value) ? def : value;

export const objectHasKeyOrFail = (key: string | string[]) => (
  value: object
) => {
  if (isNullOrUndefined(value)) {
    return undefined;
  }
  if (isNullOrUndefined(key) || !isObject(value)) {
    throw new Error(
      `Value (${stringify(value)}) is not an object or key (${key}) is invalid.`
    );
  }
  for (const k of asArray(key)) {
    if (!value.hasOwnProperty(k)) {
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
  if (isNullOrUndefined(value) || isNullOrUndefined(array)) {
    return undefined;
  }
  if (
    (key && !array.find(i => i[key] === value[key])) ||
    (!key && !array.includes(value))
  ) {
    value = stringify(value);
    array = array.map(i => stringify(i));
    throw new Error(
      `Value (${stringify(value)}) is not part of array (${stringify(array)}).`
    );
  }
  return value;
};

// Transformers

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
