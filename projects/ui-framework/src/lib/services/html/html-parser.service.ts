import { Injectable } from '@angular/core';
import { LinkifyPipe } from '../filters/linkify.pipe';
import { GenericObject } from '../../types';
import {
  isString,
  isObject,
  isEmptyObject,
  isEmptyArray,
  closestNumber,
  asArray,
  isDomElement,
  isFunction,
} from '../utils/functional-utils';
import { DOMhelpers } from './dom-helpers.service';
import { EnforceFontSizeConfig, ProcessCSS } from './html-parser.interface';
import {
  HTML_CLEANUP_REPLACERS_DEF,
  HtmlCleanupReplacer,
  STYLES_KEEP_ON_DIV,
  FONTSIZE_KEY_TO_NUM_MAP,
  LANGUAGE_TESTS,
} from './html-parser.const';
import { TreeWalkerTake, TreeWalkerFilter, DOMtags } from './dom-helpers.enum';
import { GetElementStylesConfig } from './dom-helpers.interface';

@Injectable({ providedIn: 'root' })
export class HtmlParserHelpers {
  constructor(private DOM: DOMhelpers) {}

  public linkify(value: string, add = ''): string {
    return LinkifyPipe.prototype.transform(value, add);
  }

  public cleanupHtml(
    value: string,
    replacers: HtmlCleanupReplacer[] = HTML_CLEANUP_REPLACERS_DEF
  ): string {
    if (!value?.trim() || isEmptyArray(replacers)) {
      return value;
    }
    return asArray(replacers)
      .reduce((result: string, replacer: HtmlCleanupReplacer) => {
        replacer.find.forEach((find: RegExp, index) => {
          result = result.replace(find, replacer.replaceWith[index]);
        });
        return result;
      }, value)
      .trim();
  }

