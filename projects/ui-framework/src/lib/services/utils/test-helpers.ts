import {
  ComponentFixture,
  flush,
  flushMicrotasks,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Type } from '@angular/core';
import {
  NativeMouseEvents,
  NativeKeyboardEvents,
  NativeEvents,
} from '../../enums';

export const emptyImg =
  // tslint:disable-next-line: max-line-length
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

export const emptyImgWithText = (addtext = '') => {
  if (!addtext) {
    return emptyImg;
  }
  const imgSplit = emptyImg.split(';');
  imgSplit.splice(1, 0, addtext);
  return imgSplit.join(';');
};

export const emptyFilestackImg = emptyImgWithText('filestack?align=faces');

export const emptyImgTestString = '6kgAAAABJRU5ErkJggg';

export const eventEmitterMock = {
  emit: (value) => value,
  observers: [1, 2, 3],
  subscribe: () => {},
  complete: () => {},
};

export const changeDetectorMock = {
  destroyed: false,
  markForCheck: () => {},
  detach: () => {},
  detectChanges: () => {},
  checkNoChanges: () => {},
  reattach: () => {},
};

export const elementsFromFixture = <T = HTMLElement>(
  fixtr: ComponentFixture<any>,
  selector: string
): T[] => {
  const debugElems = fixtr.debugElement.queryAll(By.css(selector));

  return debugElems.map((de) => {
    return de ? de.nativeElement : null;
  });
};

export const elementFromFixture = <T = HTMLElement>(
  fixtr: ComponentFixture<any>,
  selector: string
): T => elementsFromFixture<T>(fixtr, selector)[0];

export const componentFromFixture = <T = any>(
  fixtr: ComponentFixture<any>,
  selector: string
): T => {
  const comp: DebugElement = fixtr.debugElement.query(By.css(selector));
  return comp && comp.componentInstance ? (comp.componentInstance as T) : null;
};

export const inputValue = (
  inputElem: any,
  value: string | number,
  doBlur = true,
  doChange = true
): void => {
  (inputElem as HTMLInputElement).value = value as string;
  (inputElem as HTMLElement).dispatchEvent(
    new Event('input', {
      target: inputElem,
      type: 'input',
    } as EventInit)
  );
  if (doBlur) {
    (inputElem as HTMLElement).dispatchEvent(
      new Event('blur', {
        target: inputElem,
        type: 'blur',
      } as EventInit)
    );
  }
  if (doChange) {
    (inputElem as HTMLElement).dispatchEvent(
      new Event('change', {
        target: inputElem,
        type: 'change',
      } as EventInit)
    );
  }
};

export const emitNativeEvent = (
  element: any,
  type: string | NativeEvents = NativeEvents.click,
  props = null
): void => {
  if (!element) {
    return;
  }
  if (!props) {
    props = {};
  }
  if (!props.target) {
    props.target = element;
  }
  const eventData = {
    isTrusted: true,
    type: type,
    bubbles: true,
    currentTarget: props.target,
    srcElement: props.target,
    ...props,
  } as EventInit;

  if (NativeMouseEvents.includes(type as any)) {
    (element as HTMLElement).dispatchEvent(new MouseEvent(type, eventData));
  } else if (NativeKeyboardEvents.includes(type as any)) {
    (element as HTMLElement).dispatchEvent(new KeyboardEvent(type, eventData));
  } else {
    (element as HTMLElement).dispatchEvent(new Event(type, eventData));
  }
};

export const getPseudoContent = (elem: HTMLElement, pseudo = 'before') => {
  return getComputedStyle(elem, ':' + pseudo).getPropertyValue('content');
};

export const getCssVariable = (elem: HTMLElement, variable: string): string => {
  return getComputedStyle(elem).getPropertyValue(
    '--' + variable.replace('--', '')
  );
};

export const fakeAsyncFlush = () => {
  flush();
  flushMicrotasks();
  discardPeriodicTasks();
};
