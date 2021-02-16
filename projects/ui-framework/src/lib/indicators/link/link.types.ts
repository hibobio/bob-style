import { Color } from '../../types';
import { LinkColor, LinkTarget } from './link.enum';

export interface Link {
  text: string;
  url?: string;
  color?: LinkColor | Color;
  target?: LinkTarget;
  clickHandler?: (...args: any[]) => void;
  [key: string]: any;
}
