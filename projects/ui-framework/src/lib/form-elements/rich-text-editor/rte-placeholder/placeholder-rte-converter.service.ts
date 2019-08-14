import { Injectable } from '@angular/core';
import { find } from 'lodash';
import { RtePlaceholder } from './placeholder-rte-converter.interface';

@Injectable()
export class PlaceholderRteConverterService {
  constructor() {}

  padChar = '\xa0';

  public fromRte(rteInnerHtml: string): string {
    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = rteInnerHtml + '';
    Array.from(elm.querySelectorAll('[data-placeholder-id]')).forEach(
      existingElement => {
        const placeholderId = existingElement.getAttribute(
          'data-placeholder-id'
        );
        const placeholderTextElement: Text = document.createTextNode(
          '{{' + placeholderId + '}}'
        );
        existingElement.parentNode.replaceChild(
          placeholderTextElement,
          existingElement
        );
      }
    );
    return elm.innerHTML;
  }

  public toRte(
    contentToConvert: string,
    placeholders: RtePlaceholder[]
  ): string {
    const regex: RegExp = /{{(.*?)}}/gm;
    return contentToConvert && placeholders
      ? contentToConvert.replace(
          regex,
          (field: string, innerContent: string) => {
            const category = this.getGroupDisplayName(
              placeholders,
              innerContent
            );
            const name = this.getDisplayNameById(placeholders, innerContent);
            const text = this.getPlaceholderText(name, category);
            // tslint:disable-next-line: max-line-length
            return `<span data-placeholder-id="${innerContent}" data-placeholder-category="${category}" data-text="${text}">${text}</span>`;
          }
        )
      : contentToConvert
      ? contentToConvert
      : '';
  }

  public toRtePartial = (placeholders: RtePlaceholder[]) => (
    contentToConvert: string
  ) => this.toRte(contentToConvert, placeholders)

  public getDisplayNameById(
    placeholders: RtePlaceholder[],
    id: string
  ): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder ? placeholder.displayName : id;
  }

  public getGroupDisplayName(
    placeholders: RtePlaceholder[],
    id: string
  ): string {
    const placeholder = find(placeholders, p => p.id === id);
    return placeholder.category && placeholder.category !== 'undefined'
      ? placeholder.category
      : '';
  }

  public getPlaceholderText = (name: string, category: string): string =>
    this.padChar.repeat(2) +
    (category ? category + this.padChar.repeat(2) : '') +
    name +
    this.padChar.repeat(2)
}
