import { MenuItem } from '../../../overlay/menu/menu.interface';
import { ListComponentPrefix } from '../../../form-elements/lists/list.interface';

export interface SideMenuOption {
  id: string;
  displayName: string;
  prefix?: ListComponentPrefix;
  actions?: MenuItem[];
}
