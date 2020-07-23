import { Pipe, PipeTransform } from '@angular/core';
import { escapeRegExp } from '../utils/functional-utils';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor() {}

  transform(value: string, searchStr: string, fuzzy = false): string {
    if (!searchStr || !value) {
      return value || '';
    }

    const matcher = !fuzzy
      ? new RegExp(escapeRegExp(searchStr), 'i')
      : new RegExp(
          searchStr
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\*\[\]\+><@\s]+/g, '')
            .split('')
            .join('[.,\\/#!$%\\^&\\*;:{}=\\-_`~()\\*\\[\\]\\+><@\\s]*'),
          'i'
        );

    const match = matcher.exec(value);

    if (!match) {
      return value;
    }

    if (!fuzzy) {
      return value.replace(match['0'], (str) => `<strong>${str}</strong>`);
    }

    return (
      value.slice(0, match.index) +
      '<strong>' +
      value.slice(match.index, match.index + match['0'].length) +
      '</strong>' +
      value.slice(match.index + match['0'].length)
    );
  }
}
