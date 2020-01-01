import { Icons, IconSize, IconColor } from './icons.enum';

export interface Icon {
  icon: Icons;
  size?: IconSize;
  color?: IconColor;
  hasHoverState?: boolean;
}
