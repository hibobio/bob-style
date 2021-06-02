import { ButtonSize } from '../../buttons/buttons.enum';
import { Button } from '../../buttons/buttons.interface';
import { EditableListActions } from './editable-list.interface';

export const EDITABLE_LIST_ALLOWED_ACTIONS_DEF: EditableListActions = {
  sort: true,
  add: true,
  remove: true,
};

export const EDITABLE_LIST_ITEMS_BEFORE_PAGER = 60;
export const EDITABLE_LIST_SEARCH_MIN_LENGTH = 3;
export const EDITABLE_LIST_PAGER_SLICESIZE = 30;

export const LIST_EDIT_BTN_BASE: Button = {
  size: ButtonSize.small,
  throttle: 150,
  swallow: true,
};
