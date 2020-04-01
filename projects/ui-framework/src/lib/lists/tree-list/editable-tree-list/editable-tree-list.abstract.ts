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
  NgZone,
  OnDestroy,
} from '@angular/core';
import {
  applyChanges,
  hasChanges,
  notFirstChanges,
  isValuevy,
  isKey,
  eventHasCntrlKey,
  getEventPath,
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
  UndoState,
} from './editable-tree-list.interface';
import { TreeListEditUtils } from '../services/tree-list-edit.static';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { Styles } from '../../../services/html/html-helpers.interface';
import { TreeListViewUtils } from '../services/tree-list-view.static';
import { DragRef } from '@angular/cdk/drag-drop';
import { Keys } from '../../../enums';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../services/utils/utils.service';
import { outsideZone } from '../../../services/utils/rxjs.operators';
import { filter, delay } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';
import { DOMInputEvent } from '../../../types';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseEditableTreeListElement
  implements OnChanges, OnInit, OnDestroy {
  constructor(
    protected modelSrvc: TreeListModelService,
    protected cntrlsSrvc: TreeListControlsService,
    protected DOM: DOMhelpers,
    protected utilsService: UtilsService,
    protected zone: NgZone,
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
  @HostBinding('attr.data-dnd-disabled') @Input() disableDragAndDrop = false;

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
  protected isTyping = false;
  protected dragHoverTimer;
  protected dragRef: DragRef<any>;
  protected cancelDrop = false;
  protected expandedWhileDragging: Set<TreeListItem> = new Set();
  private windowKeydownSubscriber: Subscription;

  readonly icons = Icons;
  readonly iconType = IconType;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  protected savestate: UndoState;

  protected listBackup: TreeListOption[];

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

      this.itemsMap.clear();
      this.list = changes.list.currentValue || [];

      if (this.debug && !changes.skipBackup?.currentValue) {
        this.listBackup = cloneDeep(this.list);
      }

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
      this.toggleCollapseAll(this.startCollapsed, false);
    }

    if (
      notFirstChanges(changes, null, true, {
        falseyCheck: isValuevy,
      }) &&
      !this.cd['destroyed']
    ) {
      this.cd.detectChanges();

      if (this.debug) {
        this.emitChange();
      }
    }
  }

  ngOnInit(): void {
    if (!this.itemMenu) {
      this.setTranslation();
    }

    this.windowKeydownSubscriber = this.utilsService
      .getWindowKeydownEvent()
      .pipe(
        outsideZone(this.zone),
        filter(
          (event: KeyboardEvent) =>
            event.key === 'z' &&
            eventHasCntrlKey(event) &&
            getEventPath(event).includes(this.host.nativeElement)
        ),
        delay(0)
      )
      .subscribe((event: KeyboardEvent) => {
        if (this.isTyping) {
          this.isTyping = false;
        } else {
          event.preventDefault();
          event.stopPropagation();

          this.zone.run(() => {
            this.undo();
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.windowKeydownSubscriber?.unsubscribe();
  }

  protected updateListViewModel(expand = false): void {
    this.listViewModel = this.modelSrvc.itemsMapToListViewModel(
      this.itemsMap,
      expand
    );
  }

  public emitChange(): void {
    this.list = this.modelSrvc.itemsMapToOptionList(this.itemsMap, this.keyMap);
    this.changed.emit(this.list);
  }

  public toggleItemCollapsed(
    item: TreeListItem,
    element: HTMLElement = null,
    force: boolean = null,
    detectChanges = true
  ): void {
    if (item.id === BTL_ROOT_ID) {
      return;
    }
    TreeListViewUtils.toggleItemCollapsed(item, force);
    this.updateListViewModel();

    if (detectChanges && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public toggleCollapseAll(force: boolean = null, detectChanges = true): void {
    TreeListViewUtils.toggleCollapseAllItemsInMap(this.itemsMap, force);
    this.updateListViewModel();

    if (detectChanges && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
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

      this.expandedWhileDragging.forEach((item) => {
        this.toggleItemCollapsed(item, null, true);
      });

      this.finishDrag();
    }
  }

  public insertItem(
    item: TreeListItem,
    where: InsertItemLocation,
    target: TreeListItem,
    context: TreeListItemEditContext = null
  ): void {
    TreeListEditUtils.insertItem(
      item,
      where,
      target,
      context,
      this.itemsMap,
      this.listViewModel
    );

    this.updateListViewModel();
    this.cd.detectChanges();

    TreeListViewUtils.findAndFocusInput(
      this.listElement.nativeElement.querySelector(`[data-id="${item.id}"]`),
      'start'
    );

    this.isTyping = false;
    this.setListCSS('width');
  }

  public deleteItem(
    item: TreeListItem,
    context: TreeListItemEditContext = null
  ): void {
    //
    this.saveUndoState();

    TreeListEditUtils.deleteItem(
      item,
      context,
      this.itemsMap,
      this.listViewModel
    );

    this.cd.detectChanges();
    this.emitChange();
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

  protected saveUndoState(): void {
    this.savestate = {
      itemsMap: cloneDeep(this.itemsMap),
      list: this.list.slice(),
      listViewModel: this.listViewModel.slice(),
    };
  }

  protected undo(): void {
    if (this.savestate) {
      Object.assign(this, this.savestate);
      this.savestate = undefined;
      this.rootItem = this.itemsMap.get(BTL_ROOT_ID);
      this.cd.detectChanges();
    }
  }

  protected finishDrag(): void {
    window.clearTimeout(this.dragHoverTimer);
    this.dragRef = this.draggingIndex = this.dragHoverIndex = undefined;
    this.expandedWhileDragging.clear();
  }

  public onListInput(event: DOMInputEvent): void {
    this.isTyping = true;
  }

  public onListBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;

    if (target.matches('.betl-item-input')) {
      this.isTyping = false;

      if (target.value.trim()) {
        this.emitChange();
      } else {
        const { item } = TreeListViewUtils.getItemFromElement(
          target,
          this.itemsMap,
          this.listViewModel
        );
        if (item && !item.childrenCount) {
          this.deleteItem(item);
        }
      }
    }
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
        skipBackup: true,
      })
    );
  }

  reset() {
    this.ngOnChanges(
      simpleChange({
        setList: this.listBackup,
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
