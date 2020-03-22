import { TreeListItem } from '../tree-list.interface';

export interface TreeListGetItemEditContext {
  parent: TreeListItem;
  sibling: TreeListItem;
  insertionIndexInParent: number;
  insertionIndexInViewModel: number;
}
