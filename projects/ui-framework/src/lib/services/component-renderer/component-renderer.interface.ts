import { Type } from '@angular/core';
import { GenericObject } from '../../types';

export type RenderedComponentContent =
  | string
  | RenderedComponent
  | (string | RenderedComponent)[];

export interface RenderedComponentHandlers {
  [key: string]: (...args: any[]) => void;
}

export interface RenderedComponent<C = any> {
  component: Type<C>;
  attributes?: GenericObject;
  content?: RenderedComponentContent;
  handlers?: RenderedComponentHandlers;
  id?: string | number;
}
