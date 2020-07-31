import { Injectable } from '@angular/core';
import {
  isString,
  isArray,
  isObject,
  joinArrays,
  isNotEmptyString,
  isNotEmptyArray,
  isNotEmptyObject,
  isNullOrUndefined,
  isDomElement,
  isTextNode,
  isNode,
  isEmptyArray,
  asArray,
  hasProp,
} from '../utils/functional-utils';
import {
  Styles,
  TextProps,
  NotEmptyChildren,
  NgClass,
} from './html-helpers.interface';
import { GenericObject } from '../../types';
import { INLINE_EL_NODENAMES, BLOCK_EL_NODENAMES } from './dom-helpers.const';
import { DOMtags, TreeWalkerTake } from './dom-helpers.enum';
import {
  GetElementStylesConfig,
  TreeWalkerConfig,
} from './dom-helpers.interface';

@Injectable({ providedIn: 'root' })
export class DOMhelpers {
  constructor() {}

  public injectStyles(
    styles: string = '',
    elem: HTMLElement | Document = document
  ): void {
    let styleEl: HTMLStyleElement, existingStyles: string;
    if (elem === document) {
      elem = document.head;
    }
    styleEl = elem.querySelector(`style[data-injected="true"]`);
    if (styleEl) {
      existingStyles = styleEl.innerHTML.replace(/\s*/gim, '');
    }
    if (!styleEl && styles) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('data-injected', 'true');
      elem.appendChild(styleEl);
    }
    if (
      styles &&
      (!existingStyles ||
        (existingStyles &&
          styleEl.innerHTML.replace(/\s*/gim, '') !== existingStyles))
    ) {
      styleEl.innerHTML = styles;
      return;
    }
    if (styleEl && !styles) {
      styleEl.remove();
    }
  }

  public isTextNode(element: any): element is Node {
    return isTextNode(element);
  }

  public isElement(element: any): element is HTMLElement {
    return isDomElement(element);
  }

  public isNode(element: any): element is Node {
    return isNode(element);
  }

  public isInlineElement(element: HTMLElement | Node): element is HTMLElement {
    return (
      isDomElement(element) && INLINE_EL_NODENAMES.includes(element.nodeName)
    );
  }

  public isBlockElement(element: HTMLElement | Node): element is HTMLElement {
    return (
      isDomElement(element) && BLOCK_EL_NODENAMES.includes(element.nodeName)
    );
  }

  public isTag(element: HTMLElement, tag: DOMtags): boolean {
    return isDomElement(element) && (element as HTMLElement).tagName === tag;
  }

  public isSpan(element: HTMLElement | Node): element is HTMLElement {
    return this.isTag(element as HTMLElement, DOMtags.span);
  }

  public isDiv(element: HTMLElement | Node): element is HTMLElement {
    return this.isTag(element as HTMLElement, DOMtags.div);
  }

  public isRendered(element: HTMLElement | Node): boolean {
    return this.isElement(element) && document.contains(element);
  }

  public hasChildren(element: HTMLElement): boolean {
    return element.children.length !== 0;
  }

  public hasInnerText(element: HTMLElement): boolean {
    return Boolean(
      element && element.textContent && element.textContent.trim()
    );
  }

  public hasChildrenWithText(element: HTMLElement): NotEmptyChildren {
    const defAcc = { total: 0, firstIndex: null };
    return element.children.length > 0
      ? Array.from(element.children).reduce((acc, node, index) => {
          const hasText = this.hasInnerText(node as HTMLElement);
          return {
            total: hasText ? acc.total + 1 : acc.total,
            firstIndex:
              hasText && acc.firstIndex === null ? index : acc.firstIndex,
          };
        }, defAcc)
      : defAcc;
  }

  public getTextNode(element: HTMLElement): Node {
    return (
      element &&
      Array.from(element.childNodes).find(
        (node: HTMLElement) => this.isTextNode(node) && this.hasInnerText(node)
      )
    );
  }

  public hasTextNodes(element: HTMLElement): boolean {
    return element.childNodes.length > 0 && !!this.getTextNode(element);
  }

  public isEmpty(element: HTMLElement): boolean {
    return element && !this.hasChildren(element) && !this.hasInnerText(element);
  }

  // set any css properties
  // (provided as JSON with props in kebab-case),
  // including css variables ('--color-red')
  public setCssProps(element: HTMLElement, props: Styles): void {
    if (!element) {
      return;
    }
    for (const prop of Object.keys(props)) {
      if (!isNullOrUndefined(props[prop])) {
        element.style.setProperty(prop, props[prop] as string);
      } else {
        element.style.removeProperty(prop);
      }
    }

    const currStyleAttr = element.getAttribute('style');
    if (!currStyleAttr) {
      return;
    }

    if (currStyleAttr.trim() === '') {
      element.removeAttribute('style');
    }
    if (currStyleAttr !== currStyleAttr.trim()) {
      element.setAttribute('style', currStyleAttr.trim());
    }
  }

  public setAttributes(element: HTMLElement, attrs: GenericObject): void {
    for (const attr of Object.keys(attrs)) {
      if (!isNullOrUndefined(attrs[attr])) {
        element.setAttribute(attr, attrs[attr] as string);
      } else {
        element.removeAttribute(attr);
      }
    }
  }

  // WIP----start------------------

  // TODO: Add Test
  public appendCssText(element: HTMLElement, cssText: string): void {
    if (!this.isElement(element)) {
      return;
    }
    element.style.cssText += ';' + cssText;
  }

  // TODO: Add Test
  public stylesToCssText(
    styles: GenericObject,
    filter: (prop: string, val: string | number) => boolean = (p, v) => true
  ): string {
    return Object.keys(styles || {})
      .reduce((result: string[], prop: string) => {
        const value = styles[prop];
        if (!isNullOrUndefined(styles[prop]) && filter(prop, value)) {
          result.push(`${prop}: ${styles[prop]}`);
        }
        return result;
      }, [])
      .join(';');
  }

  // TODO: Add Test
  public getElementStyles(
    element: HTMLElement | Node,
    config: GetElementStylesConfig = {
      getStyles: 'inline',
      rules: ['font-size', 'font-weight'],
      ignoreValues: [12, 400],
      removeStyleAttr: false,
    },
    collection: GenericObject = {}
  ): GenericObject {
    const { rules, ignoreValues, removeStyleAttr } = config;
    if (!this.isElement(element) || isEmptyArray(rules)) {
      return collection;
    }
    let { getStyles } = config;
    if (!getStyles) {
      getStyles = 'inline';
    }
    let computedStyle: CSSStyleDeclaration;

    if (getStyles === 'computed') {
      // TODO: should check if element is in rendered DOM (add it and check if document.getElementById finds it)
      if (!this.isRendered(element)) {
        console.error(
          `[DOMhelpers.getElementStyles]:
        element is not HTMLElement or is not in rendered DOM:`,
          element
        );
        return collection;
      }
      computedStyle = getComputedStyle(element);
    }

    asArray(rules).forEach((rule) => {
      let val =
        getStyles === 'computed' ? computedStyle[rule] : element.style[rule];

      if (val.indexOf(' ') !== -1 && val.indexOf('none') !== -1) {
        val = undefined;
      }

      if (val && !hasProp(collection, rule)) {
        collection[rule] =
          isEmptyArray(ignoreValues) ||
          (!ignoreValues.includes(val) &&
            !ignoreValues.includes(parseFloat(val)))
            ? val
            : null;
      }
    });

    if (removeStyleAttr) {
      element.removeAttribute('style');
    }
    return collection;
  }

  // WIP----end------------------

  // returns line-height and font-size as unitless numbers
  public getElementTextProps(element: HTMLElement): TextProps {
    const computedStyle = getComputedStyle(element),
      fontSize = parseFloat(computedStyle.fontSize),
      lineHeight =
        computedStyle.lineHeight.indexOf('px') !== -1
          ? parseFloat(computedStyle.lineHeight) / fontSize
          : computedStyle.lineHeight.indexOf('%') !== -1
          ? parseFloat(computedStyle.lineHeight) / 100
          : undefined;
    return {
      fontSize: fontSize,
      lineHeight: lineHeight,
    };
  }

  public getElementCSSvar(element: HTMLElement, cssVar: string): string {
    return getComputedStyle(element, '::after').getPropertyValue(cssVar);
  }

  // returns deepest element that has text
  // or multiple children with text
  // or combination of above
  public getDeepTextElement(element: HTMLElement): HTMLElement {
    let hasChildrenWithText = this.hasChildrenWithText(element);
    while (hasChildrenWithText.total === 1 && !this.hasTextNodes(element)) {
      element = element.children[hasChildrenWithText.firstIndex] as HTMLElement;
      hasChildrenWithText = this.hasChildrenWithText(element);
    }
    return element;
  }

  public getDeepTextNode(element: HTMLElement): Node {
    return (
      this.hasInnerText(element) &&
      this.getTextNode(this.getDeepTextElement(element))
    );
  }

  public getInnerWidth(element: HTMLElement, hardcore = false) {
    const computedStyle = getComputedStyle(element);

    let width = !hardcore
      ? element.offsetWidth
      : Math.max(
          element.offsetWidth ||
            parseFloat(computedStyle.width) ||
            element.getBoundingClientRect().width
        );

    if (width === 0) {
      return 0;
    }

    width =
      width -
      parseFloat(computedStyle.paddingLeft) -
      parseFloat(computedStyle.paddingRight) -
      parseFloat(computedStyle.borderLeftWidth) -
      parseFloat(computedStyle.borderRightWidth);
    return width > 0 ? width : 0;
  }

  public isInView(element: HTMLElement) {
    const { top, height } = element.getBoundingClientRect();
    const vpHeight =
      window.innerHeight || document.documentElement.clientHeight;

    return top <= vpHeight && top + height >= 0;
  }

  // TODO: Add Test
  // find closest parent either by CSS selector or by test function
  // can return element or test result
  public getClosest(
    element: HTMLElement,
    test: string | Function,
    rtrn: 'element' | 'result' = 'element'
  ): any {
    if (!element || !test) {
      return null;
    }
    if (isString(test)) {
      return element.closest(test as string);
    }
    while (
      !(test as Function)(element) &&
      element !== document.documentElement &&
      element.parentElement
    ) {
      element = element.parentElement;
    }
    test = (test as Function)(element);
    return { element: test ? element : null, result: test }[rtrn];
  }

  public getClosestUntil(
    element: HTMLElement | Node,
    closestSelector: string,
    until: string | HTMLElement
  ): HTMLElement {
    if (
      !(isTextNode(element) || isDomElement(element)) ||
      !closestSelector ||
      !until
    ) {
      return null;
    }

    let parent =
      element.nodeType === Node.TEXT_NODE
        ? element.parentElement
        : (element as HTMLElement);

    while (
      ((isDomElement(until) && until !== parent) ||
        (isString(until) && !parent.matches(until))) &&
      !parent.matches(closestSelector) &&
      parent !== document.documentElement &&
      parent.parentElement
    ) {
      parent = parent.parentElement;
    }

    return parent.matches(closestSelector) ? parent : null;
  }

  // TODO: Add Test
  public getSibling(
    element: HTMLElement,
    selector: string = null,
    which: 'next' | 'prev' = 'next'
  ): HTMLElement {
    if (!element) {
      return null;
    }
    let sibling: HTMLElement =
      which === 'prev'
        ? (element.previousElementSibling as HTMLElement)
        : (element.nextElementSibling as HTMLElement);
    if (!selector) {
      return sibling;
    }
    while (sibling) {
      if (sibling.matches(selector)) {
        return sibling;
      }
      sibling =
        which === 'prev'
          ? (sibling.previousElementSibling as HTMLElement)
          : (sibling.nextElementSibling as HTMLElement);
    }
    return null;
  }

  // TODO: Add Test
  public getNextSibling(
    element: HTMLElement,
    selector: string = null
  ): HTMLElement {
    return this.getSibling(element, selector, 'next');
  }

  // TODO: Add Test
  public getPrevSibling(
    element: HTMLElement,
    selector: string = null
  ): HTMLElement {
    return this.getSibling(element, selector, 'prev');
  }

  public getTopLevelParent(element: HTMLElement): HTMLElement {
    if (!element.parentElement) {
      return element;
    }
    return this.getClosest(element, (elm: HTMLElement) => !elm.parentElement);
  }

  // TODO: Add Test
  public getElementIndex(element: HTMLElement): number {
    return (
      element && Array.from(element.parentElement.children).indexOf(element)
    );
  }

  // WIP----start------------------

  // TODO: Add Test
  public wrapChildren(element: HTMLElement, tag = 'span'): HTMLElement {
    if (!this.isElement(element)) {
      return element;
    }
    const wrapper = element.appendChild(document.createElement(tag));
    wrapper.setAttribute('prcsd', '2');
    Array.from(element.childNodes).forEach((node) => {
      if (node !== wrapper) {
        wrapper.appendChild(node);
      }
    });

    return wrapper;
  }

  // TODO: Add Test
  public wrapElement(
    element: HTMLElement | Node,
    tag = 'span',
    useParentIfSameAsWrapperTag = false
  ): HTMLElement {
    if (!this.isNode(element)) {
      return element as HTMLElement;
    }

    const parent = element.parentElement;

    const wrapper = !parent
      ? document.createElement(tag)
      : useParentIfSameAsWrapperTag &&
        parent.nodeName === tag.toUpperCase() &&
        !this.hasTextNodes(parent)
      ? parent
      : parent.insertBefore(document.createElement('span'), element);

    if (wrapper !== parent) {
      wrapper.setAttribute('prcsd', '2');
      wrapper.appendChild(element);
    }

    return wrapper;
  }

  public unwrap(element: HTMLElement): void {
    if (!this.isElement(element)) {
      return;
    }

    const parent = element.parentNode;

    if (!parent) {
      return;
    }

    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }

    parent.removeChild(element);
  }

  // TODO: Add Test
  public walkNodeTree(
    root: HTMLElement | Node,
    config: TreeWalkerConfig = {}
  ): (HTMLElement | Node)[] | void {
    if (!this.isNode(root)) {
      return;
    }

    const walker = document.createTreeWalker(
      root,
      config.take ? config.take : TreeWalkerTake.elements,
      config.filter
        ? {
            acceptNode: config.filter,
          }
        : undefined
    );

    const nodes: (HTMLElement | Node)[] = [];
    let n: HTMLElement | Node;

    while ((n = walker.nextNode())) {
      if (config.forEach) {
        config.forEach(n);
      }
      nodes.push(n);
    }

    return nodes;
  }

  // WIP----end------------------

  // Similar to [ngClass] binding.
  // Takes a string of space-separated classes, string[] of classes or {[class]: boolean} object
  // and adds/removes relative classes.
  // Usecase - to use on component host element,
  // as Hostbinding('ngClass') is not available
  public bindClasses(
    element: HTMLElement,
    classes: string | string[] | NgClass
  ): NgClass {
    if (!element || !this.isElement(element)) {
      return {};
    }

    let removeClasses: string[] = [];
    let addClasses: string[] = [];

    const classStringToArray = (cls: string): string[] => cls.split(' ').sort();

    const classesAsArray = (cls: string | string[]): string[] => {
      return isString(cls)
        ? classStringToArray(cls as string)
        : isArray(cls)
        ? (cls as string[]).slice().sort()
        : [];
    };

    const arrayToNgClass = (cls: string[], value = true): NgClass =>
      cls.reduce((acc, c) => {
        acc[c] = value;
        return acc;
      }, {});

    if (
      classes &&
      (isNotEmptyString(classes) ||
        isNotEmptyArray(classes) ||
        isNotEmptyObject(classes))
    ) {
      const currentClassesAsArray = classStringToArray(element.className);
      let newClassesString: string;

      if (isObject(classes)) {
        removeClasses = Object.keys(classes)
          .filter((c) => !classes[c])
          .sort();
        addClasses = joinArrays(
          currentClassesAsArray,
          Object.keys(classes).filter((c) => classes[c])
        ).sort();
      } else {
        addClasses = joinArrays(
          currentClassesAsArray,
          classesAsArray(classes as string | string[])
        ).sort();
      }
      newClassesString = addClasses
        .filter((c) => !removeClasses.includes(c))
        .join(' ');

      if (currentClassesAsArray.join(' ') !== newClassesString) {
        element.className = newClassesString.trim();
      }
    }

    return {
      ...arrayToNgClass(classStringToArray(element.className), true),
      ...arrayToNgClass(removeClasses, false),
    };
  }
}
