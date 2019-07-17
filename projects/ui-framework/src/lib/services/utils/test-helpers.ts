import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';

export const elementsFromFixture = (
  fixtr: ComponentFixture<any>,
  selector: string
): HTMLElement[] => {
  const debugElems = fixtr.debugElement.queryAll(By.css(selector));
  return debugElems.map(de => de.nativeElement);
};

export const elementFromFixture = (
  fixtr: ComponentFixture<any>,
  selector: string
): HTMLElement => elementsFromFixture(fixtr, selector)[0];

export const simpleChange = changes => {
  const simpleChanges = {};
  Object.keys(changes).forEach(key => {
    simpleChanges[key] = new SimpleChange(undefined, changes[key], false);
  });
  return simpleChanges;
};

export const inputValue = (inputElem: any, value: string | number): void => {
  (inputElem as HTMLInputElement).value = value as string;
  (inputElem as HTMLElement).dispatchEvent(
    new Event('input', {
      target: inputElem,
      type: 'input'
    } as EventInit)
  );
  (inputElem as HTMLElement).dispatchEvent(
    new Event('blur', {
      target: inputElem,
      type: 'blur'
    } as EventInit)
  );
};

export const emitNativeEvent = (
  element: any,
  type = 'click',
  props = null
): void => {
  if (!props) {
    props = {};
  }
  if (!props.target) {
    props.target = element;
  }
  (element as HTMLElement).dispatchEvent(
    new Event(type, {
      type: type,
      bubbles: true,
      currentTarget: props.target,
      srcElement: props.target,
      ...props
    } as EventInit)
  );
};
