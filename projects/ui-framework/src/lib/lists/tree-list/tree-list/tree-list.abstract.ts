import {
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
  ViewChild,
  Input,
  HostBinding,
  SimpleChanges,
  OnChanges,
  Directive,
} from '@angular/core';
import { SearchComponent } from '../../../search/search/search.component';
import {
  cloneDeepSimpleObject,
  objectHasTruthyValue,
  isBoolean,
  arrayDifference,
  isEmptyArray,
  notFirstChanges,
  applyChanges,
  hasChanges,
  isNotEmptyArray,
} from '../../../services/utils/functional-utils';
import { DOMhelpers } from '../../../services/html/dom-helpers.service';
import { SelectType } from '../../list.enum';
import { ListFooterActionsState } from '../../list.interface';
import { itemID, TreeListItemMap, TreeListItem } from '../tree-list.interface';
import { TreeListInputOutput } from '../tree-list-IO.abstract';
import { TreeListViewService } from '../services/tree-list-view.service';
import { TreeListModelService } from '../services/tree-list-model.service';
import { TreeListControlsService } from '../services/tree-list-controls.service';
import { LIST_ACTIONS_STATE_DEF } from '../../list-footer/list-footer.const';
import { BTL_KEYMAP_DEF, BTL_ROOT_ID } from '../tree-list.const';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseTreeListElement extends TreeListInputOutput
  implements OnChanges, AfterViewInit, OnDestroy {
  constructor(
    protected modelSrvc: TreeListModelService,
    protected cntrlsSrvc: TreeListControlsService,
    protected viewSrvc: TreeListViewService,
    protected DOM: DOMhelpers,
    protected cd: ChangeDetectorRef,
    protected zone: NgZone,
    protected host: ElementRef
  ) {
    super();
  }

  @ViewChild('search', { read: SearchComponent })
  protected search: SearchComponent;
  @ViewChild('listElement', { static: true, read: ElementRef })
  protected listElement: ElementRef;
  @ViewChild('footer', { read: ElementRef })
  protected footer: ElementRef;

  @HostBinding('attr.data-embedded') @Input() embedded = false;
  @HostBinding('hidden') @Input() hidden = true;
  @HostBinding('attr.data-debug') @Input() debug = false;

  public itemsMap: TreeListItemMap = new Map();
  protected itemsMapFromAbove = false;
  public searchValue = '';
  protected minSearchLength = 1;
  public showSearch = false;
  public hasFooter = true;
  public listActionsState: ListFooterActionsState = cloneDeepSimpleObject(
    LIST_ACTIONS_STATE_DEF
  );
  public listViewModel: itemID[] = [];
  readonly selectType = SelectType;

  protected onNgChanges(changes: SimpleChanges): void {}

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('---------------\nTree LIST ngOnChanges', changes);

    console.time('ngOnChanges');

    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
      },
      ['list', 'value', 'itemsMap'],
      false,
      {
        keyMap: { list: 'setList', value: 'setValue', itemsMap: 'setItemsMap' },
      }
    );

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
      hasChanges(changes, ['valueDefault'], true) ||
      hasChanges(changes, ['value'])
    ) {
      this.updateActionButtonsState();
    }

    if (hasChanges(changes, ['maxHeightItems', 'list', 'itemsMap'], true)) {
      this.maxHeightItems = Math.max(
        this.itemsMap.size > 0
          ? this.itemsMap.get(BTL_ROOT_ID).groupsCount + 3
          : 0,
        this.maxHeightItems
      );

      this.DOM.setCssProps(this.host.nativeElement, {
        '--list-max-items': this.maxHeightItems,
      });
    }

    if (notFirstChanges(changes, ['listActions'])) {
      this.hasFooter = !this.readonly && objectHasTruthyValue(this.listActions);
    }

    console.timeEnd('ngOnChanges');

    console.time('ngOnChanges detectChanges');
    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    console.timeEnd('ngOnChanges detectChanges');

    console.log('Tree LIST ngOnChanges END\n---------------');
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

        if (this.focusOnInit && this.search) {
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

  public onListClick(event: MouseEvent): void {
    this.cntrlsSrvc.onListClick(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      toggleItemSelect: this.toggleItemSelect.bind(this),
      itemClick: this.itemClick.bind(this),
      readonly: this.readonly,
      disabled: this.disabled,
    });
  }

  public onListKeyDown(event: KeyboardEvent) {
    this.cntrlsSrvc.onListKeyDown(event, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
      toggleItemCollapsed: this.toggleItemCollapsed.bind(this),
      toggleItemSelect: this.toggleItemSelect.bind(this),
      readonly: this.readonly,
      disabled: this.disabled,
    });
  }

  protected itemClick(item: TreeListItem, element: HTMLElement): void {
    if (
      item.childrenCount &&
      !item.allOptionsHidden &&
      this.type !== SelectType.single
    ) {
      this.toggleItemCollapsed(item, element);
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
    this.modelSrvc.toggleCollapseAllItemsInMap(this.itemsMap, force);
    if (updateModel) {
      this.updateListViewModel();
    }
  }

  public searchChange(value: string) {
    const newSearchValue = value.length > this.minSearchLength ? value : '';

    if (newSearchValue !== this.searchValue) {
      this.searchValue = newSearchValue;

      this.viewFilter = this.searchValue
        ? this.modelSrvc.getSearchViewFilter(this.searchValue)
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

  public showCheckbox(): boolean {
    return this.type === SelectType.multi && !this.readonly && !this.disabled;
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

  protected toggleItemSelect(
    item: TreeListItem,
    force: boolean = null,
    set: Partial<TreeListItem> = {}
  ): void {}

  // Dev / Debug

  log(what = 'Data') {
    switch (what) {
      case 'Data':
        console.log('---------CMPNT---------\n', this);
        console.log('---------LIST---------\n', this.list);
        console.log('---------MAP---------\n', this.itemsMap);
        console.log('---------VIEWMODEL---------\n', this.listViewModel);
        break;

      case 'ValuesMap':
        console.log(
          '------------------\n',
          'IDs to Values map:\n',
          this.modelSrvc.getIDtoValueMap(this.list, this.keyMap)
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

      case 'Value':
        console.log('---------VALUE---------\n', this.value);
        break;
    }
  }
}
