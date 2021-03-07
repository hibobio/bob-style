import { Injectable } from '@angular/core';
import { SelectGroupOption, isNotEmptyArray, SelectOption } from 'bob-style';

@Injectable({
  providedIn: 'root',
})
export class PlaceholdersConverterService {
  constructor() {}

  padChar = '\xa0';
  separator = '##%%';

  public fromRte(rteInnerHtml: string): string {
    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = rteInnerHtml + '';
    Array.from(elm.querySelectorAll('[data-placeholder-id]')).forEach(
      (existingElement) => {
        const placeholderId = existingElement.getAttribute(
          'data-placeholder-id'
        );
        const placeholderTextElement: Text = document.createTextNode(
          `{{${placeholderId}}}`
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
    value: string,
    placeholders: SelectGroupOption[],
    mode: 'editor' | 'viewer' | 'textual' = 'editor'
  ): string {
    const regex: RegExp = new RegExp(
      `{{((?:[^}]*)${this.separator}(?:[^}]*))}}`,
      'gim'
    );
    return value && isNotEmptyArray(placeholders)
      ? value.replace(regex, (field: string, id: string, ...args) =>
          this.getPlaceholderHtml(placeholders, id, mode)
        )
      : value || '';
  }

  public getPlaceholderHtml(
    placeholders: SelectGroupOption[],
    id: string,
    mode: 'editor' | 'viewer' | 'textual' = 'editor'
  ): string {
    id = id && id.trim();
    if (!id || !placeholders) {
      return id;
    }
    const group = this.getGroupName(placeholders, id);
    const name = this.getOptionName(placeholders, id);

    return name ? this.getDisplayByMode(id, group, name, mode) : id;
  }

  private getDisplayByMode(
    id: string,
    group: string,
    name: string,
    mode: 'editor' | 'viewer' | 'textual'
  ) {
    switch (mode) {
      case 'editor':
        // prettier-ignore
        // tslint:disable-next-line: max-line-length
        return ` <span contenteditable="false" class="fr-deletable" data-placeholder-id="${ id }" data-before="${ group || '' }" data-after="${ (group ? ' - ' : '') + name }"><em>—</em></span> `;
      case 'viewer':
        // prettier-ignore
        // tslint:disable-next-line: max-line-length
        return ` <span data-placeholder-id="${ id }">${ this.padChar.repeat(3) }${ (group ? '<strong>' + group + '</strong> - ' : '') + name }${ this.padChar.repeat(3) }</span> `;
      case 'textual':
        return `{${group} - ${name}}`;
    }
  }

  public getGroupName(placeholders: SelectGroupOption[], id: string): string {
    const groupId = id.split(this.separator).filter(Boolean)[0];
    const group = placeholders.find((g) => g.key === groupId);
    return group ? group.groupName : null;
  }

  public getOptionName(placeholders: SelectGroupOption[], id: string): string {
    let allOptions: SelectOption[] = placeholders.map((g) => g.options) as any;
    allOptions = allOptions.concat(...allOptions);
    const option = allOptions.find((o) => o.id === id);
    return option ? option.value : id;
  }
}
