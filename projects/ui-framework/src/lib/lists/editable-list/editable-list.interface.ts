import { ListSortType } from './editable-list.enum';
import { SelectOption } from '../list.interface';

export interface EditableListActions {
  sort?: boolean;
  add?: boolean | string;
  remove?: boolean;
}

export interface EditableListState {
  delete: string[];
  create: string[];
  sortType: ListSortType;
  order: string[];
  list: SelectOption[];
}
