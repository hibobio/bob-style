import { TreeListItem, TreeListItemMap } from '../tree-list.interface';
import {
  TreeListItemEditContext,
  InsertItemLocation,
} from '../editable-tree-list/editable-tree-list.interface';
import { BTL_ROOT_ID } from '../tree-list.const';
import {
  simpleUID,
  isNumber,
  arrayRemoveItemsMutate,
  arrayInsertAt,
} from '../../../services/utils/functional-utils';
import { TreeListModelUtils } from './tree-list-model.static';
import { itemID } from '../../list.interface';

export class TreeListEditUtils {
  //
  public static insertItem(
    item: TreeListItem,
    where: InsertItemLocation,
    target: TreeListItem,
    context: TreeListItemEditContext = null,
    itemsMap: TreeListItemMap,
    listViewModel: itemID[]
  ): TreeListItem {
    const { parent, insertionIndexInParent } =
      context ||
      this.getItemEditContext(where, target, itemsMap, listViewModel);

    parent.childrenIDs = arrayInsertAt(
      parent.childrenIDs,
      item.id,
      insertionIndexInParent
    );

    parent.childrenCount = parent.childrenIDs.length;

    return item;
  }

  public static deleteItem(
    item: TreeListItem,
    context: TreeListItemEditContext = null,
    itemsMap: TreeListItemMap,
    listViewModel: itemID[]
  ): TreeListItem {
    //
    const parent =
      context?.parent || TreeListModelUtils.getParent(item, itemsMap);

    const deletedItemIDs = TreeListModelUtils.walkTree(
      'down',
      item,
      (itm) => itemsMap.delete(itm.id),
      itemsMap
    );

    parent.childrenIDs = parent.childrenIDs.filter((id) => id !== item.id);
    parent.childrenCount = parent.childrenIDs.length;

    arrayRemoveItemsMutate(listViewModel, deletedItemIDs);

    return item;
  }

  public static newItem(set: Partial<TreeListItem> = {}): TreeListItem {
    return {
      id: simpleUID('etlni'),
      name: '',
      value: '',
      parentIDs: [BTL_ROOT_ID],
      parentCount: 1,
      childrenIDs: [],
      newitem: true,
      collapsed: false,
      ...(set || {}),
    };
  }

  public static getItemEditContext(
    where: InsertItemLocation,
    target: TreeListItem,
    itemsMap: TreeListItemMap,
    listViewModel: itemID[]
  ): TreeListItemEditContext {
    if (isNumber(where)) {
      if (where === 0) {
        target = itemsMap.get(BTL_ROOT_ID);
      } else {
        target = itemsMap.get(listViewModel[(where as number) - 1]);
      }

      if (
        !target?.childrenCount ||
        (target.childrenCount && target.collapsed)
      ) {
        where = 'after';
      }

      if (target?.childrenCount && !target.collapsed) {
        where = 'firstChildOf';
      }
    }

    if (!target) {
      console.error(`[TreeListEditUtils.getItemEditContext]:
          Something's wrong!`);
      return;
    }

    const parent =
      where === 'after'
        ? TreeListModelUtils.getParent(target, itemsMap)
        : target;

    const sibling = parent.childrenCount
      ? itemsMap.get(parent.childrenIDs[0])
      : where === 'after'
      ? ({
          parentIDs: [BTL_ROOT_ID],
          parentCount: 1,
        } as TreeListItem)
      : ({
          parentIDs: (parent?.parentIDs || []).concat(parent.id),
          parentCount: (parent.parentCount || 0) + 1,
        } as TreeListItem);

    const targetIndexInParent = parent.childrenIDs.findIndex(
      (id) => id === target.id
    );

    const insertionIndexInParent =
      where === 'after'
        ? targetIndexInParent + 1
        : where === 'lastChildOf'
        ? parent.childrenCount || 0
        : // firstChildOf
          0;

    return {
      parent,
      sibling,
      insertionIndexInParent,
    };
  }

  public static findPossibleParentAmongPrevSiblings(
    item: TreeListItem,
    listViewModel: itemID[],
    itemsMap: TreeListItemMap,
    indexInView: number = null
  ): TreeListItem {
    if (indexInView === null) {
      indexInView = listViewModel.findIndex((id) => id === item.id) || 0;
    }

    if (indexInView === 0) {
      return null;
    }

    let counter = 1;
    let previtemID = listViewModel[indexInView - counter];
    let prevItem = itemsMap.get(previtemID);

    while (
      indexInView - counter > 0 &&
      prevItem.parentCount > item.parentCount
    ) {
      previtemID = listViewModel[indexInView - ++counter];
      prevItem = itemsMap.get(previtemID);
    }

    return !prevItem || item.parentIDs.includes(previtemID) ? null : prevItem;
  }
}
