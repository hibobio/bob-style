import { Icons, IconSize } from '../../../lib/icons/icons.enum';
import { Link } from '../../../lib/indicators/link/link.types';


export interface InfoTooltip {
  text: string;
  link?: Link;
  title?: string;
  icon?: Icons;
  iconSize?: IconSize;
  linkClicked?: Function;
}
