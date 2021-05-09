import { IconColor, Icons } from '../icons/icons.enum';
import { ButtonSize, ButtonType } from './buttons.enum';

export interface Button {
  id?: string;
  type?: ButtonType;
  size?: ButtonSize;
  text?: string;
  color?: IconColor;
  icon?: Icons;
  active?: boolean;
  disabled?: boolean;
  preloader?: boolean;
  throttle?: number;
  swallow?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export interface ButtonConfig extends Button {}
