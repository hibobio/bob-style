import { SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { MenuItem } from '../../navigation/menu/menu.interface';
import { Icons } from '../../icons/icons.enum';

export interface MultiSearchKeyMap {
  key?: string;
  groupName?: string;
  options?: string;
  id?: string;
  value?: string;
}

export interface MultiSearchOptionMenuItem extends MenuItem<MultiSearchOption> {
  id: string; // menu ID
  key: string; // menu item ID
  data?: MultiSearchOption;
  action?: never;
}

export interface MultiSearchOption extends Partial<SelectOption> {
  id?: string | number;
  value?: string;
  label?: string;
  icon?: Icons;
  menu?: MultiSearchOptionMenuItem[];
}

export interface MultiSearchGroupOption
  extends Omit<SelectGroupOption, 'options'> {
  keyMap?: MultiSearchKeyMap;
  key?: string | number; // group ID
  groupName?: string;
  icon?: Icons;
  options?: MultiSearchOption[];
  translation?: {
    showMore?: string;
  };
  menu?: MultiSearchOptionMenuItem[];
  clickHandler?: (option: MultiSearchGroupOption) => void;
  menuHandler?: (
    option: MultiSearchGroupOption,
    menuItem: MultiSearchOptionMenuItem
  ) => void;
}
