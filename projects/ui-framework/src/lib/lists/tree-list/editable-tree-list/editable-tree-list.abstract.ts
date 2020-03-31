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
  OnInit,
} from '@angular/core';
import {
  applyChanges,
  hasChanges,
  notFirstChanges,
  isValuevy,
  isKey,
  simpleArrayAddItemUnique,
} from '../../../services/utils/functional-utils';
import {
  BTL_KEYMAP_DEF,
  BTL_ROOT_ID,
  EDITABLE_TREELIST_TRANSLATION_DEF,
} from '../tree-list.const';
import {
  TreeListOption,
  TreeListKeyMap,
  TreeListItemMap,
  itemID,
  TreeListItem,
  EditableTreeListTranslation,
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
import { simpleChange } from '../../../services/utils/test-helpers';
import {
  TreeListItemEditContext,
  InsertItemLocation,
} from './editable-tree-list.interface';
import { TreeListEditUtils } from '../services/tree-list-edit.static';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { Styles } from '../../../services/html/html-helpers.interface';
import { TreeListViewUtils } from '../services/tree-list-view.static';
import { DragRef } from '@angular/cdk/drag-drop';
import { Keys } from '../../../enums';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseEditableTreeListElement implements OnChanges, OnInit {
  constructor(
    protected modelSrvc: TreeListModelService,
    protected cntrlsSrvc: TreeListControlsService,
    protected DOM: DOMhelpers,
    protected cd: ChangeDetectorRef,
    protected host: ElementRef
  ) {}

  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[];
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;
  @Input() maxHeightItems = 15;
  @Input() startCollapsed = true;
  @Input()
  translation: EditableTreeListTranslation = EDITABLE_TREELIST_TRANSLATION_DEF;

  @HostBinding('attr.data-embedded') @Input() embedded = false;
  @HostBinding('attr.data-debug') @Input() debug = false;
  @HostBinding('attr.data-dnd-disabled') disableDragAndDrop = false;

  @HostBinding('attr.data-menu-loc') @Input() menuLoc = 3;
  @HostBinding('attr.data-menu-hover') @Input() menuHov = 1;

  @Output() changed: EventEmitter<TreeListOption[]> = new EventEmitter<
    TreeListOption[]
  >();

  @ViewChild('listElement', { static: true, read: ElementRef })
  protected listElement: ElementRef;

  public itemsMap: TreeListItemMap = new Map();
  public listViewModel: itemID[] = [];

  public itemMenu: MenuItem<TreeListItem>[];
  public rootItem: TreeListItem;

  public maxDepth = 10;
  public draggingIndex: number;
  public dragHoverIndex: number;
  protected dragHoverTimer;
  protected dragRef: DragRef<any>;
  protected cancelDrop = false;
  protected expandedWhileDragging: Set<TreeListItem> = new Set();

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

    if (hasChanges(changes, ['translation'], true)) {
      this.setTranslation();
    }

    if (hasChanges(changes, ['keyMap'], true)) {
      this.keyMap = { ...BTL_KEYMAP_DEF, ...this.keyMap };
    }

    if (hasChanges(changes, ['maxHeightItems'], true)) {
      this.setListCSS('max-items');
    }

    if (hasChanges(changes, ['list'], true)) {
      this.DOM.setCssProps(this.host?.nativeElement, {
        '--list-min-width': null,
        '--list-min-height': null,
      });

      this.list = changes.list.currentValue || [];

      this.itemsMap.clear();
      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
        collapsed: this.startCollapsed,
      });
      this.rootItem = this.itemsMap.get(BTL_ROOT_ID);
    }

    if (
      hasChanges(changes, ['list', 'startCollapsed'], true, {
        falseyCheck: isValuevy,
      })
    ) {
      this.listViewModel = this.itemsMapToListViewModel();
      this.toggleCollapseAll(this.startCollapsed);
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

  ngOnInit(): void {
    if (!this.itemMenu) {
      this.setTranslation();
    }
  }

  protected itemsMapToListViewModel(
    itemsMap: TreeListItemMap = this.itemsMap,
    expand = false
  ): itemID[] {
    const reducer = (list: itemID[], id: itemID): itemID[] => {
      const item = this.itemsMap.get(id);

      if (!item) {
        return list;
      }

      // list.push(item.id);
      list = simpleArrayAddItemUnique(list, id);

      if (item.childrenCount && item.collapsed && !expand) {
        return list;
      }

      if (item.childrenCount) {
        item.collapsed = false;
        return item.childrenIDs.reduce(reducer, list);
      }

      return list;
    };

    return itemsMap.get(BTL_ROOT_ID)?.childrenIDs?.reduce(reducer, []) || [];
  }

  protected itemsMapToOptionList(
    itemsMap: TreeListItemMap = this.itemsMap
  ): TreeListOption[] {
    const reducer = (list: TreeListOption[], id: itemID): TreeListOption[] => {
      const item = this.itemsMap.get(id);

      if (!item || (!item.childrenCount && !item.name.trim())) {
        return list;
      }

      const itemOut: TreeListOption = {
        [this.keyMap.id]: item.id,
        [this.keyMap.name]: item.name.trim() || 'Untitled',
      };

      if (item.childrenCount) {
        itemOut[this.keyMap.children] = item.childrenIDs.reduce(reducer, []);
      }

      list.push(itemOut);

      return list;
    };

    return itemsMap.get(BTL_ROOT_ID)?.childrenIDs?.reduce(reducer, []) || [];
  }

  public toggleItemCollapsed(
    item: TreeListItem,
    element: HTMLElement = null,
    force: boolean = null
  ): void {
    if (item.id === BTL_ROOT_ID) {
      return;
    }
    TreeListViewUtils.toggleItemCollapsed(item, force);
    this.listViewModel = this.itemsMapToListViewModel();
    this.cd.detectChanges();
  }

  public toggleCollapseAll(force: boolean = null): void {
    TreeListViewUtils.toggleCollapseAllItemsInMap(this.itemsMap, force);
    this.listViewModel = this.itemsMapToListViewModel();
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
      decreaseIndent: this.decreaseIndent.bind(this),
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
    });

    if (this.dragRef && isKey(event.key, Keys.escape)) {
      event.stopPropagation();
      this.cancelDrop = true;
      document.dispatchEvent(new Event('mouseup'));
      // this.expandedWhileDragging.forEach((item) => {
      //   this.toggleItemCollapsed(item, null, true);
      // });
      this.expandedWhileDragging.clear();
    }
  }

  public emitChange(): void {
    this.list = this.itemsMapToOptionList();
    this.changed.emit(this.list);
  }

  public getDragState(index: number) {
    return this.draggingIndex === index
      ? 'dragged'
      : (this.draggingIndex < index && this.dragHoverIndex === index) ||
        (this.draggingIndex > index + 1 && this.dragHoverIndex === index + 1)
      ? 'drag-hover-below'
      : this.draggingIndex > index &&
        this.dragHoverIndex === index &&
        index === 0
      ? 'drag-hover-above'
      : null;
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
        '--list-min-width': null,
      });
      this.DOM.setCssProps(hostEl, {
        '--list-min-width': listEl.scrollWidth + 'px',
      });
      return;
    }

    this.DOM.setCssProps(listEl, styles as Styles);
  }

  public insertNewItem(where: InsertItemLocation, target: TreeListItem): void {}

  public deleteItem(
    item: TreeListItem,
    context: TreeListItemEditContext = null
  ): void {}

  public increaseIndent(item: TreeListItem, indexInView: number = null): void {}

  public decreaseIndent(item: TreeListItem): void {}

  private setTranslation(): void {
    this.itemMenu = [
      {
        label: this.translation.toggle_collapsed,
        key: 'toggleCollapsed',
        disabled: (menuItem: MenuItem<TreeListItem>) =>
          !menuItem.data?.childrenCount,
        action: (menuItem: MenuItem) => {
          if (menuItem.data.childrenCount) {
            this.toggleItemCollapsed(menuItem.data);
          }
        },
      },
      {
        label: this.translation.expand_all,
        key: 'expandAll',
        action: () => this.toggleCollapseAll(false),
      },
      {
        label: this.translation.collapse_all,
        key: 'collapseAll',
        separatorAfter: true,
        action: () => this.toggleCollapseAll(true),
      },
      {
        label: this.translation.increase_indent,
        key: 'increaseIndent',
        disabled: (menuItem: MenuItem) =>
          !TreeListEditUtils.findPossibleParentAmongPrevSiblings(
            menuItem.data,
            this.listViewModel,
            this.itemsMap
          ),
        action: (menuItem: MenuItem) => this.increaseIndent(menuItem.data),
      },
      {
        label: this.translation.decrease_indent,
        key: 'decreaseIndent',
        separatorAfter: true,
        disabled: (menuItem: MenuItem) => menuItem.data.parentCount < 2,
        action: (menuItem: MenuItem) => this.decreaseIndent(menuItem.data),
      },
      {
        label: this.translation.add_item,
        key: 'insertNewItem',
        action: (menuItem: MenuItem) => {
          if (menuItem.data.childrenCount) {
            this.insertNewItem('firstChildOf', menuItem.data);
          } else {
            this.insertNewItem('after', menuItem.data);
          }
        },
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
            action: (menuItem: MenuItem) => this.deleteItem(menuItem.data),
          },
          {
            label: this.translation.delete_cancel,
            key: 'deleteCancel',
          },
        ],
      },
    ];
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
          Array.from(this.itemsMap.values()).filter((item) => item.newitem)
        );
        break;

      case 'Deleted':
        console.log(
          '------------------\n',
          'Deleted items:\n',
          Array.from(this.itemsMap.values()).filter((item) => item.deleted)
        );
        break;

      case 'ViewContext':
        console.log(
          '------------------\n',
          'Items view context:\n',
          this.listViewModel.map((id) => {
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
