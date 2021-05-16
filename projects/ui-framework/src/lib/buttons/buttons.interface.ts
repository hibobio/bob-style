import { IconColor, Icons } from '../icons/icons.enum';
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
  onClick?: (arg?: MouseEvent | any) => void;
}

export interface ButtonConfig extends Button {}
