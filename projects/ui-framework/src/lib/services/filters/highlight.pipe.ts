import { Pipe, PipeTransform } from '@angular/core';

import {
  getFuzzyMatcher,
  getMatcher,
  normalizeString,
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

    const matcher = !fuzzy ? getMatcher(searchStr) : getFuzzyMatcher(searchStr);

    const searcheableValue = value.split(/^<[^>]+>|</).filter(Boolean)[0];

    const match = matcher.exec(normalizeString(searcheableValue));

    if (!match) {
      return value;
    }

    return value.replace(
      searcheableValue,

      searcheableValue.slice(0, match.index) +
        '<strong>' +
        searcheableValue.slice(match.index, match.index + match['0'].length) +
        '</strong>' +
        searcheableValue.slice(match.index + match['0'].length)
    );
  }
}
