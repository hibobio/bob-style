import { Type } from '@angular/core';

export type RenderedComponentContent =
  | string
  | RenderedComponent
  | (string | RenderedComponent)[];

export interface RenderedComponentHandlers {
  [key: string]: (...args: any[]) => void;
}

export interface RenderedComponent {
  component: Type<any>;
  attributes?: object;
  content?: RenderedComponentContent;
  handlers?: RenderedComponentHandlers;
  id?: string | number;
}
