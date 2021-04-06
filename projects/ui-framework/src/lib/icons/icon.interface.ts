import { TooltipClass } from '../popups/tooltip/tooltip.enum';
import { Color } from '../types';
import { IconColor, IconRotate, Icons, IconSize, IconType } from './icons.enum';

export interface Icon {
  icon: Icons;
  type?: IconType;
  size?: IconSize | string | number;
  color?: IconColor | Color;
  rotate?: IconRotate;
  hasHoverState?: boolean;
  toolTipSummary?: string;
  tooltipClass?: TooltipClass | TooltipClass[] | string[];
}
