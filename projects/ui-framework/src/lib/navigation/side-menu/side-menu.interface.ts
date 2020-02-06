import { Icons } from '../../icons/icons.enum';
import { Avatar } from '../../avatar/avatar/avatar.interface';
import { MenuItem } from '../menu/menu.interface';

export interface SideMenuOption {
  id: number | string;
  displayName?: string;
  icon?: Icons;
  avatar?: Avatar;
  actions?: MenuItem[];
  disabled?: boolean;
}
