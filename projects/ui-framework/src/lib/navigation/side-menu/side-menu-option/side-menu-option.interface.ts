import { MenuItem } from '../../menu/menu.interface';
import { Icons } from '../../../icons/icons.enum';

export interface SideMenuOption {
  id: number | string;
  displayName: string;
  icon?: Icons;
  actions?: MenuItem[];
}
