import { TreeListItem } from '../tree-list.interface';

export interface TreeListGetItemEditContext {
  parent: TreeListItem;
  sibling: TreeListItem;
  insertionIndexInParent: number;
  insertionIndexInViewModel: number;
  targetIndexInParent?: number;
  targetIndexInViewModel?: number;
}

export type InsertItemLocation =
  | 'after'
  | 'firstChildOf'
  | 'lastChildOf'
  | number;

export interface EditableTreeListTranslation {
  add_item: string;
  delete_item: string;
  delete_confirm: string;
  delete_cancel: string;
  increase_indent: string;
  decrease_indent: string;
  untitled: string;
  toggle_collapsed: string;
  collapse_all: string;
  expand_all: string;
}
