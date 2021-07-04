import { ListChange } from '../../lists/list-change/list-change';
import { SelectMode } from '../../lists/list.enum';
import { SelectGroupOption } from '../../lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';

export interface QuickFilterConfig {
  key: string;
  selectType?: QuickFilterSelectType;

  selectMode?: SelectMode;
  options?: SelectGroupOption[];
  optionsDefault?: SelectGroupOption[];
  value?: any;
  showSingleGroupHeader?: boolean;
  showNoneOption?: boolean;
  startWithGroupsCollapsed?: boolean;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;

  [k: string]: any;
}

export interface QuickFilterChangeEvent {
  key: string;
  listChange: ListChange;
}

export interface QuickFilterBarChangeEvent {
  [key: string]: QuickFilterChangeEvent;
}
