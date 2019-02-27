import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';

export interface QuickFilterConfig {
  selectType: QuickFilterSelectType;
  label: string;
  options: SelectGroupOption[];
  value: (string | number) | (string | number)[];
}

export interface QuickFilterChangeEvent {
  label: string;
  value: (string | number) | (string | number)[];
}

export interface QuickFilterBarChangeEvent {
  [key: string]: (string | number) | (string | number)[];
}
