import { itemID, SelectOption } from '../list.interface';

export interface EditableListActions {
  sort?: boolean;
  add?: boolean | string;
  remove?: boolean;
  order?: boolean;
  edit?: boolean;
}

export interface EditableListState {
  list: SelectOption[];
  create?: string[];
  delete?: string[];
  deletedIDs?: itemID[];
}

export interface EditableListStateLocal extends EditableListState {
  newItem: SelectOption;
  size: number;
}
