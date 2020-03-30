import { TreeListItem } from '../tree-list.interface';

export interface TreeListItemEditContext {
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
