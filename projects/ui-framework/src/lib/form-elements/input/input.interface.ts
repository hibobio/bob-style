import { InputEventType } from '../form-elements.enum';

export interface InputEvent<T = any> {
  event: InputEventType;
  value: T;
  [key: string]: any;
}
