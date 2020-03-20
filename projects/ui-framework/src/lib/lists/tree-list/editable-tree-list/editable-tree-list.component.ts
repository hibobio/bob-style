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
import { BehaviorSubject } from 'rxjs';
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
    private cd: ChangeDetectorRef
  ) {}

  //#region
  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[];
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

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
      key: 'insertItem',
      action: (item: MenuItem) => {
        if (item.data.childrenCount) {
          this.insertItem('firstChildOf', item.data);
        } else {
          this.insertItem('after', item.data);
        }
      },
    },
    {
      label: 'Delete',
      key: 'delete',
      disabled: (item: MenuItem) =>
        item.data && item.data.canBeDeleted === false,
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

  public $listViewModel: BehaviorSubject<itemID[]> = new BehaviorSubject<
    itemID[]
  >([]);

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

    this.$listViewModel.next(this.listViewModel);
  }

  private updateListViewModel(): void {
    this.listViewModel = this.listViewModel.filter(
      id => !this.itemsMap.get(id).deleted
    );
  }

  //#region
  private emitChange(): void {}

  public toggleItemCollapsed(item: TreeListItem, element: HTMLElement): void {}

  public onListClick(event: MouseEvent): void {}

  public onListKeyDown(event: KeyboardEvent) {}

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }
  //#endregion

  // ---------MENU----------

  public insertItem(
    where: 'after' | 'firstChildOf' | 'lastChildOf',
    item: TreeListItem
  ): void {
    const parent =
      where === 'after'
        ? this.itemsMap.get(item.parentIDs[item.parentCount - 1])
        : item;

    const sibling = this.itemsMap.get(
      parent.childrenIDs.find(id => !this.itemsMap.get(id).childrenCount)
    );

    const insertionIndexInParent =
      where === 'after'
        ? parent.childrenIDs.findIndex(id => id === item.id) + 1
        : where === 'lastChildOf'
        ? parent.childrenCount
        : 0;

    const insertionIndexInViewModel =
      where === 'after'
        ? this.listViewModel.findIndex(id => id === item.id) + 1
        : where === 'lastChildOf'
        ? this.listViewModel.findIndex(
            id =>
              id === parent.childrenIDs[Math.max(0, parent.childrenCount - 1)]
          ) + 1
        : this.listViewModel.findIndex(id => id === parent.childrenIDs[0]);

    console.log('parent', parent.id, 'sibling', sibling.id);
    console.log(
      'insertionIndexInParent',
      insertionIndexInParent,
      'insertionIndexInViewModel',
      insertionIndexInViewModel
    );

    const newItemID = simpleUID('etlni-');
    const newItem = {
      id: newItemID,
      name: '',
      value: '',
      parentIDs: sibling.parentIDs.slice(),
      parentCount: sibling.parentCount,
      childrenIDs: null,
      newitem: true,
      collapsed: false,
    };

    TreeListModelUtils.updateMap(this.itemsMap, newItemID, newItem);

    parent.childrenIDs = arrayInsertAt(
      parent.childrenIDs,
      newItemID,
      insertionIndexInParent
    );

    this.listViewModel = arrayInsertAt(
      this.listViewModel,
      newItemID,
      insertionIndexInViewModel
    );

    this.cd.detectChanges();

    this.$listViewModel.next(this.listViewModel);

    const itemInput = this.listElement.nativeElement.children[
      insertionIndexInViewModel
    ].querySelector('.betl-item-input');

    itemInput.focus();

    // this.updateListViewModel();
  }

  public deleteItem(item: TreeListItem): void {
    TreeListModelUtils.setPropToTreeDown(
      item,
      { deleted: true },
      this.itemsMap
    );

    // this.updateListViewModel();
    this.listViewModel = this.listViewModel.filter(
      id => !this.itemsMap.get(id).deleted
    );
  }

  // Dev / Debug

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
