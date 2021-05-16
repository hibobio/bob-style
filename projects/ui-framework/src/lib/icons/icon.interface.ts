import { TooltipClass } from '../popups/tooltip/tooltip.enum';
import { Color, PxSize } from '../types';
import {
  IconColor,
  IconColors,
  IconRotate,
  Icons,
  IconSize,
  IconSizes,
  IconType,
} from './icons.enum';

export interface Icon {
  icon: Icons;
  type?: IconType;
  size?: IconSize | IconSizes | PxSize | number;
  color?: IconColor | IconColors | Color;
  rotate?: IconRotate;
  hasHoverState?: boolean;
  toolTipSummary?: string;
  tooltipClass?: TooltipClass | TooltipClass[] | string[];
}
