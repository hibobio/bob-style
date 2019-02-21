import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { QuickFilterSelectType } from './quick-filter.enum';

export interface QuickFilterConfig {
  selectType: QuickFilterSelectType;
  label: string;
  options: SelectGroupOption[];
  value: (string | number) | (string | number)[];
}
