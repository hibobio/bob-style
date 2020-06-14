import { SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { MenuItem } from '../../navigation/menu/menu.interface';
import { Icons } from '../../icons/icons.enum';
import { Icon } from '../../icons/icon.interface';

export interface MultiSearchKeyMap {
  key?: string;
  groupName?: string;
  options?: string;
  id?: string;
  value?: string;
  label?: string;
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
  icon?: Icons | Icon;
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
  optionClickHandler?: (option: MultiSearchOption) => void;
  menuClickHandler?: (
    option: MultiSearchGroupOption,
    menuItem: MultiSearchOptionMenuItem
  ) => void;
}

export interface MultiSearchClickedEvent {
  group: MultiSearchGroupOption;
  option: MultiSearchOption;
}
