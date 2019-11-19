import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SimpleChange, Type, SimpleChanges } from '@angular/core';
import {
  NativeMouseEvents,
  NativeKeyboardEvents,
  NativeEvents,
} from '../../enums';

export const eventEmitterMock = {
  emit: value => value,
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

export const elementsFromFixture = (
  fixtr: ComponentFixture<any>,
  selector: string
): HTMLElement[] => {
  const debugElems = fixtr.debugElement.queryAll(By.css(selector));
  return debugElems.map(de => (de ? de.nativeElement : null));
};

export const elementFromFixture = (
  fixtr: ComponentFixture<any>,
  selector: string
): HTMLElement => elementsFromFixture(fixtr, selector)[0];

export const componentFromFixture = (
  fixtr: ComponentFixture<any>,
  selector: string
): Type<any> => {
  const comp = fixtr.debugElement.query(By.css(selector));
  return comp && comp.componentInstance ? comp.componentInstance : null;
};

export const simpleChange = (
  changes: SimpleChanges,
  firstChange = false
): SimpleChanges => {
  const simpleChanges = {};
  Object.keys(changes).forEach(key => {
    simpleChanges[key] = new SimpleChange(undefined, changes[key], firstChange);
  });
  return simpleChanges;
};

export const inputValue = (
  inputElem: any,
  value: string | number,
  doBlur = true
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
};

export const emitNativeEvent = (
  element: any,
  type: string | NativeEvents = NativeEvents.click,
  props = null
): void => {
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
