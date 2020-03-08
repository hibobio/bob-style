import { Injectable } from '@angular/core';
import { LinkifyPipe } from '../filters/linkify.pipe';
import { GenericObject } from '../../types';
import { isString, isObject, isEmptyObject } from '../utils/functional-utils';

export interface CleanupHtmlConfig {
  removeNbsp?: boolean;
}

@Injectable({ providedIn: 'root' })
export class HtmlParserHelpers {
  constructor() {}

  public linkify(value: string, add = ''): string {
    return LinkifyPipe.prototype.transform(value, add);
  }

  public cleanupHtml(value: string, config: CleanupHtmlConfig = {}): string {
    //
    let processed: string = value

      // replace P with DIV
      .replace(/(<p)/gi, '<div')
      .replace(/<\/p>/gi, '</div>')

      // replace headings
      .replace(
        /(<h[1][^>]*>)/gi,
        '<div><br></div><div><span style="font-size: 28px;"><strong>'
      )
      .replace(
        /(<h[23][^>]*>)/gi,
        '<div><br></div><div><span style="font-size: 18px;"><strong>'
      )
      .replace(/(<h[456][^>]*>)/gi, '<div><br></div><div><span><strong>')
      .replace(/(<\/h\d>)/gi, '</strong></span></div>');

    if (config.removeNbsp) {
      processed = processed
        // no &nbsp;
        .replace(/&nbsp;/gi, ' ');
      // .replace(/(<\/div>)(\s*&nbsp;\s*)+(<div>)/gi, '$1$3')
    }

    processed = processed

      // empty tags
      .replace(/<([^\/>\s]+)[^>]*>\s*<\/\1>/gi, ' ')

      // unnecessary wrappers
      .replace(/<(span)>([^<]+)<\/\1>/gi, '$2')

      // less white space
      // .replace(/\s\s+/gi, ' ')
      .replace(/\s+/gi, ' ')

      // <br>'s inside tags with text (<div><br> text</div>)
      .replace(
        /(<(?:div|p|span|ul|ol|li|a|strong|em|i)[^>]*>)(?:\s*<br[^>]*>\s*)+([^<\s]+)/gi,
        '$1$2'
      )

      // replace <br><br> with <div><br></div>
      .replace(/([^<>])(<br[^>]*>\s*){2,}(?=[^<>\s])/gi, '$1<div><br></div>')

      // <br>'s at the start / end
      .replace(/(^(\s*<br[^>]*>\s*)+)|((\s*<br[^>]*>\s*)+$)/gi, '')

      // too many <div><br></div>
      .replace(
        /(<([^\/>\s]+)[^>]*>\s*<br[^>]*>\s*<\/\2>\s*){2,}/gi,
        '<div><br></div>'
      )

      // <div><br></div> at the start / end
      .replace(
        /(?:^\s*((?:<[^\/>]+>\s*)*)(?:<([^\/>\s]+)[^>]*>(?:\s*<br[^>]*>\s*)+<\/\2>\s*)+)/i,
        '$1'
      )
      .replace(
        /(?:(?:<([^\/>\s]+)[^>]*>(?:\s*<br[^>]*>\s*)+<\/\1>\s*)+((?:<\/[^\/>]+>\s*)*)$)/i,
        '$2'
      )

      // add spaces between text and tag
      .replace(/([^\s>])(<[^/])/gi, '$1 $2')
      .replace(/(<\/[^>]+>)([^\s<])/gi, '$1 $2')

      .trim();

    return processed;
  }

  public enforceAttributes(
    value: string,
    enforce: {
      [selector: string]: GenericObject;
    } = {}
  ): string {
    if (!enforce || isEmptyObject(enforce)) {
      return value;
    }

    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = value;

    Object.keys(enforce).forEach((selector: string) => {
      const attributes = enforce[selector];

      Array.from(elm.querySelectorAll(selector)).forEach(
        (elem: HTMLElement): void => {
          Object.keys(attributes).forEach(attr => {
            if (attributes[attr] === null) {
              if (!/[.*+^]/.test(attr)) {
                elem.removeAttribute(attr);
              } else {
                Array.from(elem.attributes)
                  .map(a => a.name)
                  .filter(a => new RegExp(attr, 'i').test(a))
                  .forEach(a => {
                    elem.removeAttribute(a);
                  });
              }
            } else {
              if (attr === 'class') {
                let classes = attributes[attr];

                if (isObject(classes)) {
                  Object.keys(classes).forEach(c => {
                    if (classes[c]) {
                      elem.classList.add(c);
                    } else {
                      if (/[.*+^]/.test(c) && elem.className !== '') {
                        [...elem.classList['values']()].forEach(
                          (cls: string) => {
                            if (new RegExp(c, 'i').test(cls)) {
                              elem.classList.remove(cls);
                            }
                          }
                        );
                      } else {
                        elem.classList.remove(c);
                      }
                    }
                  });
                } else {
                  if (isString(classes)) {
                    classes = classes.split(' ').filter(Boolean);
                  }
                  elem.classList.add(...classes);
                }
                if (elem.className === '') {
                  elem.removeAttribute(attr);
                }
              } else {
                if (attributes[attr] !== null) {
                  elem.setAttribute(attr, attributes[attr]);
                }
              }
            }
          });
        }
      );
    });

    return elm.innerHTML;
  }

  public removeElements(value: string, selector: string): string {
    if (!value || !selector) {
      return value;
    }
    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = value;

    elm.querySelectorAll(selector).forEach(el => el.remove());
    return elm.innerHTML;
  }
}
