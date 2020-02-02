import { MenuItem } from '../../menu/menu.interface';
import { Icons } from '../../../icons/icons.enum';
import { Avatar } from '../../../avatar/avatar/avatar.interface';

export interface SideMenuOption {
  id: number | string;
  displayName?: string;
  icon?: Icons;
  avatar?: Avatar;
  actions?: MenuItem[];
}
