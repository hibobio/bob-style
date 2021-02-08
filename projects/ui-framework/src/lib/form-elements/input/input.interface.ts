import { InputEventType } from '../form-elements.enum';

export interface BInputEvent<T = any> {
  event: InputEventType;
  value: T;
  [key: string]: any;
}

export interface InputEvent<T = any> extends BInputEvent<T> {}
