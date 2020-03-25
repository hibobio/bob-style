import { TreeListItem, TreeListItemMap, itemID } from '../tree-list.interface';
import {
  TreeListGetItemEditContext,
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
    context: TreeListGetItemEditContext = null,
    itemsMap: TreeListItemMap,
    listViewModel: itemID[]
  ): TreeListItem {
    const parent =
      context?.parent || itemsMap.get(item.parentIDs[item.parentCount - 1]);

    const deletedItemIDs = TreeListModelUtils.withEachItemOfTreeDown(
      item,
      itm => {
        itemsMap.delete(itm.id);
      },
      itemsMap
    );

    parent.childrenIDs = parent.childrenIDs.filter(id => id !== item.id);
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
  ): TreeListGetItemEditContext {
    if (isNumber(where)) {
      if (where === 0) {
        target = itemsMap.get(BTL_ROOT_ID);
      } else {
        target = itemsMap.get(listViewModel[(where as number) - 1]);
      }

      if (!target.childrenCount) {
        where = 'after';
      }

      if (target.childrenCount) {
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

    const sibling =
      itemsMap.get(parent.childrenIDs && parent.childrenIDs[0]) ||
      ({
        parentIDs: [BTL_ROOT_ID],
        parentCount: 1,
      } as TreeListItem);

    const targetIndexInParent = parent.childrenIDs.findIndex(
      id => id === target.id
    );

    const insertionIndexInParent =
      where === 'after'
        ? targetIndexInParent + 1
        : where === 'lastChildOf'
        ? parent.childrenCount
        : 0;

    const targetIndexInViewModel = listViewModel.findIndex(
      id => id === target.id
    );

    const insertionIndexInViewModel =
      where === 'after'
        ? targetIndexInViewModel + 1
        : where === 'lastChildOf'
        ? function() {
            const modelLength = listViewModel.length;
            if (target.id === BTL_ROOT_ID || modelLength === 0) {
              return modelLength;
            }
            return (
              listViewModel
                .slice(targetIndexInViewModel + 1)
                .findIndex(
                  (id: itemID) =>
                    !itemsMap.get(id).parentIDs.includes(target.id)
                ) +
              targetIndexInViewModel +
              1
            );
          }.bind(this)()
        : listViewModel.findIndex(id => id === parent.childrenIDs[0]);

    if (!target) {
      console.error(`[TreeListEditUtils.getItemEditContext]:
          Something's wrong!`);
      return;
    }

    return {
      parent,
      sibling,
      insertionIndexInParent,
      insertionIndexInViewModel,
      targetIndexInParent,
      targetIndexInViewModel,
    };
  }
}
