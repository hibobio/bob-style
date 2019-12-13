import { IconColor, Icons } from '../icons/icons.enum';
import { ButtonType } from './buttons.enum';

export interface ButtonConfig {
  type: ButtonType;
  icon: Icons;
  color: IconColor;
}
