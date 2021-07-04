import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { SearchComponent } from '../../../search/search/search.component';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import {
  applyChanges,
  arrayDifference,
  cloneDeepSimpleObject,
  hasChanges,
  isBoolean,
  isDefined,
  isEmptyArray,
  isNotEmptyArray,
  notFirstChanges,
  objectHasTruthyValue,
} from '../../../services/utils/functional-utils';
import { MobileService } from '../../../services/utils/mobile.service';
import { DOMKeyboardEvent, DOMMouseEvent } from '../../../types';
import { LIST_ACTIONS_STATE_DEF } from '../../list-footer/list-footer.const';
import { LIST_MAX_ITEMS } from '../../list.consts';
import { SelectMode, SelectType } from '../../list.enum';
import { itemID, ListFooterActionsState } from '../../list.interface';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { TreeListModelService } from '../services/tree-list-model.service';
import { TreeListSearchUtils } from '../services/tree-list-search.static';
import { TreeListViewUtils } from '../services/tree-list-view.static';
import { TreeListInputOutput } from '../tree-list-IO.abstract';
import {
  BTL_KEYMAP_DEF,
  BTL_ROOT_ID,
  BTL_VALUE_SEPARATOR_DEF,
} from '../tree-list.const';
import { TreeListItem, TreeListItemMap } from '../tree-list.interface';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseTreeListElement
  extends TreeListInputOutput
  implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
  constructor(
    protected modelSrvc: TreeListModelService,
    protected cntrlsSrvc: TreeListControlsService,
    protected mobileService: MobileService,
    protected DOM: DOMhelpers,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected host: ElementRef
  ) {
    super();
    this.isMobile = this.mobileService.isMobile();
  }

  @ViewChild('search', { read: SearchComponent })
  protected search: SearchComponent;
  @ViewChild('listElement', { static: true, read: ElementRef })
  protected listElement: ElementRef<HTMLElement>;
  @ViewChild('footer', { read: ElementRef })
  protected footer: ElementRef<HTMLElement>;

  @HostBinding('attr.data-embedded') @Input() embedded = false;
  @HostBinding('attr.data-empty') empty = true;

  public itemsMap: TreeListItemMap = new Map();
  protected itemsMapFromAbove = false;
  public searchValue = '';
  protected minSearchLength = 1;
  public showSearch = false;
  public isMobile = false;
  public hasFooter = true;
  public listActionsState: ListFooterActionsState = cloneDeepSimpleObject(
    LIST_ACTIONS_STATE_DEF
  );
  public listViewModel: itemID[] = [];
  readonly selectType = SelectType;

  protected onNgChanges(changes: SimpleChanges): void {}

  public ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
        type: SelectType.multi,
        valueSeparatorChar: BTL_VALUE_SEPARATOR_DEF,
        maxHeightItems: LIST_MAX_ITEMS,
        mode: SelectMode.tree,
      },
      ['list', 'value', 'itemsMap'],
      true,
      {
        keyMap: {
          list: 'setList',
          value: 'setValue',
          itemsMap: 'setItemsMap',
        },
      }
    );

    if (
      this.mode === SelectMode.radioGroups ||
      this.mode === SelectMode.checkGroups
    ) {
      this.mode = SelectMode.tree;
    }

    if (hasChanges(changes, ['keyMap'], true)) {
      this.keyMap = { ...BTL_KEYMAP_DEF, ...this.keyMap };
    }

    this.onNgChanges(changes);

    if (hasChanges(changes, ['valueDefault'], true)) {
      const defaultsExist = isNotEmptyArray(this.valueDefault);
      this.listActions.clear = !defaultsExist;
      this.listActions.reset = defaultsExist;
    }

    if (
      hasChanges(changes, ['value', 'valueDefault'], true, {
        truthyCheck: isDefined,
      })
    ) {
      this.updateActionButtonsState();
    }

    if (hasChanges(changes, ['maxHeightItems', 'list', 'itemsMap'], true)) {
      this.maxHeightItems = Math.max(
        this.itemsMap.size > 1
          ? this.itemsMap.get(BTL_ROOT_ID).groupsCount + 3
          : 0,
        this.maxHeightItems
      );

      this.DOM.setCssProps(this.host.nativeElement, {
        '--list-max-items': this.maxHeightItems || null,
      });
    }

    if (notFirstChanges(changes, ['listActions'], true)) {
      this.hasFooter = !this.readonly && objectHasTruthyValue(this.listActions);
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit() {
    if (!this.itemsMap.size) {
      this.initItemsMap();
    }
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasFooter =
          (!this.readonly && objectHasTruthyValue(this.listActions)) ||
          !(this.footer && this.DOM.isEmpty(this.footer.nativeElement));

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }

        if (this.focusOnInit && this.search && !this.isMobile) {
          this.search.input.nativeElement.focus();
        }
      }, 0);
    });
  }

  ngOnDestroy(): void {
    if (!this.itemsMapFromAbove) {
      this.itemsMap.clear();
    }
  }

  protected initItemsMap(): void {
    this.itemsMap.clear();
    this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
      keyMap: this.keyMap,
      separator: this.valueSeparatorChar,
      collapsed: this.startCollapsed,
    });
  }

  public onListClick(event: Event | MouseEvent): void;
  public onListClick(event: DOMMouseEvent): void {
    this.cntrlsSrvc.onListClick(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      toggleItemSelect: this.toggleItemSelect.bind(this),
      itemClick: this.itemClick.bind(this),
      readonly: this.readonly,
      disabled: this.disabled,
      mode: this.mode,
    });
  }

  public onListKeyDown(event: Event | KeyboardEvent): void;
  public onListKeyDown(event: DOMKeyboardEvent): void {
    this.cntrlsSrvc.onListKeyDown(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      toggleItemSelect: this.toggleItemSelect.bind(this),
      readonly: this.readonly,
      disabled: this.disabled,
      maxHeightItems: this.maxHeightItems,
      mode: this.mode,
    });
  }

  protected itemClick(
    item: TreeListItem,
    itemElement: HTMLElement,
    target: HTMLElement
  ): void {
    if (
      item.childrenCount &&
      !item.allOptionsHidden &&
      this.type !== SelectType.single
    ) {
      this.toggleItemCollapsed(item, itemElement);
      return;
    }
    if (
      !item.childrenCount ||
      item.allOptionsHidden ||
      this.type === SelectType.single
    ) {
      this.toggleItemSelect(item);
    }
  }

  public toggleCollapseAll(force: boolean = null, updateModel = true): void {
    TreeListViewUtils.toggleCollapseAllItemsInMap(this.itemsMap, force);
    if (updateModel) {
      this.updateListViewModel();
    }
  }

  public searchChange(value: string) {
    const newSearchValue =
      value.length > this.minSearchLength ? value.trim() : '';

    if (newSearchValue !== this.searchValue) {
      this.searchValue = newSearchValue;

      this.viewFilter = this.searchValue
        ? TreeListSearchUtils.getSearchViewFilter(this.searchValue)
        : undefined;

      this.updateListViewModel(true);
    }
  }

  public clearList(): void {
    this.applyValue([]);
    this.updateActionButtonsState(true);
    this.cd.detectChanges();
    this.emitChange();
  }

  public resetList(): void {
    this.applyValue(this.valueDefault || []);
    this.updateActionButtonsState(null, true);
    this.cd.detectChanges();
    this.emitChange();
  }

  public onApply(): void {
    if (this.apply.observers.length) {
      this.apply.emit();
    }
    this.listActionsState.apply.disabled = true;
  }

  public onCancel(): void {
    if (this.cancel.observers.length) {
      this.cancel.emit();
    }
  }

  protected updateActionButtonsState(
    forceClearHidden: boolean = null,
    forceResetHidden: boolean = null
  ): void {
    this.listActionsState.clear.hidden = isBoolean(forceClearHidden)
      ? forceClearHidden
      : isEmptyArray(this.value);
    this.listActionsState.reset.hidden = isBoolean(forceResetHidden)
      ? forceResetHidden
      : isEmptyArray(this.value) ||
        isEmptyArray(this.valueDefault) ||
        !arrayDifference(this.value, this.valueDefault).length;
  }

  public showCheckbox(item: TreeListItem): boolean {
    return (
      this.type === SelectType.multi &&
      !this.readonly &&
      !this.disabled &&
      (this.mode !== SelectMode.classic ||
        (this.mode === SelectMode.classic && !item.childrenCount))
    );
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

  // Placeholder methods

  protected updateListViewModel(expand = false): void {}

  protected applyValue(newValue: itemID[]): any {}

  protected emitChange(): void {}

  protected toggleItemCollapsed(
    item: TreeListItem,
    element: HTMLElement
  ): void {}

  protected toggleItemSelect(item: TreeListItem, force: boolean = null): void {}
}
