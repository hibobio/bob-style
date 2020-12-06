import { Icons } from '../../icons/icons.enum';
import { Avatar } from '../../avatar/avatar/avatar.interface';
import { MenuItem } from '../menu/menu.interface';
import { IconPosition } from '../../typography/label-value/label-value.enum';
import { TooltipClass } from '../../popups/tooltip/tooltip.enum';

export interface SideMenuOptionAvatar extends Avatar {
  textIcon?: Icons;
  textIconTooltip?: string;
  tooltipClass?: TooltipClass | TooltipClass[];
  textIconPosition?: IconPosition;
}
export interface SideMenuOption {
  id: number | string;
  displayName?: string;
  icon?: Icons;
  avatar?: SideMenuOptionAvatar;
  actions?: MenuItem[];
  disabled?: boolean;
  iconTooltip?: string;
}
