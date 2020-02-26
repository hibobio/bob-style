import { ViewFilter, TreeListKeyMap } from './tree-list.interface';

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
};
