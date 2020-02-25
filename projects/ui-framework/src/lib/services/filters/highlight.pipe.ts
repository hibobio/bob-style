import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, args: string): string | SafeHtml {
    if (!args || !value) {
      return value || '';
    }

    const re = new RegExp(args, 'gi');

    if (!value.match(re)) {
      return value;
    }

    const replacedValue = value.replace(re, str => `<strong>${str}</strong>`);
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
  }
}
