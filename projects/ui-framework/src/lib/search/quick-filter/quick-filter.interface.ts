import { SelectGroupOption } from '../../lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import { ListChange } from '../../lists/list-change/list-change';
import { SelectMode } from '../../lists/list.enum';

export interface QuickFilterConfig {
  key: string;
  selectType?: QuickFilterSelectType;
  selectMode?: SelectMode;
  options?: SelectGroupOption[];
  value?: any;
  showSingleGroupHeader?: boolean;
  showNoneOption?: boolean;
  startWithGroupsCollapsed?: boolean;
  label?: string;
  placeholder?: string;
  [k: string]: any;
}

export interface QuickFilterChangeEvent {
  key: string;
  listChange: ListChange;
}

export interface QuickFilterBarChangeEvent {
  [key: string]: QuickFilterChangeEvent;
}
