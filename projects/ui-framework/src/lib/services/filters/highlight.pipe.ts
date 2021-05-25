import { Pipe, PipeTransform } from '@angular/core';

import { FUZZY_SRCH_MIN_LENGTH } from '../../consts';
import {
  getFuzzyMatcher,
  getMatcher,
  normalizeString,
  normalizeStringSpaces,
} from '../utils/functional-utils';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor() {}

  transform(value: string, searchStr: string, fuzzy = false): string {
    if (!searchStr || !value) {
      return value || '';
    }

    // if string contains html or line break (\n), search only first half
    const searcheableValue = value
      .trim()
      .split(/<[^>]+>|\n/)
      .filter(Boolean)[0];
    // remove weird spaces
    const searcheableValueNorm = normalizeStringSpaces(searcheableValue);
    // normalize Crème Brûlée
    const valueToMatch = normalizeString(searcheableValue);

    // try to match string as is, then try fuzzy match
    const match =
      getMatcher(searchStr, false).exec(valueToMatch) ||
      (fuzzy && valueToMatch.length >= FUZZY_SRCH_MIN_LENGTH
        ? getFuzzyMatcher(searchStr).exec(valueToMatch)
        : null);

    if (!match) {
      return value;
    }

    return value.replace(
      searcheableValue,

      searcheableValueNorm.slice(0, match.index) +
        '<strong>' +
        searcheableValueNorm.slice(
          match.index,
          match.index + match['0'].length
        ) +
        '</strong>' +
        searcheableValueNorm.slice(match.index + match['0'].length)
    );
  }
}
