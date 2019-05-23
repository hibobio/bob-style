import { MenuItem } from '../../menu/menu.interface';
import { ListComponentPrefix } from '../../../form-elements/lists/list.interface';

export interface SideMenuOption {
  id: number;
  displayName: string;
  prefix?: ListComponentPrefix;
  actions?: MenuItem[];
}
