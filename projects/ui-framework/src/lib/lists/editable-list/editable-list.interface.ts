import { itemID, SelectOption } from '../list.interface';
import { ListActionType } from './editable-list.enum';

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

export interface EditableListStateLocal
  extends Omit<EditableListState, 'list' | 'create'> {
  readonly newItem: SelectOption;
  readonly create: string[];

  list: SelectOption[];
  searchValue: string;
  currentItemIndex: number;
  currentItem: SelectOption;
  currentSlice: [number, number];
  currentAction: ListActionType;

  ready: boolean;
  size: number;
}

export interface EditableListViewItem {
  data?: SelectOption;
  index?: number;
  highlightedValue?: string;
}
