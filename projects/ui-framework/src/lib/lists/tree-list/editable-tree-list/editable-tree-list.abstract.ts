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
import {
  TreeListGetItemEditContext,
  InsertItemLocation,
  EditableTreeListTranslation,
} from './editable-tree-list.interface';
import { EDITABLE_TREELIST_TRANSLATION_DEF } from './editable-tree-list.const';
import { TreeListEditUtils } from '../services/tree-list-edit.static';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { Styles } from '../../../services/html/html-helpers.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseEditableTreeListElement implements OnChanges {
  constructor(
    protected modelSrvc: TreeListModelService,
    protected cntrlsSrvc: TreeListControlsService,
    protected viewSrvc: TreeListViewService,
    protected DOM: DOMhelpers,
    protected cd: ChangeDetectorRef,
    protected host: ElementRef
  ) {}

  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[];
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;
  @Input() maxHeightItems = 8;
  @Input() startCollapsed = true;
  @Input()
  translation: EditableTreeListTranslation = EDITABLE_TREELIST_TRANSLATION_DEF;

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

  public itemMenu: MenuItem<TreeListItem>[] = [
    {
      label: this.translation.add_item,
      key: 'insertNewItem',
      action: (menuItem: MenuItem) => {
        const item = menuItem.data;
        if (item.childrenCount) {
          this.insertNewItem('firstChildOf', item);
        } else {
          this.insertNewItem('after', item);
        }
      },
    },
    {
      label: this.translation.increase_indent,
      key: 'increaseIndent',
      disabled: (menuItem: MenuItem) => {
        const item = menuItem.data;
        if (!item) {
          return true;
        }

        const indexInView =
          this.listViewModel.findIndex(id => id === item.id) || 0;
        if (indexInView === 0) {
          return true;
        }

        const previtemID = this.listViewModel[indexInView - 1];
        return item.parentIDs.includes(previtemID);
      },
      action: (item: MenuItem) => {
        this.increaseIndent(item.data);
      },
    },
    {
      label: this.translation.decrease_indent,
      key: 'decreaseIndent',
      disabled: true,
      action: (menuItem: MenuItem) => {},
    },
    {
      label: this.translation.delete_item,
      key: 'delete',
      disabled: (menuItem: MenuItem) => menuItem.data?.canBeDeleted === false,
      clickToOpenSub: true,
      panelClass: 'betl-del-confirm',
      children: [
        {
          label: this.translation.delete_confirm,
          key: 'deleteConfirm',
          action: (menuItem: MenuItem) => {
            this.deleteItem(menuItem.data);
          },
        },
        {
          label: this.translation.delete_cancel,
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

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
        translation: EDITABLE_TREELIST_TRANSLATION_DEF,
        maxHeightItems: 15,
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

    if (hasChanges(changes, ['maxHeightItems'], true)) {
      this.setListCSS('max-items');
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

  protected listToListViewModel(): itemID[] {
    this.listViewModel = this.modelSrvc.getListViewModel(
      this.list,
      this.itemsMap,
      {
        expand: true,
        keyMap: this.keyMap,
      }
    );

    return this.listViewModel;
  }

  public toggleItemCollapsed(
    item: TreeListItem,
    element: HTMLElement = null,
    force: boolean = null
  ): void {
    TreeListModelUtils.toggleItemCollapsed(item, this.itemsMap, force, true);
    this.cd.detectChanges();
  }

  public onListClick(event: MouseEvent): void {
    this.cntrlsSrvc.onListClick(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      itemClick: () => {},
    });
  }

  public onListKeyDown(event: KeyboardEvent): void {
    this.cntrlsSrvc.onEditableListKeyDown(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      insertNewItem: this.insertNewItem.bind(this),
      deleteItem: this.deleteItem.bind(this),
      increaseIndent: this.increaseIndent.bind(this),
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
    });
  }

  public deleteItem(
    item: TreeListItem,
    context: TreeListGetItemEditContext = null
  ): void {
    TreeListEditUtils.deleteItem(
      item,
      context,
      this.itemsMap,
      this.listViewModel
    );

    this.cd.detectChanges();
    this.emitChange();
  }

  public emitChange(): void {
    this.list = this.listViewModelToList();
    this.changed.emit(this.list);
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

  protected setListCSS(
    styles: Styles | 'width' | 'height' | 'max-items' | 'remove-height'
  ): void {
    const hostEl: HTMLElement = this.host.nativeElement;
    const listEl: HTMLElement = this.listElement.nativeElement;

    if (styles === 'max-items') {
      this.DOM.setCssProps(hostEl, {
        '--list-max-items': this.maxHeightItems,
      });
      return;
    }

    if (styles === 'remove-height' || styles === 'height') {
      this.DOM.setCssProps(hostEl, {
        '--list-min-height': null,
      });
    }

    if (styles === 'height') {
      this.DOM.setCssProps(hostEl, {
        '--list-min-height': listEl.offsetHeight + 'px',
      });
      return;
    }

    if (styles === 'width') {
      this.DOM.setCssProps(hostEl, {
        '--list-min-width': listEl.scrollWidth + 'px',
      });
      return;
    }

    this.DOM.setCssProps(listEl, styles as Styles);
  }

  protected listViewModelToList(
    listViewModel: itemID[] = this.listViewModel
  ): TreeListOption[] {
    return [];
  }

  public insertNewItem(
    where: InsertItemLocation,
    target: TreeListItem
  ): TreeListItem {
    return target;
  }

  public increaseIndent(
    item: TreeListItem,
    indexInView: number = null
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
