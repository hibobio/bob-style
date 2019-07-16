import { Injectable } from '@angular/core';
import {
  isString,
  isArray,
  isObject,
  isEmptyObject,
  isEmptyString,
  isEmptyArray,
  joinArrays
} from './functional-utils';

export interface Styles {
  [key: string]: string | number;
}

export interface TextProps {
  [key: string]: number;
}

export interface NotEmptyChildren {
  total: number;
  firstIndex: number | null;
}

export interface NgClass {
  [key: string]: boolean;
}

@Injectable()
export class DOMhelpers {
  constructor() {}

  public isTextNode(element: any) {
    return element.nodeType === Node.TEXT_NODE;
  }

  public isElement(element: any) {
    return element.nodeType === Node.ELEMENT_NODE;
  }

  public hasChildren(element: HTMLElement): boolean {
    return element.children.length !== 0;
  }

  public hasInnerText(element: HTMLElement): boolean {
    return !!(element && element.textContent && element.textContent.trim());
  }

  public hasChildrenWithText(element: HTMLElement): NotEmptyChildren {
    const defAcc = { total: 0, firstIndex: null };
    return element.children.length > 0
      ? Array.from(element.children).reduce((acc, node, index) => {
          const hasText = this.hasInnerText(node as HTMLElement);
          return {
            total: hasText ? acc.total + 1 : acc.total,
            firstIndex:
              hasText && acc.firstIndex === null ? index : acc.firstIndex
          };
        }, defAcc)
      : defAcc;
  }

  public getTextNode(element: HTMLElement): Node {
    return element && Array.from(element.childNodes).find(this.isTextNode);
  }

  public hasTextNodes(element: HTMLElement): boolean {
    return element.childNodes.length > 0 && !!this.getTextNode(element);
  }

  public isEmpty(element: HTMLElement): boolean {
    return element && !this.hasChildren(element) && !this.hasTextNodes(element);
  }

  // set any css properties
  // (provided as JSON with props in kebab-case),
  // including css variables ('--color-red')
  public setCssProps(element: HTMLElement, props: Styles): void {
    for (const prop of Object.keys(props)) {
      element.style.setProperty(prop, props[prop] as string);
    }
  }

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
      lineHeight: lineHeight
    };
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

  public getInnerWidth(element: HTMLElement) {
    const computedStyle = getComputedStyle(element);
    const width =
      element.offsetWidth -
      parseFloat(computedStyle.paddingLeft) -
      parseFloat(computedStyle.paddingRight) -
      parseFloat(computedStyle.borderLeftWidth) -
      parseFloat(computedStyle.borderRightWidth);
    return width > 0 ? width : 0;
  }

  // TODO: Add Test
  // find closest parent either by CSS selector or by test function
  // can return element or test result
  public getClosest(
    element: HTMLElement,
    test: string | Function,
    rtrn: 'element' | 'result' = 'element'
  ): any {
    if (typeof test === 'string') {
      const sel = test as string;
      if (!element.matches(sel + ' ' + element.tagName)) {
        return null;
      }
      test = (el: HTMLElement): boolean => el.matches(sel);
    }
    while (
      !test(element) &&
      element !== document.documentElement &&
      element.parentElement
    ) {
      element = element.parentElement;
    }
    test = test(element);
    return { element: test ? element : null, result: test }[rtrn];
  }

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
        ? (cls as string).split(' ').sort()
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
      (!isEmptyString(classes) ||
        !isEmptyArray(classes) ||
        !isEmptyObject(classes))
    ) {
      const currentClassesAsArray = classStringToArray(element.className);
      let addClassesString: string;

      if (isObject(classes)) {
        removeClasses = Object.keys(classes)
          .filter(c => !classes[c])
          .sort();
        addClasses = joinArrays(
          currentClassesAsArray,
          Object.keys(classes).filter(c => classes[c])
        ).sort();
      } else {
        addClasses = joinArrays(
          currentClassesAsArray,
          classesAsArray(classes as string | string[])
        ).sort();
      }
      addClassesString = addClasses
        .filter(c => !removeClasses.includes(c))
        .join(' ');

      if (currentClassesAsArray.join(' ') !== addClassesString) {
        element.className = addClassesString;
      }
    }

    return {
      ...arrayToNgClass(classStringToArray(element.className), true),
      ...arrayToNgClass(removeClasses, false)
    };
  }
}
