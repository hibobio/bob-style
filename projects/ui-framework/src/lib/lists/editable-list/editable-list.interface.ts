import { IconActionsType, ListSortType } from './editable-list.enum';
import { SelectOption } from '../list.interface';

export interface EditableListActions {
  sort?: boolean;
  add?: boolean | string;
  remove?: boolean;
  order?: boolean;
  edit?: boolean;
}

export interface EditableListState {
  delete: string[];
  create: string[];
  sortType: ListSortType;
  order: string[];
  list: SelectOption[];
}

export const ACTIONS_ICONS: Map<keyof EditableListActions, keyof typeof IconActionsType> = new Map([['edit', 'Rename'], ['remove', 'Delete']]) 

