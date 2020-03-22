// vscode-fold=1

//#region
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import {
  applyChanges,
  hasChanges,
  arrayInsertAt,
  simpleUID,
} from '../../../services/utils/functional-utils';
import {
  TreeListOption,
  TreeListKeyMap,
  TreeListItemMap,
  itemID,
  TreeListItem,
  ViewFilter,
} from '../tree-list.interface';
import { BTL_KEYMAP_DEF, BTL_ROOT_ID } from '../tree-list.const';
import { TreeListModelService } from '../services/tree-list-model.service';
import { MenuItem } from '../../../navigation/menu/menu.interface';
import {
  Icons,
  IconType,
  IconSize,
  IconColor,
} from '../../../icons/icons.enum';
import { TreeListModelUtils } from '../services/tree-list-model.static';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { InsertItemLocation } from './editable-tree-list.enum';
import { simpleChange } from '../../../services/utils/test-helpers';
import { TreeListViewService } from '../services/tree-list-view.service';
//#endregion

@Component({
  selector: 'b-editable-tree-list',
  templateUrl: './editable-tree-list.component.html',
  styleUrls: ['./editable-tree-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableTreeListComponent implements OnChanges {
  constructor(
    private modelSrvc: TreeListModelService,
    private cntrlsSrvc: TreeListControlsService,
    private viewSrvc: TreeListViewService,
    private cd: ChangeDetectorRef
  ) {}

  //#region
  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[];
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() debug = false;

  @ViewChild('listElement', { static: true, read: ElementRef })
  protected listElement: ElementRef;

  public itemsMap: TreeListItemMap = new Map();
  public listViewModel: itemID[] = [];
  private viewFilter: ViewFilter = {
    hide: { prop: { key: 'deleted', value: true } },
  };

  public itemMenu: MenuItem<TreeListItem>[] = [
    {
      label: 'Add item',
      key: 'insertNewItem',
      action: (item: MenuItem) => {
        if (item.data.childrenCount) {
          this.insertNewItem('firstChildOf', item.data);
        } else {
          this.insertNewItem('after', item.data);
        }
      },
    },
    {
      label: 'Delete',
      key: 'delete',
      disabled: (item: MenuItem) => item.data?.canBeDeleted === false,
      clickToOpenSub: true,
      panelClass: 'betl-del-confirm',
      children: [
        {
          label: 'Yes, delete',
          key: 'deleteConfirm',
          action: (item: MenuItem) => {
            this.deleteItem(item.data);
          },
        },
        {
          label: `No, don't delete`,
          key: 'deleteCancel',
        },
      ],
    },
  ];
  public rootItem: TreeListItem;

  readonly icons = Icons;
  readonly iconType = IconType;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  //#endregion

  public ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
      },
      ['list'],
      false,
      {
        keyMap: { list: 'setList' },
      }
    );

    if (hasChanges(changes, ['keyMap'], true)) {
      this.keyMap = { ...BTL_KEYMAP_DEF, ...this.keyMap };
    }

    if (hasChanges(changes, ['list'], true)) {
      this.list = changes.list.currentValue || [];

      this.itemsMap.clear();
      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
      });
      this.rootItem = this.itemsMap.get(BTL_ROOT_ID);

      this.listToListViewModel();
    }
  }

  private listToListViewModel(): void {
    this.listViewModel = this.modelSrvc.getListViewModel(
      this.list,
      this.itemsMap,
      {
        viewFilter: this.viewFilter,
        expand: true,
        keyMap: this.keyMap,
      }
    );
  }

  //#region
  private emitChange(): void {}

  public toggleItemCollapsed(item: TreeListItem, element: HTMLElement): void {}

  public onListClick(event: MouseEvent): void {}

  public onListKeyDown(event: KeyboardEvent) {
    this.cntrlsSrvc.onEditableListKeyDown(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      insertNewItem: this.insertNewItem.bind(this),
      deleteItem: this.deleteItem.bind(this),
    });
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }
  //#endregion

  // -------------------

  // -------------------

  public insertItem(
    item: TreeListItem,
    where: InsertItemLocation,
    target: TreeListItem,
    context = null
  ): TreeListItem {
    const { parent, insertionIndexInParent, insertionIndexInViewModel } =
      context || this.getItemContext(where, target);

    parent.childrenIDs = arrayInsertAt(
      parent.childrenIDs,
      item.id,
      insertionIndexInParent
    );

    parent.childrenCount = TreeListModelUtils.filteredChildrenCount(
      parent,
      this.itemsMap,
      this.viewFilter
    );

    this.listViewModel = arrayInsertAt(
      this.listViewModel,
      item.id,
      insertionIndexInViewModel
    );

    this.cd.detectChanges();

    this.viewSrvc.findAndFocusInput(
      this.listElement.nativeElement.children[insertionIndexInViewModel],
      'start'
    );

    return item;
  }

  public deleteItem(item: TreeListItem, context = null): TreeListItem {
    const parent =
      context?.parent ||
      this.itemsMap.get(item.parentIDs[item.parentCount - 1]);

    TreeListModelUtils.setPropToTreeDown(
      item,
      { deleted: true },
      this.itemsMap
    );

    parent.childrenCount = TreeListModelUtils.filteredChildrenCount(
      parent,
      this.itemsMap,
      this.viewFilter
    );

    this.listViewModel = this.listViewModel.filter(
      id => !this.itemsMap.get(id).deleted
    );

    return item;
  }

  public insertNewItem(
    where: InsertItemLocation,
    target: TreeListItem
  ): TreeListItem {
    const context = this.getItemContext(where, target);

    const newItem = this.newItem(
      context.sibling && {
        parentIDs: context.sibling.parentIDs.slice(),
        parentCount: context.sibling.parentCount,
      }
    );

    TreeListModelUtils.updateMap(this.itemsMap, newItem.id, newItem);

    this.insertItem(newItem, where, target, context);

    return newItem;
  }

  public moveItem(
    item: TreeListItem,
    where: InsertItemLocation,
    target: TreeListItem
  ): TreeListItem {
    const context = this.getItemContext(where, target);

    return item;
  }

  private newItem(set: Partial<TreeListItem> = {}): TreeListItem {
    return {
      id: simpleUID('etlni-'),
      name: '',
      value: '',
      parentIDs: [BTL_ROOT_ID],
      parentCount: 1,
      childrenIDs: null,
      newitem: true,
      collapsed: false,
      ...(set || {}),
    };
  }

  private getItemContext(
    where: InsertItemLocation,
    target: TreeListItem
  ): {
    parent: TreeListItem;
    sibling: TreeListItem;
    insertionIndexInParent: number;
    insertionIndexInViewModel: number;
  } {
    const parent =
      where === 'after'
        ? this.itemsMap.get(target.parentIDs[target.parentCount - 1])
        : target;

    const sibling =
      this.itemsMap.get(parent.childrenIDs && parent.childrenIDs[0]) ||
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

    const targetIndexInViewModel = this.listViewModel.findIndex(
      id => id === target.id
    );

    const insertionIndexInViewModel =
      where === 'after'
        ? targetIndexInViewModel + 1
        : where === 'lastChildOf'
        ? function() {
            const modelLength = this.listViewModel.length;
            if (target.id === BTL_ROOT_ID || modelLength === 0) {
              return modelLength;
            }
            return (
              this.listViewModel
                .slice(targetIndexInViewModel + 1)
                .findIndex(
                  (id: itemID) =>
                    !this.itemsMap.get(id).parentIDs.includes(target.id)
                ) +
              targetIndexInViewModel +
              1
            );
          }.bind(this)()
        : this.listViewModel.findIndex(id => id === parent.childrenIDs[0]);

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

  // Dev / Debug

  clear() {
    this.ngOnChanges(
      simpleChange({
        setList: [],
      })
    );
  }

  log(what = 'Data') {
    switch (what) {
      case 'Data':
        console.log('---------CMPNT---------\n', this);
        console.log('---------LIST---------\n', this.list);
        console.log('---------MAP---------\n', this.itemsMap);
        console.log('---------VIEWMODEL---------\n', this.listViewModel);
        break;

      case 'ViewContext':
        console.log(
          '------------------\n',
          'Items view context:\n',
          this.listViewModel.map(id => {
            const item = this.itemsMap.get(id);
            return {
              id: item.id,
              collapsed: item.collapsed,
              parentCount: item.parentCount,
              childrenCount: item.childrenCount,
              groupsCount: item.groupsCount,
              selectedCount: item.selectedCount,
              allOptionsHidden: item.allOptionsHidden,
              nextInViewIsGroup: item.nextInViewIsGroup,
            };
          })
        );
        break;
    }
  }
}
