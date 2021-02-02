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
  AfterViewInit,
  HostListener,
} from '@angular/core';
import {
  applyChanges,
  hasChanges,
  notFirstChanges,
  isValuevy,
  isKey,
  eventHasCntrlKey,
  getEventPath,
  compareAsStrings,
  simpleChange,
} from '../../../services/utils/functional-utils';
import { BTL_KEYMAP_DEF, BTL_ROOT_ID } from '../tree-list.const';
import {
  TreeListOption,
  TreeListKeyMap,
  TreeListItemMap,
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
import { cloneDeep } from 'lodash';
import { DOMInputEvent } from '../../../types';
import { TreeListModelUtils } from '../services/tree-list-model.static';
import { SelectMode } from '../../list.enum';
import { TranslateService } from '@ngx-translate/core';
import { itemID } from '../../list.interface';
import { InputAutoCompleteOptions } from '../../../form-elements/input/input.enum';

const LISTITEM_EL_HEIGHT = 32;

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseEditableTreeListElement
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  constructor(
    protected modelSrvc: TreeListModelService,
    protected cntrlsSrvc: TreeListControlsService,
    protected DOM: DOMhelpers,
    protected utilsService: UtilsService,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected host: ElementRef,
    protected translate: TranslateService
  ) {
    this.hostElement = this.host.nativeElement;
  }

  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[] = [];
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;
  @Input() maxHeightItems = 15;
  @Input() startCollapsed = true;
  @Input() focusOnInit = false;

  @HostBinding('attr.data-embedded') @Input() embedded = false;
  @HostBinding('attr.data-dnd-disabled') @Input() disableDragAndDrop = false;

  @Output() changed: EventEmitter<TreeListOption[]> = new EventEmitter<
    TreeListOption[]
  >();

  @ViewChild('listElement', { static: true, read: ElementRef })
  set setListEl(elem: ElementRef) {
    this.listElement = elem.nativeElement;
  }
  protected listElement: HTMLElement;
  protected hostElement: HTMLElement;

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
  protected cancelFocus = false;
  protected hasChanges = false;
  protected expandedWhileDragging: Set<TreeListItem> = new Set();
  private windowKeydownSubscriber: Subscription;

  readonly icons = Icons;
  readonly iconType = IconType;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly autoComplete = InputAutoCompleteOptions;

  protected savestate: UndoState;
  protected listBackup: TreeListOption[];

  @HostListener('click', ['$event']) onHostClick(event: MouseEvent) {
    if (this.cancelFocus) {
      this.cancelFocus = false;
      return;
    }

    const listLength = this.listViewModel?.length || 0;
    const listHeight = this.listElement?.offsetHeight || 0;
    const listScrollTop = this.listElement?.scrollTop || 0;

    this.focus(
      event.target !== this.hostElement || listLength < 2
        ? 'first'
        : event.offsetY > listHeight
        ? 'last'
        : Math.max(
            Math.round(
              event.offsetY / LISTITEM_EL_HEIGHT +
                listScrollTop / LISTITEM_EL_HEIGHT
            ) - 1,
            0
          )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
        maxHeightItems: 15,
      },
      ['list'],
      true,
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
      this.DOM.setCssProps(this.host?.nativeElement, {
        '--list-min-width': null,
        '--list-min-height': null,
      });

      this.list = changes.list.currentValue || [];

      this.initItemsMap();
    }

    if (
      hasChanges(changes, ['list', 'startCollapsed'], true, {
        truthyCheck: isValuevy,
      })
    ) {
      this.toggleCollapseAll(this.startCollapsed, false);
    }

    if (
      notFirstChanges(changes, null, true, {
        truthyCheck: isValuevy,
      }) &&
      !this.cd['destroyed']
    ) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.itemMenu = this.getMenuItems();

    if (!this.itemsMap.size) {
      this.initItemsMap();
    }

    this.windowKeydownSubscriber = this.utilsService
      .getWindowKeydownEvent(true)
      .pipe(
        filter(
          (event: KeyboardEvent) =>
            event.key === 'z' &&
            eventHasCntrlKey(event) &&
            getEventPath(event).includes(this.hostElement)
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

  ngAfterViewInit(): void {
    if (this.focusOnInit) {
      this.focus();
    }
  }

  ngOnDestroy(): void {
    this.windowKeydownSubscriber?.unsubscribe();
  }

  private initItemsMap(): void {
    this.itemsMap.clear();

    this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
      keyMap: this.keyMap,
      collapsed: this.startCollapsed,
    });
    this.rootItem = this.itemsMap.get(BTL_ROOT_ID);
  }

  protected updateListViewModel(expand = false): void {
    this.listViewModel = this.modelSrvc.itemsMapToListViewModel(
      this.itemsMap,
      expand
    );
  }

  public emitChange(keepChanges = false): void {
    if (!this.hasChanges) {
      return;
    }
    this.list = this.modelSrvc.itemsMapToOptionList(this.itemsMap, this.keyMap);
    this.changed.emit(this.list);

    this.hasChanges = keepChanges;
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
    this.cancelFocus = false;
    this.cntrlsSrvc.onListClick(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      itemClick: this.onItemClick.bind(this),
      mode: SelectMode.tree,
    });
  }

  public onItemClick(
    item: TreeListItem,
    itemElement: HTMLElement,
    clickTarget: HTMLElement
  ): void {
    if (!clickTarget.matches('.betl-item-input')) {
      TreeListViewUtils.findAndFocusInput(itemElement, 'end');
    }
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
      this.listElement.querySelector(`[data-id="${item.id}"]`),
      'end'
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
    this.hasChanges = true;
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
      list: this.list?.slice() || [],
      listViewModel: this.listViewModel?.slice() || [],
    };
  }

  protected undo(): void {
    if (this.savestate) {
      Object.assign(this, this.savestate);
      this.savestate = undefined;
      this.rootItem = this.itemsMap.get(BTL_ROOT_ID);
      this.cd.detectChanges();
      this.hasChanges = true;
      this.emitChange();
    }
  }

  protected finishDrag(): void {
    window.clearTimeout(this.dragHoverTimer);
    this.dragRef = this.draggingIndex = this.dragHoverIndex = undefined;
    this.expandedWhileDragging.clear();
  }

  public onListInput(event: DOMInputEvent): void {
    this.hasChanges = true;
    this.isTyping = true;
  }

  public onListBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;

    if (target.matches('.betl-item-input')) {
      this.isTyping = false;

      const { item } = TreeListViewUtils.getItemFromElement(
        target,
        this.itemsMap,
        this.listViewModel
      );

      if (!item) {
        return;
      }
      if (this.hasChanges) {
        item.name = target.value.trim();
      }
      if (this.hasChanges && item.name) {
        if (this.countItemDuplicatesInGroup(item) > 1) {
          item.name = '';
        } else {
          this.emitChange();
        }
      }
      if (!item.name) {
        if (!item.childrenCount && this.listViewModel.length > 1) {
          this.deleteItem(item);
        }
        this.cancelFocus = true;

        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.cancelFocus = false;
          }, 100);
        });
      }
    }
  }

  protected countItemDuplicatesInGroup(item: TreeListItem): number {
    return (
      (item.name &&
        TreeListModelUtils.getAllSiblingsIDs(item, this.itemsMap).filter((id) =>
          compareAsStrings(item.name, this.itemsMap.get(id).name, false)
        ).length) ||
      0
    );
  }

  public focus(whichInput: 'first' | 'last' | number = 'first'): void {
    if (this.itemsMap?.size > 1) {
      TreeListViewUtils.findAndFocusInput(this.listElement, 'end', whichInput);
    } else if (this.rootItem) {
      this.insertNewItem('lastChildOf', this.rootItem);
    }
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

  protected setListCSS(
    styles: Styles | 'width' | 'height' | 'max-items' | 'remove-height'
  ): void {
    if (styles === 'max-items') {
      this.DOM.setCssProps(this.hostElement, {
        '--list-max-items': this.maxHeightItems || null,
      });
      return;
    }

    if (styles === 'remove-height' || styles === 'height') {
      this.DOM.setCssProps(this.hostElement, {
        '--list-min-height': null,
      });
    }

    if (styles === 'height') {
      this.DOM.setCssProps(this.hostElement, {
        '--list-min-height': this.listElement.offsetHeight + 'px',
      });
      return;
    }

    if (styles === 'width') {
      this.DOM.setCssProps(this.hostElement, {
        '--list-min-width': null,
      });
      this.DOM.setCssProps(this.hostElement, {
        '--list-min-width': this.listElement.scrollWidth + 'px',
      });
      return;
    }

    this.DOM.setCssProps(this.listElement, styles as Styles);
  }

  public insertNewItem(where: InsertItemLocation, target: TreeListItem): void {}

  public increaseIndent(item: TreeListItem, indexInView: number = null): void {}

  public decreaseIndent(item: TreeListItem): void {}

  protected getMenuItems(): MenuItem<TreeListItem>[] {
    return [
      {
        label: this.translate.instant(
          'tree-list-editor.shortcuts.toggle-collapsed'
        ),
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
        label: this.translate.instant('tree-list-editor.shortcuts.expand-all'),
        key: 'expandAll',
        action: () => this.toggleCollapseAll(false),
      },
      {
        label: this.translate.instant(
          'tree-list-editor.shortcuts.collapse-all'
        ),
        key: 'collapseAll',
        separatorAfter: true,
        action: () => this.toggleCollapseAll(true),
      },
      {
        label: this.translate.instant(
          'tree-list-editor.shortcuts.increase-indent'
        ),
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
        label: this.translate.instant(
          'tree-list-editor.shortcuts.decrease-indent'
        ),
        key: 'decreaseIndent',
        separatorAfter: true,
        disabled: (menuItem: MenuItem) => menuItem.data.parentCount < 2,
        action: (menuItem: MenuItem) => this.decreaseIndent(menuItem.data),
      },
      {
        label: this.translate.instant('tree-list-editor.shortcuts.add-item'),
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
        label: this.translate.instant('tree-list-editor.shortcuts.delete-item'),
        key: 'delete',
        disabled: (menuItem: MenuItem) => menuItem.data?.canBeDeleted === false,
        clickToOpenSub: true,
        panelClass: 'betl-del-confirm',
        children: [
          {
            label: this.translate.instant(
              'tree-list-editor.shortcuts.delete-confirm'
            ),
            key: 'deleteConfirm',
            action: (menuItem: MenuItem) => this.deleteItem(menuItem.data),
          },
          {
            label: this.translate.instant(
              'tree-list-editor.shortcuts.delete-cancel'
            ),
            key: 'deleteCancel',
          },
        ],
      },
    ];
  }
}
