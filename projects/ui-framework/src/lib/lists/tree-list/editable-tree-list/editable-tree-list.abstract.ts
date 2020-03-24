import {
  Directive,
  OnChanges,
  SimpleChanges,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  applyChanges,
  hasChanges,
  isValuevy,
  notFirstChanges,
} from '../../../services/utils/functional-utils';
import { BTL_KEYMAP_DEF, BTL_ROOT_ID } from '../tree-list.const';
import { TreeListModelUtils } from '../services/tree-list-model.static';
import {
  TreeListOption,
  TreeListKeyMap,
  TreeListItemMap,
  itemID,
  ViewFilter,
  TreeListItem,
} from '../tree-list.interface';
import { MenuItem } from '../../../navigation/menu/menu.interface';
import {
  Icons,
  IconType,
  IconSize,
  IconColor,
} from '../../../icons/icons.enum';
import { TreeListModelService } from '../services/tree-list-model.service';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { TreeListViewService } from '../services/tree-list-view.service';
import { simpleChange } from '../../../services/utils/test-helpers';
import { InsertItemLocation } from './editable-tree-list.enum';
import { TreeListGetItemEditContext } from './editable-tree-list.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseEditableTreeListElement implements OnChanges {
  constructor(
    protected modelSrvc: TreeListModelService,
    protected cntrlsSrvc: TreeListControlsService,
    protected viewSrvc: TreeListViewService,
    protected cd: ChangeDetectorRef
  ) {}

  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[];
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() startCollapsed = true;
  @HostBinding('attr.data-embedded') @Input() embedded = false;
  @HostBinding('attr.data-debug') @Input() debug = false;
  @HostBinding('attr.data-dnd-disabled') disableDragAndDrop = false;

  @HostBinding('attr.data-menu-loc') @Input() menuLoc = 1;
  @HostBinding('attr.data-menu-hover') @Input() menuHov = 1;

  @Output() changed: EventEmitter<TreeListOption[]> = new EventEmitter<
    TreeListOption[]
  >();

  @ViewChild('listElement', { static: true, read: ElementRef })
  protected listElement: ElementRef;

  public itemsMap: TreeListItemMap = new Map();
  public listViewModel: itemID[] = [];
  public viewFilter: ViewFilter = {
    hide: {
      prop: { key: 'deleted', value: true },
    },
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
        collapsed: false,
      });
      this.rootItem = this.itemsMap.get(BTL_ROOT_ID);
    }

    if (
      hasChanges(changes, ['list', 'startCollapsed'], true, {
        falseyCheck: isValuevy,
      })
    ) {
      this.listToListViewModel();

      TreeListModelUtils.toggleCollapseAllItemsInMap(
        this.itemsMap,
        this.startCollapsed,
        true
      );
    }

    if (
      notFirstChanges(changes, null, true, {
        falseyCheck: isValuevy,
      }) &&
      !this.cd['destroyed']
    ) {
      this.cd.detectChanges();
    }
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

  protected listToListViewModel(): itemID[] {
    return [];
  }

  public insertNewItem(
    where: InsertItemLocation,
    target: TreeListItem
  ): TreeListItem {
    return target;
  }

  public deleteItem(
    item: TreeListItem,
    context: TreeListGetItemEditContext = null
  ): TreeListItem {
    return item;
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

      case 'New':
        console.log(
          '------------------\n',
          'New items:\n',
          Array.from(this.itemsMap.values()).filter(item => item.newitem)
        );
        break;

      case 'Deleted':
        console.log(
          '------------------\n',
          'Deleted items:\n',
          Array.from(this.itemsMap.values()).filter(item => item.deleted)
        );
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