  public enforceAttributes(
    value: string | HTMLElement,
    enforce: {
      [selector: string]: GenericObject;
    } = null,
    returnDOM = false
  ): string | HTMLElement {
    if (!value || isEmptyObject(enforce)) {
      return value;
    }

    const elm: HTMLElement = isDomElement(value)
      ? value
      : this.stringToDOM(value);

    Object.keys(enforce).forEach((selector: string) => {
      const attributes = enforce[selector];

      const allowedAttrs = Object.keys(attributes).reduce((aa, a) => {
        if (attributes[a] === true) {
          aa.push(a);
        }
        return aa;
      }, []);

      Array.from(elm.querySelectorAll(selector)).forEach(
        (elem: HTMLElement): void => {
          Object.keys(attributes).forEach((attr) => {
            if (attributes[attr] === null) {
              if (!/[.*+^]/.test(attr)) {
                elem.removeAttribute(attr);
              } else {
                Array.from(elem.attributes)
                  .map((a) => a.name)
                  .filter((a) => new RegExp(attr, 'i').test(a))
                  .forEach((a) => {
                    if (!allowedAttrs.includes(a)) {
                      elem.removeAttribute(a);
                    }
                  });
              }
            } else {
              if (attr === 'class') {
                let classes = attributes[attr];

                if (isObject(classes)) {
                  Object.keys(classes).forEach((c) => {
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
                if (attributes[attr] !== null && attributes[attr] !== true) {
                  elem.setAttribute(attr, attributes[attr]);
                }
              }
            }
          });
        }
      );
    });

    return returnDOM ? elm : this.DOMtoString(elm);
  }

  public replaceElements(
    value: string | HTMLElement,
    replace: {
      [tag: string]: {
        with?: string;
        if?: (e: HTMLElement) => boolean;
        withFnc?: (e: HTMLElement) => string;
      };
    } = null,
    returnDOM = false
  ): string | HTMLElement {
    if (!value || isEmptyObject(replace)) {
      return value;
    }

    const elm: HTMLElement = isDomElement(value)
      ? value
      : this.stringToDOM(value);

    Object.keys(replace).forEach((tag: string) => {
      Array.from(elm.getElementsByTagName(tag)).forEach(
        (elToReplace: HTMLElement): void => {
          if (
            elToReplace === elm ||
            (isFunction(replace[tag].if) && !replace[tag].if(elToReplace))
          ) {
            return;
          }

          const newTagName = isFunction(replace[tag].withFnc)
            ? replace[tag].withFnc(elToReplace)
            : replace[tag].with;

          if (newTagName === null) {
            return;
          }

          const newEl = document.createElement(newTagName);
          newEl.innerHTML = elToReplace.innerHTML;
          elToReplace.parentElement.replaceChild(newEl, elToReplace);
        }
      );
    });

    return returnDOM ? elm : this.DOMtoString(elm);
  }

  // WIP----start------------------

  private blockCssTextToKeep(
    block: HTMLElement,
    styles: GenericObject
  ): string {
    if (isEmptyObject(styles) || this.DOM.isInlineElement(block)) {
      return '';
    }
    return Object.keys(styles)
      .filter((key) => styles[key] && STYLES_KEEP_ON_DIV.includes(key))
      .map((key) => `${key}: ${styles[key]}`)
      .join(';');
  }

  private blockRemoveStyles(
    block: HTMLElement,
    preserveCSS: GetElementStylesConfig
  ): void {
    const cssText = this.blockCssTextToKeep(
      block,
      this.DOM.getElementStyles(block, {
        ...preserveCSS,
        getStyles: 'inline',
        removeStyleAttr: false,
      })
    );
    if (cssText === '') {
      block.removeAttribute('style');
    } else {
      block.style.cssText = cssText;
    }
  }

  // TODO: Add Test
  public processStyles(
    value: string | HTMLElement,
    processCSS: ProcessCSS = {
      preserveCSS: {
        rules: ['font-size', 'font-weight'],
        ignoreValues: [12, 400],
      },
      enforceFontSize: { enforce: null, remove: null },
    },
    returnDOM = false
  ): string | HTMLElement {
    const { preserveCSS, enforceFontSize } = processCSS;

    if (!value || isEmptyArray(preserveCSS?.rules)) {
      return value;
    }

    const elm: HTMLElement = isDomElement(value)
      ? value
      : this.stringToDOM(value);

    const hiddenRenderedElem = document.createElement('div');
    this.DOM.appendCssText(
      hiddenRenderedElem,
      'position: absolute; overflow: hidden; width: 0px; height: 0px;'
    );
    document.body.appendChild(hiddenRenderedElem);
    hiddenRenderedElem.appendChild(elm);

    this.DOM.walkNodeTree(elm, {
      take: TreeWalkerTake.textNodes,

      filter: (node: Node) =>
        node.nodeValue?.trim()
          ? TreeWalkerFilter.accept
          : TreeWalkerFilter.reject,

      forEach: (node: Node) => {
        let parentEl = node.parentElement as HTMLElement;
        let hasStrongParent = this.DOM.isTag(parentEl, DOMtags.strong);

        while (
          this.DOM.isInlineElement(parentEl) &&
          !parentEl.getAttribute('style') &&
          !this.DOM.isSpan(parentEl)
        ) {
          parentEl = (parentEl as HTMLElement).parentElement;
          hasStrongParent =
            this.DOM.isTag(parentEl, DOMtags.strong) || hasStrongParent;
        }

        let parentStyle = this.DOM.getElementStyles(parentEl, {
          getStyles: 'computed',
          rules: preserveCSS.rules.filter(
            (r) => !STYLES_KEEP_ON_DIV.includes(r)
          ),
          ignoreValues: preserveCSS.ignoreValues,
          removeStyleAttr: false,
        });

        if (hasStrongParent) {
          parentStyle['font-weight'] = null;
        }

        if (enforceFontSize?.enforce) {
          parentStyle = this.stylesEnforceFontSize(
            parentStyle,
            enforceFontSize
          );
        }

        const parentCssText = this.DOM.stylesToCssText(parentStyle);

        if (
          parentCssText &&
          !this.isSameCssText(parentCssText, parentEl.style.cssText)
        ) {
          const wrapper =
            !this.DOM.hasChildren(parentEl) &&
            this.DOM.isSpan(parentEl) &&
            !parentEl.getAttribute('prcsd')
              ? parentEl
              : this.DOM.hasChildren(parentEl)
              ? this.DOM.wrapElement(node, 'span')
              : this.DOM.wrapChildren(parentEl, 'span');

          wrapper.style.cssText = parentCssText;
          wrapper.setAttribute('prcsd', '1');
        } else if (parentCssText) {
          parentEl.setAttribute('prcsd', '1');
        }
      },
    });

    Array.from(elm.querySelectorAll('[style]:not([prcsd])')).forEach(
      (el: HTMLElement) => {
        this.blockRemoveStyles(el, preserveCSS);
      }
    );

    Array.from(elm.querySelectorAll('[prcsd]')).forEach((el: HTMLElement) => {
      el.removeAttribute('prcsd');
    });

    hiddenRenderedElem.innerHTML = '';
    document.body.removeChild(hiddenRenderedElem);

    return returnDOM ? elm : this.DOMtoString(elm);
  }

  private isSameCssText(cssTextA: string, cssTextB: string): boolean {
    const sortCssString = (cssStr: string): string =>
      cssStr.replace(/\s/g, '').split(';').sort().join('');

    return sortCssString(cssTextA) === sortCssString(cssTextB);
  }

  private stylesEnforceFontSize(
    styles: GenericObject,
    config: EnforceFontSizeConfig = { enforce: null, remove: null }
  ): GenericObject {
    const { enforce, remove } = config;

    if (!styles || !styles['font-size'] || isEmptyArray(enforce)) {
      return styles;
    }

    const fontSize: string = styles['font-size'];
    let fontSizeNum: number = parseFloat(fontSize);

    if (fontSize.indexOf('%') !== -1) {
      fontSizeNum = (fontSizeNum / 100) * 12;
    }
    if (fontSize.indexOf('em') !== -1 || fontSize.indexOf('rem') !== -1) {
      fontSizeNum = fontSizeNum * 12;
    }
    if (fontSizeNum !== fontSizeNum) {
      fontSizeNum = FONTSIZE_KEY_TO_NUM_MAP[fontSize] || null;
    }

    fontSizeNum =
      fontSizeNum === null ? null : closestNumber(fontSizeNum, enforce);

    return {
      ...styles,
      'font-size':
        (remove && remove.includes(fontSizeNum)) || fontSizeNum === null
          ? null
          : fontSizeNum + 'px',
    };
  }

  // TODO: Add Test
  public enforceFontSize(
    value: string | HTMLElement,
    config: EnforceFontSizeConfig = { enforce: null, remove: null },
    returnDOM = false
  ): string | HTMLElement {
    let { enforce, remove } = config;

    if (
      !value ||
      isEmptyArray(enforce) ||
      (isString(value) && value.indexOf('font-size') === -1)
    ) {
      return value;
    }
    enforce = asArray(enforce);
    remove = isEmptyArray(remove) ? null : asArray(remove);

    const elm: HTMLElement = isDomElement(value)
      ? value
      : this.stringToDOM(value);

    Array.from(elm.querySelectorAll('[style*="font-size"]')).forEach(
      (el: HTMLElement) => {
        const fontSize: string = el.style.fontSize;
        let fontSizeNum: number = parseFloat(fontSize);

        if (fontSize.indexOf('%') !== -1) {
          fontSizeNum = (fontSizeNum / 100) * 12;
        }
        if (fontSize.indexOf('em') !== -1 || fontSize.indexOf('rem') !== -1) {
          fontSizeNum = fontSizeNum * 12;
        }
        if (fontSizeNum !== fontSizeNum) {
          fontSizeNum = FONTSIZE_KEY_TO_NUM_MAP[fontSize] || null;
        }

        fontSizeNum =
          fontSizeNum === null ? null : closestNumber(fontSizeNum, enforce);

        this.DOM.setCssProps(el, {
          'font-size':
            (remove && remove.includes(fontSizeNum)) || fontSizeNum === null
              ? null
              : fontSizeNum + 'px',
        });

        if (this.DOM.isSpan(el) && !el.getAttribute('style')) {
          this.DOM.unwrap(el);
        }
      }
    );

    return returnDOM ? elm : this.DOMtoString(elm);
  }

  // TODO: Add Test
  public unwrapDivElements(
    value: string | HTMLElement,
    returnDOM = false
  ): string | HTMLElement {
    if (!value) {
      return value;
    }

    const elm: HTMLElement = isDomElement(value)
      ? value
      : this.stringToDOM(value);
    const docFrag = document.createDocumentFragment();

    Array.from(elm.querySelectorAll('div > div'))
      .filter(
        (block: HTMLElement) =>
          !Array.from(block.children).some((b) => b.tagName === 'DIV') ||
          this.DOM.hasTextNodes(block)
      )
      .forEach((block: HTMLElement) => {
        const movedElsRefs = [];
        let parent = block.parentElement;

        while (parent && parent !== elm) {
          while (parent.firstChild) {
            const child = parent.removeChild(parent.firstChild);
            docFrag.appendChild(child);
            movedElsRefs.push(child);
          }
          const grandParent = parent.parentElement;
          grandParent.replaceChild(docFrag, parent);
          parent = grandParent;
        }
      });

    return returnDOM ? elm : this.DOMtoString(elm);
  }

  public unwrapInlineElements(
    value: string | HTMLElement,
    returnDOM = false
  ): string | HTMLElement {
    if (!value) {
      return value;
    }

    const elm: HTMLElement = isDomElement(value)
      ? value
      : this.stringToDOM(value);

    const tags = [['B', 'STRONG'], ['I', 'EM'], ['U'], ['DIV', 'P'], ['SPAN']];

    elm.querySelectorAll('* > *:only-child').forEach((node) => {
      //
      let childTagType = tags.findIndex((tgs) => tgs.includes(node.tagName));
      if (childTagType < 0) {
        return;
      }

      if (node.children.length === 1 && node.children[0].tagName === 'BR') {
        childTagType = 5;
      }

      let parent = node.parentElement;
      let parentTagtype = tags.findIndex((tgs) => tgs.includes(parent.tagName));

      while (
        parent !== elm &&
        (parentTagtype === childTagType ||
          parentTagtype === 4 ||
          childTagType === 5) &&
        parent.children.length === 1
      ) {
        const child = parent.removeChild(parent.firstChild);
        const grandParent = parent.parentElement;
        grandParent.replaceChild(child, parent);

        parent = grandParent;
        parentTagtype = tags.findIndex((tgs) => tgs.includes(parent.tagName));
      }
    });

    return returnDOM ? elm : this.DOMtoString(elm);
  }

  // WIP----end------------------

  public removeElements(value: string, selector: string): string {
    if (!value || !selector) {
      return value;
    }
    const elm: HTMLElement = this.stringToDOM(value);

    elm.querySelectorAll(selector).forEach((el) => el.remove());
    return this.DOMtoString(elm);
  }

  public deLinkify(value: string): string {
    if (!value?.trim() || !isString(value)) {
      return value;
    }

    const linkRegex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;

    let res = value;
    let match: RegExpExecArray;

    while ((match = linkRegex.exec(value)) != null) {
      res = res.replace(
        match[0],
        match[1].includes(match[2].split('…')[0])
          ? match[1]
          : `${match[2]} (${match[1]})`
      );
    }

    return res;
  }

  public getPlainText(html: string | HTMLElement | any): string {
    if (!html) {
      return '';
    }

    if (!isString(html) || isDomElement(html)) {
      return String(html.textContent || html || '').replace(/\s+/gi, ' ');
    }

    const elm: HTMLElement = isDomElement(html)
      ? (html.cloneNode() as HTMLElement)
      : this.stringToDOM(html);

    elm.innerHTML = this.deLinkify(elm.innerHTML);

    elm.querySelectorAll('div, li, p, h1, h2, h3').forEach((e: HTMLElement) => {
      if (!this.DOM.isEmpty(e)) {
        e.prepend(this.DOM.isTag(e, DOMtags.li) ? '_±§±_' : '_§±§_');
      }
    });

    return elm.innerText
      .replace(/_§±§_/g, '\n')
      .replace(/_±§±_/g, '\n- ')
      .replace(/^[ \t]+/gim, '')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/([\r\n]){3,}/g, '\n\n')
      .trim();
  }

  public stringToDOM(value: string): HTMLElement {
    if (!isString(value)) {
      return value as any;
    }
    const elm: HTMLElement = document.createElement('div');
    elm.innerHTML = value;
    return elm;
  }

  public DOMtoString(elm: HTMLElement): string {
    if (!isDomElement(elm)) {
      return elm as any;
    }
    return elm.innerHTML;
  }

  public addLangAttributes(
    html: string | HTMLElement,
    returnDOM = true
  ): string | HTMLElement {
    const elm: HTMLElement = isDomElement(html) ? html : this.stringToDOM(html);
    const plainText = isString(html) ? html : elm.innerText;

    Object.keys(LANGUAGE_TESTS).forEach((key) => {
      if (!LANGUAGE_TESTS[key].test.test(plainText)) {
        return;
      }
      this.DOM.walkNodeTree(elm, {
        take: TreeWalkerTake.textNodes,
        filter: (node: Node) =>
          node.nodeType !== 8 && LANGUAGE_TESTS[key].test.test(node.textContent)
            ? TreeWalkerFilter.accept
            : TreeWalkerFilter.reject,
        forEach: (node) => {
          this.DOM.setAttributes(
            node.parentElement,
            LANGUAGE_TESTS[key].attributes
          );
          return node.parentElement || node;
        },
      });
    });

    return returnDOM ? elm : this.DOMtoString(elm);
  }
}
