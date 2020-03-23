import {
  TreeListItem,
  TreeListItemMap,
  itemID,
  ViewFilter,
} from '../tree-list.interface';
import { InsertItemLocation } from '../editable-tree-list/editable-tree-list.enum';
import { TreeListGetItemEditContext } from '../editable-tree-list/editable-tree-list.interface';
import { BTL_ROOT_ID } from '../tree-list.const';
import {
  simpleUID,
  arrayInsertAt,
} from '../../../services/utils/functional-utils';
import { TreeListModelUtils } from './tree-list-model.static';

export class TreeListEditUtils {
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
    const parent =
      where === 'after'
        ? itemsMap.get(target.parentIDs[target.parentCount - 1])
        : target;

    const sibling =
      itemsMap.get(
        parent.childrenIDs && parent.childrenIDs[0]
        // parent.childrenID.find(id => !itemsMap.get(id)?.deleted)
      ) ||
      ({
        parentIDs: [BTL_ROOT_ID],
        parentCount: 1,
      } as TreeListItem);

    const insertionIndexInParent =
      where === 'after'
        ? parent.childrenIDs.findIndex(id => id === target.id) + 1
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

    if (!parent || !sibling) {
      console.error(`Something's wrong!`);
      return;
    }

    return {
      parent,
      sibling,
      insertionIndexInParent,
      insertionIndexInViewModel,
    };
  }
}
