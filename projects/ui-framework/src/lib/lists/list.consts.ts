import { UpdateListsConfig } from './list.interface';

export const DISPLAY_SEARCH_OPTION_NUM = 10;
export const LIST_EL_HEIGHT = 44;
export const LIST_MAX_ITEMS = 8;

export const SELECT_MAX_ITEMS = 6;

export const UPDATE_LISTS_CONFIG_DEF: UpdateListsConfig = {
  collapseHeaders: false,
  updateListHeaders: true,
  updateListOptions: true,
  updateListMinHeight: true,
  selectedIDs: null,
  isSearching: false,
};
