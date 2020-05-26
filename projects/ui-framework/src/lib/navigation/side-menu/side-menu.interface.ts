import { Icons } from '../../icons/icons.enum';
import { Avatar } from '../../avatar/avatar/avatar.interface';
import { MenuItem } from '../menu/menu.interface';
import { IconPosition } from '../../typography/label-value/label-value.enum';

export interface SideMenuOptionAvatar extends Avatar {
  textIcon?: Icons;
  textIconTooltip?: string;
  textIconPosition?: IconPosition;
}
export interface SideMenuOption {
  id: number | string;
  displayName?: string;
  icon?: Icons;
  avatar?: SideMenuOptionAvatar;
  actions?: MenuItem[];
  disabled?: boolean;
}
