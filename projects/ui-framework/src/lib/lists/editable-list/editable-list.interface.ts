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

  newItem?: SelectOption;
  create?: string[];
  delete?: string[];
  deletedIDs?: itemID[];
}
