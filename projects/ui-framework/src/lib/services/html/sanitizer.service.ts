import { Injectable } from '@angular/core';
import { isString, chainCall } from '../utils/functional-utils';
import { HtmlParserHelpers } from './html-parser.service';

import * as xss from 'xss';
import { IFilterXSSOptions, ICSSFilter } from 'xss';

export interface FilterXSSOptions extends IFilterXSSOptions {
  css?: { whiteList: { [key: string]: boolean } } | boolean;
}

export const SANITIZER_ALLOWED_TAGS = [
  'div',
  'article',
  'p',
  'section',

  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',

  'a',
  'br',
  'b',
  'strong',
  'em',
  'i',
  'img',
  'li',
  'ol',
  'ul',
  'span',
  'u',
  'strike',
  'sub',
  'sup',

  'pre',
  'font',
];
export const SANITIZER_ALLOWED_ATTRS = [
  'alt',
  'data-.*',
  'dir',
  'href',
  'id',
  'lang',
  'rel',
  'src',
  'target',
  // 'title',
  'valign',
  'style',
  'class',
  'contenteditable',
  'spellcheck',
  'tabindex',
  '.*mention.*',
];

export const SANITIZER_ALLOWED_STYLE_PROPS = [
  'font-size',
  'font-weight',
  'text-align',
  'direction',
  'text-decoration',
];

const SANITIZER_HTML_ALLOWED_ATTRS_TESTS: RegExp[] = SANITIZER_ALLOWED_ATTRS.reduce(
  (testList: RegExp[], attr) => {
    if (attr.includes('*') || attr.includes('^') || attr.includes('.')) {
      testList.push(new RegExp(attr, 'i'));
    }
    return testList;
  },
  []
);

export const SANITIZER_FILTER_XSS_OPTIONS: FilterXSSOptions = {
  whiteList: SANITIZER_ALLOWED_TAGS.reduce((listObj, tag) => {
    listObj[tag] = SANITIZER_ALLOWED_ATTRS.slice();
    return listObj;
  }, {}),

  css: {
    whiteList: SANITIZER_ALLOWED_STYLE_PROPS.reduce((listObj, prop) => {
      listObj[prop] = true;
      return listObj;
    }, {}),
  },

  stripIgnoreTag: true,
  stripIgnoreTagBody: true,
  allowCommentTag: false,

  onIgnoreTagAttr: (tag, name, value, isWhiteAttr) => {
    if (SANITIZER_HTML_ALLOWED_ATTRS_TESTS.find((test) => test.test(name))) {
      return name + '="' + xss.escapeAttrValue(value) + '"';
    }
  },
};

@Injectable({
  providedIn: 'root',
})
export class SanitizerService {
  constructor(private htmlParser: HtmlParserHelpers) {}

  private htmlSanitizer: ICSSFilter;

  private htmlSanitizeChain = [
    //
    (value: string) =>
      this.htmlParser.removeElements(
        value,
        'img:not([src]), img[src=""], a:not([href]), a[href=""]'
      ),

    (value: string): string => this.htmlParser.cleanupHtml(value),

    (value: string): string =>
      value.replace(/<div><br><\/div>/gi, '<div class="empty-line"><br></div>'),

    (value: string): string =>
      this.htmlParser.enforceAttributes(
        value,
        {
          a: {
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          '[href*="/employee-profile/"]': {
            target: null,
            rel: null,
          },
        },
        false
      ) as string,

    (value: string): string =>
      this.htmlParser.linkify(value, 'rel="noopener noreferrer"'),
  ];

  public filterXSS(
    html: string,
    options: Partial<FilterXSSOptions> = null
  ): string {
    return !html || !isString(html)
      ? html
      : options
      ? xss
          .filterXSS(html, { ...SANITIZER_FILTER_XSS_OPTIONS, ...options })
          .replace(/\[removed\]/g, '')
      : (
          this.htmlSanitizer ||
          (this.htmlSanitizer = new xss.FilterXSS(SANITIZER_FILTER_XSS_OPTIONS))
        )
          .process(html)
          .replace(/\[removed\]/g, '');
  }

  public sanitizeHtml(
    html: string,
    options: Partial<FilterXSSOptions> = null
  ): string {
    return !html || !isString(html)
      ? html
      : chainCall(this.htmlSanitizeChain, this.filterXSS(html, options));
  }
}
