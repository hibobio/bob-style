import { IconColor, Icons } from '../../icons/icons.enum';
import { Link } from '../link/link.types';
import { InfoStripIconSize, InfoStripIconType } from './info-strip.enum';

export interface InfoStripIcon {
  icon: Icons;
  color: IconColor;
}

export interface InfoStrip {
  text: string;
  iconType?: InfoStripIconType;
  iconSize?: InfoStripIconSize;
  link?: Link;
  linkClicked?: () => void;
}
