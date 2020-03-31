import { TreeListItem, TreeListItemMap, itemID } from '../tree-list.interface';
import {
  TreeListItemEditContext,
  InsertItemLocation,
} from '../editable-tree-list/editable-tree-list.interface';
import { BTL_ROOT_ID } from '../tree-list.const';
import {
  simpleUID,
  isNumber,
  arrayRemoveItemsMutate,
} from '../../../services/utils/functional-utils';
import { TreeListModelUtils } from './tree-list-model.static';

export class TreeListEditUtils {
  //
  public static deleteItem(
    item: TreeListItem,
    context: TreeListItemEditContext = null,
    itemsMap: TreeListItemMap,
    listViewModel: itemID[]
  ): TreeListItem {
    const parent =
      context?.parent || itemsMap.get(item.parentIDs[item.parentCount - 1]);

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
      id: simpleUID('etlni-'),
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
        ? itemsMap.get(target.parentIDs[target.parentCount - 1])
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

    console.log(
      `getItemEditContext: parent: ${parent.name}, sibling: ${
        sibling.name || sibling.id || sibling
      }`
    );

    const insertionIndexInParent =
      where === 'after'
        ? targetIndexInParent + 1
        : where === 'lastChildOf'
        ? parent.childrenCount || 0
        : // firstChildOf
          0;

    const targetIndexInViewModel = listViewModel.findIndex(
      (id) => id === target.id
    );

    const insertionIndexInViewModel =
      where === 'after'
        ? this.findViewIndexOfNextSibling(
            target,
            listViewModel,
            itemsMap,
            targetIndexInViewModel + 1
          )
        : where === 'lastChildOf'
        ? (() => {
            const modelLength = listViewModel.length;
            if (target.id === BTL_ROOT_ID || modelLength === 0) {
              return modelLength;
            }
            return this.findViewIndexOfNextSibling(
              target,
              listViewModel,
              itemsMap,
              targetIndexInViewModel + 1
            );
          })()
        : // firstChildOf
          (() => {
            return parent.collapsed
              ? targetIndexInViewModel + 1
              : listViewModel.findIndex((id) => id === parent.childrenIDs[0]);
          })();

    return {
      parent,
      sibling,
      insertionIndexInParent,
      insertionIndexInViewModel,
      targetIndexInParent,
      targetIndexInViewModel,
    };
  }

  public static findViewIndexOfNextSibling(
    item: TreeListItem,
    listViewModel: itemID[],
    itemsMap: TreeListItemMap,
    startIndex = 0
  ): number {
    if (listViewModel.length === startIndex || !item.childrenCount) {
      return startIndex;
    }

    // skips children of target
    let nextSiblingIndex = listViewModel
      .slice(startIndex)
      .findIndex((id: itemID) => !itemsMap.get(id).parentIDs.includes(item.id));
    if (nextSiblingIndex === -1) {
      nextSiblingIndex = item.childrenCount;
    }

    return nextSiblingIndex + startIndex;
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
