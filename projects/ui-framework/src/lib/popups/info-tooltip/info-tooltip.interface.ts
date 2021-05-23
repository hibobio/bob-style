import { Icons, IconSize } from '../../../lib/icons/icons.enum';
import { Link } from '../../../lib/indicators/link/link.types';

export interface InfoTooltip {
  title?: string;
  text: string;
  link?: Link;
  icon?: Icons;
  iconSize?: IconSize;
  linkClicked?: () => any;
}
