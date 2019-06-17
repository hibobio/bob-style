import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';
import { ListChange } from '../../form-elements/lists/list-change/list-change';

export interface QuickFilterConfig {
  selectType: QuickFilterSelectType;
  label: string;
  placeholder?: string;
  key: string;
  options: SelectGroupOption[];
}

export interface QuickFilterChangeEvent {
  key: string;
  listChange: ListChange;
}

export interface QuickFilterBarChangeEvent {
  [key: string]: QuickFilterChangeEvent;
}
