import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor() {}

  transform(value: string, args: string): string {
    if (!args || !value) {
      return value || '';
    }

    const re = new RegExp(args, 'gi');

    if (!value.match(re)) {
      return value;
    }

    return value.replace(re, str => `<strong>${str}</strong>`);
  }
}
