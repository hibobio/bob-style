import { EditableListActions } from './editable-list.interface';

export const EDITABLE_LIST_ALLOWED_ACTIONS_DEF: EditableListActions = {
  sort: true,
  add: true,
  remove: true,
};

export const EDITABLE_LIST_ITEMS_BEFORE_PAGER = 60;
export const EDITABLE_LIST_PAGER_SLICESIZE = 30;
