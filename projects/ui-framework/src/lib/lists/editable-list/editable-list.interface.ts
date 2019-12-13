import { ListSortType } from './editable-list.enum';
import { SelectOption } from '../list.interface';

export interface EditableListActions {
  sort?: boolean;
  add?: boolean | string;
  remove?: boolean;
}

export interface EditableListTranslation {
  add: string;
  remove: string;
  done: string;
  cancel: string;
  sortAsc: string;
  sortDesc: string;
  sortCustom: string;
  total: string;
  alreadyExists: string;
}

export interface EditableListState {
  delete: string[];
  create: string[];
  sortType: ListSortType;
  order: string[];
  list: SelectOption[];
}
