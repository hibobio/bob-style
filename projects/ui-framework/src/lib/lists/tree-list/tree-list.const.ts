import {
  ViewFilter,
  TreeListKeyMap,
  EditableTreeListTranslation,
} from './tree-list.interface';

export const BTL_ROOT_ID = '#root';

export const BTL_VIEWFILTER_DEF: ViewFilter = {
  show: {
    searchBy: 'name',
  },
  hide: {
    searchBy: 'value',
  },
};

export const BTL_KEYMAP_DEF: TreeListKeyMap = {
  id: 'id',
  name: 'name',
  children: 'children',
};

export const BTL_KEYMAP_SERVER: TreeListKeyMap = {
  id: 'serverId',
  name: 'value',
  children: 'children',
};

export const BTL_VALUE_SEPARATOR_DEF = ' / ';

export const EDITABLE_TREELIST_TRANSLATION_DEF: EditableTreeListTranslation = {
  toggle_collapsed: 'Expand/Collapse',
  collapse_all: 'Collapse all',
  expand_all: 'Expand all',
  add_item: 'Add item',
  delete_item: 'Delete',
  delete_confirm: 'Yes, delete',
  delete_cancel: `No, don't delete`,
  increase_indent: 'Increase indent',
  decrease_indent: 'Decrease indent',
  untitled: 'Untitled',
};
