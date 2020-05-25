import { isString } from './functional-utils';

function escape(unsafe) {
  return unsafe
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function escapeSafe(unsafe) {
  return isString(unsafe) ? escape(unsafe) : unsafe;
}
