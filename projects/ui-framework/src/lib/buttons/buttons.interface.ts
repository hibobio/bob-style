import { IconColor, Icons } from '../icons/icons.enum';
import { DOMMouseEvent } from '../types';
import { ButtonSize, ButtonType } from './buttons.enum';

export interface Button {
  id?: string;
  type?: ButtonType;
  size?: ButtonSize;
  text?: string;

  icon?: Icons;

  color?: IconColor; // only for Square/Round button

  active?: boolean;
  disabled?: boolean;
  preloader?: boolean;

  throttle?: number | false;
  swallow?: boolean;
  onClick?: (arg?: DOMMouseEvent<HTMLButtonElement> | any) => void;
}

export interface ButtonConfig extends Button {}

export type ButtonInputCmnt = 'use [button] input for static props and separate inputs for dynamic props';
