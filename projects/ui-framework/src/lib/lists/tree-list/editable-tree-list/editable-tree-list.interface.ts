import {
  TreeListItem,
  TreeListItemMap,
  TreeListOption,
  itemID,
} from '../tree-list.interface';

export interface TreeListItemEditContext {
  parent: TreeListItem;
  sibling: TreeListItem;
  insertionIndexInParent: number;
}

export type InsertItemLocation =
  | 'after'
  | 'firstChildOf'
  | 'lastChildOf'
  | number;

export interface UndoState {
  itemsMap: TreeListItemMap;
  list: TreeListOption[];
  listViewModel: itemID[];
}
