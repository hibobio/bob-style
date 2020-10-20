import { TooltipClass } from '../popups/tooltip/tooltip.enum';
import { Icons, IconSize, IconColor, IconType, IconRotate } from './icons.enum';

export interface Icon {
  icon: Icons;
  type?: IconType;
  size?: IconSize;
  color?: IconColor;
  rotate?: IconRotate;
  hasHoverState?: boolean;
  toolTipSummary?: string;
  tooltipClass?: TooltipClass | TooltipClass[] | string[];
}
