import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  TreeListItemMap,
  itemID,
  TreeListItem,
  ViewFilter,
  TreeListValue,
  TreeListOption,
  TreeListComponentIO,
  TreeListItemViewContext,
  TreeListKeyMap,
} from './tree-list.interface';
import { TreeListModelService } from './services/tree-list-model.service';
import { SelectType } from '../list.enum';
import { ListFooterActions, ListFooterActionsState } from '../list.interface';
import {
  objectHasTruthyValue,
  hasChanges,
  cloneDeepSimpleObject,
  applyChanges,
  joinArrays,
  notFirstChanges,
  firstChanges,
  arrayDifference,
  isNotEmptyArray,
  stringify,
} from '../../services/utils/functional-utils';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { LIST_ACTIONS_STATE_DEF } from '../list-footer/list-footer.const';
import { TreeListControlsService } from './services/tree-list-controls.service';
import { SearchComponent } from '../../search/search/search.component';
import { BTL_ROOT_ID, BTL_KEYMAP_DEF } from './tree-list.const';
import { selectValueOrFail } from '../../services/utils/transformers';
import { TreeListViewService } from './services/tree-list-view.service';

@Component({
  selector: 'b-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListComponent
  implements TreeListComponentIO, OnChanges, OnInit, AfterViewInit, OnDestroy {
  constructor(
    private modelSrvc: TreeListModelService,
    private cntrlsSrvc: TreeListControlsService,
    private viewSrvc: TreeListViewService,
    private DOM: DOMhelpers,
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private host: ElementRef
  ) {}

  @ViewChild('search', { static: false, read: SearchComponent })
  private search: SearchComponent;
  @ViewChild('listElement', { static: true, read: ElementRef })
  private listElement: ElementRef;
  @ViewChildren('itemElements') private itemElements: QueryList<ElementRef>;
  @ViewChild('footer', { static: false, read: ElementRef })
  private footer: ElementRef;

  @Input('list') set setList(list: TreeListOption[]) {}
  public list: TreeListOption[];

  @Input('value') set setValue(value: itemID[]) {}
  public value: itemID[];
  @Input() valueDefault: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() type: SelectType = SelectType.multi;
  @Input() valueSeparatorChar = ' / ';
  @Input() maxHeightItems = 8;
  @Input() showSingleGroupHeader = true;
  @Input() startCollapsed = true;
  @Input() focusOnInit = false;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() listActions: ListFooterActions = {
    apply: false,
    cancel: false,
    clear: false,
    reset: false,
  };
  @HostBinding('attr.data-embedded') @Input() embedded = false;
  @HostBinding('hidden') @Input() hidden = true;
  @HostBinding('attr.data-debug') @Input() debug = false;

  @Output() changed: EventEmitter<TreeListValue> = new EventEmitter<
    TreeListValue
  >();
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  public searchValue = '';
  private minSearchLength = 1;
  public showSearch = false;
  public hasFooter = true;
  public listActionsState: ListFooterActionsState = cloneDeepSimpleObject(
    LIST_ACTIONS_STATE_DEF
  );
  public itemsMap: TreeListItemMap = new Map();
  public listViewModel: itemID[] = [];
  readonly selectType = SelectType;

  ngOnChanges(changes: SimpleChanges): void {
    console.time('ngOnChanges');
    let viewModelWasUpdated = false;

    applyChanges(
      this,
      changes,
      {
        keyMap: BTL_KEYMAP_DEF,
      },
      ['list', 'value'],
      false,
      { list: 'setList', value: 'setValue' }
    );

    if (hasChanges(changes, ['keyMap'], true)) {
      this.keyMap = { ...BTL_KEYMAP_DEF, ...this.keyMap };
    }

    if (
      hasChanges(changes, ['showSingleGroupHeader']) &&
      isNotEmptyArray(this.list, 1)
    ) {
    }

    if (
      (hasChanges(changes, ['list'], true) &&
        changes.list.currentValue !== this.list) ||
      hasChanges(changes, ['showSingleGroupHeader'])
    ) {
      if (changes.list) {
        this.list = changes.list.currentValue;
        this.hidden = !this.list.length;
      }

      if (
        !this.showSingleGroupHeader &&
        this.list.length === 1 &&
        this.list[0][this.keyMap.children]
      ) {
        this.list = this.list[0][this.keyMap.children];
      }

      console.time('getListItemsMap');
      this.itemsMap.clear();
      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
        separator: this.valueSeparatorChar,
        collapsed: this.startCollapsed,
      });
      console.timeEnd('getListItemsMap');

      this.showSearch = this.itemsMap.size > 10;
    }

    if (hasChanges(changes, ['list'], true) || hasChanges(changes, ['value'])) {
      if (firstChanges(changes, ['list'])) {
        this.updateListViewModel();
        viewModelWasUpdated = true;
      }

      viewModelWasUpdated =
        this.applyValue(
          changes.value ? changes.value.currentValue : this.value
        ) || viewModelWasUpdated;
    }

    if (
      notFirstChanges(changes, ['startCollapsed']) &&
      typeof this.startCollapsed === 'boolean'
    ) {
      this.toggleCollapseAll(this.startCollapsed, false);
    }

    if (hasChanges(changes, ['valueDefault'], true)) {
      const defaultsExist = isNotEmptyArray(this.valueDefault);
      this.listActions.clear = !defaultsExist;
      this.listActions.reset = defaultsExist;
    }

    if (
      hasChanges(changes, ['list', 'valueDefault'], true) ||
      hasChanges(changes, ['showSingleGroupHeader', 'value'])
    ) {
      this.updateActionButtonsState();
    }

    if (
      !viewModelWasUpdated &&
      (hasChanges(changes, ['list', 'viewFilter'], true) ||
        hasChanges(changes, [
          'value',
          'startCollapsed',
          'showSingleGroupHeader',
        ]))
    ) {
      this.updateListViewModel();
    }

    if (hasChanges(changes, ['maxHeightItems', 'list'], true)) {
      this.DOM.setCssProps(this.host.nativeElement, {
        '--list-max-items': Math.max(
          this.itemsMap.size > 0
            ? this.itemsMap.get(BTL_ROOT_ID).groupsCount + 3
            : 0,
          this.maxHeightItems
        ),
      });
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    console.timeEnd('ngOnChanges');
  }

  ngOnInit() {
    console.log('ngOnInit');
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
    this.itemsMap.clear();
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

  private updateListViewModel(expand = false): void {
    console.time('updateListViewModel');
    this.listViewModel.length = 0;

    this.listViewModel.push(
      ...this.modelSrvc.getListViewModel(this.list, this.itemsMap, {
        viewFilter: this.viewFilter,
        expand,
        keyMap: this.keyMap,
      })
    );

    console.log('===> updateListViewModel', this.listViewModel);

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    console.timeEnd('updateListViewModel');
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

  public toggleCollapseAll(force = null, updateModel = true): void {
    for (const item of this.itemsMap.values()) {
      if (item.childrenCount && item.id !== BTL_ROOT_ID) {
        item.collapsed = force !== null ? force : !item.collapsed;
      }
    }
    if (updateModel) {
      this.updateListViewModel();
    }
  }

  private itemClick(item: TreeListItem, element: HTMLElement): void {
    if (item.childrenCount && !item.allOptionsHidden) {
      this.toggleItemCollapsed(item, element);
    } else {
      this.toggleItemSelect(item);
    }
  }

  private toggleItemCollapsed(item: TreeListItem, element: HTMLElement): void {
    let elOffset: number;

    if (!item.collapsed) {
      elOffset = element.offsetTop;
    }

    item.collapsed = !item.collapsed;

    if (item.collapsed) {
      this.cd.detectChanges();
      this.listElement.nativeElement.scrollTop =
        this.listElement.nativeElement.scrollTop -
        (elOffset - element.offsetTop);
    }

    this.updateListViewModel();
  }

  private toggleItemSelect(item: TreeListItem): void {
    item.selected = !item.selected;

    for (const groupID of item.parentIDs) {
      const parent = this.itemsMap.get(groupID);
      parent.selectedCount = parent.selectedCount + (item.selected ? 1 : -1);

      parent.selected = parent.selectedCount === parent.childrenCount;

      parent.indeterminate = !parent.selected && !!parent.selectedCount;
    }

    this.updateActionButtonsState();
    this.cd.detectChanges();
    this.emitChange();
  }

  public clearList(): void {
    this.applyValue(null);
    this.updateActionButtonsState(true);
    this.cd.detectChanges();
    this.emitChange();
  }

  public resetList(): void {
    this.applyValue(this.valueDefault);
    this.listActionsState.apply.disabled = false;
    this.emitChange();
  }

  public onApply(): void {
    if (this.apply.observers.length > 0) {
      this.apply.emit();
    }
  }

  public onCancel(): void {
    if (this.cancel.observers.length > 0) {
      this.cancel.emit();
    }
  }

  // returns true if listViewModel was updated
  private applyValue(newValue: itemID[]): boolean {
    console.time('applyValue');
    let affectedIDs: itemID[] = this.value || [];
    this.value = selectValueOrFail(newValue);
    let viewModelWasUpdated = false;
    console.log('<=== applyValue:', this.value);

    if (!this.itemsMap.size) {
      return viewModelWasUpdated;
    }
    affectedIDs = joinArrays(affectedIDs, this.value || []);

    let firstSelectedID: itemID;

    affectedIDs.forEach(id => {
      const item = this.itemsMap.get(id);

      if (!item) {
        console.error(
          `[TreeListComponent.applyValue]:
          No item data for ID: "${stringify(id)}". Removing ID from value.`
        );
        this.value = this.value.filter(valId => valId !== id);
        return;
      }

      item.selected = !!newValue && this.value.includes(item.id);
      if (!firstSelectedID && item.selected) {
        firstSelectedID = item.id;
      }
    });

    if (firstSelectedID) {
      const item = this.itemsMap.get(firstSelectedID);

      this.viewSrvc.expandAllSelected(this.value, this.itemsMap);
      this.updateListViewModel();
      viewModelWasUpdated = true;

      viewModelWasUpdated =
        this.viewSrvc.scrollToItem(item, {
          listViewModel: this.listViewModel,
          listElement: this.listElement.nativeElement,
          itemsMap: this.itemsMap,
          updateListViewModel: this.updateListViewModel.bind(this),
        }) || viewModelWasUpdated;
    } else {
      this.toggleCollapseAll(this.startCollapsed);
      this.listElement.nativeElement.scrollTop = 0;
      viewModelWasUpdated = true;
    }

    console.timeEnd('applyValue');
    return viewModelWasUpdated;
  }

  private emitChange(): void {
    this.changed.emit({
      selectedIDs: this.value,
      selectedValues: [],
    });
    // this.listActionsState.apply.disabled = false;
  }

  protected updateActionButtonsState(
    forceClear: boolean = null,
    forceReset: boolean = null
  ) {
    this.listActionsState.clear.hidden =
      forceClear !== null ? forceClear : !this.value || this.value.length === 0;
    this.listActionsState.reset.hidden =
      forceReset !== null
        ? forceReset
        : !this.value ||
          !this.valueDefault ||
          !arrayDifference(this.value, this.valueDefault).length;
  }

  public showCheckbox(item: TreeListItem): boolean {
    return this.type === SelectType.multi && !this.readonly && !this.disabled;
  }

  public getItemViewContext(
    id: itemID,
    index: number
  ): TreeListItemViewContext {
    return this.viewSrvc.getItemViewContext(id, index, {
      itemsMap: this.itemsMap,
      listViewModel: this.listViewModel,
    });
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

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
