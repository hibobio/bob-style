import { Icon } from '../../icons/icon.interface';
import { Icons } from '../../icons/icons.enum';
import { SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { MenuItem } from '../../navigation/menu/menu.interface';

export interface MultiSearchKeyMap {
  key?: string;
  groupName?: string;
  options?: string;
  id?: string;
  value?: string;
  label?: string;
}

export interface MultiSearchMatchResult {
  match?: string;
  exactMatch?: boolean;
  index: [number, number];
  highlightedValue?: string;
  highlightedSearchValue?: string;
  matchLength?: number;
  sortValue?: string;
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
  searchValue?: string | string[];
  searchMatch?: MultiSearchMatchResult;
}

export interface MultiSearchGroupOption
  extends Omit<SelectGroupOption, 'options'> {
  keyMap?: MultiSearchKeyMap;
  key?: string | number; // group ID
  groupName?: string;
  icon?: Icons;
  options?: MultiSearchOption[];
  showItems?: number;
  translation?: {
    showMore?: string;
  };
  menu?: MultiSearchOptionMenuItem[];
  optionClickHandler?: (option: MultiSearchOption) => void;
  menuClickHandler?: (
    option: MultiSearchGroupOption,
    menuItem: MultiSearchOptionMenuItem
  ) => void;
  searchMatchCount?: number;
}

export interface MultiSearchClickedEvent {
  group: MultiSearchGroupOption;
  option: MultiSearchOption;
}
