import { Pipe, PipeTransform } from '@angular/core';
import { isString } from '../utils/functional-utils';

@Pipe({ name: 'linkify', pure: true })
export class LinkifyPipe implements PipeTransform {
  transform(link: string, add = ''): string {
    return this.linkify(link, add);
  }

  private linkify(value: string, add = ''): string {
    if (!isString(value) || !value?.trim()) {
      return '';
    }
    // tslint:disable-next-line: max-line-length
    const urlRegex = /((?:(?:(?:(?:ftp|https?):\/\/)(www\.)?)|(www\.))([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)))(?![^<>]*>|[^"]*?<\/a)/gim;

    const mailRegex = /((?:[a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+)(?![^<>]*>|[^"]*?<\/a)/gim;

    const linksWithoutProtocolRegex = /(href=")(?!(\/|ftp|https?|mailto|tel))/gim;

    // tslint:disable-next-line: max-line-length
    const linkWithTooLongTextRegex = /(>(?:\s+)?)(?:(?:(?:(?:ftp|https?):\/\/)(www\.)?)|(www\.))?([^\s@]{15})([^\s@]{10,256})([^\s@]{6}(?:\s+)?<\/a>)/gim;

    return value
      .replace(
        urlRegex,
        '<a href="$1" target="_blank"' + (add ? ' ' + add : '') + '>$2$3$4</a>'
      )
      .replace(
        mailRegex,
        '<a href="mailto:$1"' + (add ? ' ' + add : '') + '>$1</a>'
      )
      .replace(linksWithoutProtocolRegex, 'href="https://')
      .replace(linkWithTooLongTextRegex, '$1$2$3$4…$6');
  }
}
