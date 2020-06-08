import { SelectGroupOption, SelectOption } from '../../lists/list.interface';
import { MenuItem } from '../../navigation/menu/menu.interface';

export interface MultiSearchOption extends SelectOption {}

export interface MultiSearchOptionMenuItem extends MenuItem<MultiSearchOption> {
  key: string;
  id: string;
  data: MultiSearchOption;
  action?: never;
}

export interface MultiSearchGroupOption extends SelectGroupOption {
  key: string | number;
  options: MultiSearchOption[];
  translation: {
    showMore: string;
  };
  menu?: MultiSearchOptionMenuItem[];
  menuHandler?: any;
}
