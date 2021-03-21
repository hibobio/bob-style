import Tribute from 'tributejs';

import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { GenericObject } from '../../types';
import { HtmlParserHelpers } from '../html/html-parser.service';
import { isNotEmptyObject } from '../utils/functional-utils';
import { escapeSafe } from '../utils/security-utils';
import { TributeInstance, TributeItem, TributeOptions } from './tribute.interface';

export interface MentionsOption {
  id?: string | number;
  avatar?: string;
  displayName: string;
  link: string;
  attributes?: GenericObject;
}

export const MENTIONS_OPTIONS_DEF: TributeOptions = {
  lookup: 'displayName',
  fillAttr: 'displayName',
  requireLeadingSpace: false,
  allowSpaces: true,

  menuItemTemplate: function (item: TributeItem) {
    return item.original.avatar
      ? `<span class="brte-mention-avatar" aria-hidden="true" style="background-image:url(${item.original.avatar})"></span><span>${item.string}</span>`
      : item.string;
  },

  searchOpts: {
    pre: '<em class="match">',
    post: '</em>',
  },
};

@Injectable({
  providedIn: 'root',
})
export class MentionsService {
  constructor(private domSanitizer: DomSanitizer, private parserService: HtmlParserHelpers) {}

  public getSanitizeMentions(mentionsList: MentionsOption[]): MentionsOption[] {
    return mentionsList.map((mentionListItem) => {
      return {
        displayName: escapeSafe(mentionListItem.displayName),
        link: mentionListItem.link && this.domSanitizer.sanitize(SecurityContext.URL, mentionListItem.link),
        avatar: mentionListItem.avatar && this.domSanitizer.sanitize(SecurityContext.URL, mentionListItem.avatar),
        attributes:
          mentionListItem.attributes &&
          Object.keys(mentionListItem.attributes).reduce((acc, key) => {
            acc[key] = escapeSafe(mentionListItem.attributes[key]);
            return acc;
          }, {}),
      };
    });
  }

  public getTributeInstance(mentionsList: MentionsOption[], mode: 'rte' | 'div' = 'rte'): TributeInstance {
    return new Tribute({
      ...MENTIONS_OPTIONS_DEF,

      values: this.getSanitizeMentions(mentionsList),

      selectTemplate: (item: TributeItem) => {
        // prettier-ignore
        // tslint:disable-next-line: max-line-length
        let html = `<a href="${item.original.link}"${
          mode === 'rte' ? ' class="fr-deletable" contenteditable="false"' : ''
        } spellcheck="false" tabindex="-1">@${item.original.displayName}</a>`;

        if (mode === 'div') {
          html = `<span contenteditable="false">${html}</span>`;
        }

        if (isNotEmptyObject(item.original.attributes)) {
          html = this.parserService.enforceAttributes(
            html,
            {
              a: item.original.attributes,
            },
            false
          ) as string;
        }

        return html;
      },
    }) as TributeInstance;
  }
}
