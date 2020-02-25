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
  isNotEmptyArray,
  asArray,
} from '../../services/utils/functional-utils';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { LIST_ACTIONS_STATE_DEF } from '../list-footer/list-footer.const';
import { TreeListControlsService } from './services/tree-list-controls.service';
import { SearchComponent } from '../../search/search/search.component';
import { BTL_ROOT_ID, BTL_KEYMAP_DEF } from './tree-list.const';
import { selectValueOrFail } from '../../services/utils/transformers';
import { LIST_EL_HEIGHT } from '../list.consts';

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

  @Input() list: TreeListOption[] = [];
  @Input() value: itemID[];
  @Input() viewFilter: ViewFilter;
  @Input() keyMap: TreeListKeyMap = BTL_KEYMAP_DEF;

  @Input() type: SelectType = SelectType.multi;
  @Input() valueSeparatorChar = ' / ';
  @Input() maxHeightItems = 8;
  @Input() showSingleGroupHeader = false;
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
  @HostBinding('attr.data-embedded') @Input() public embedded = false;

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
  private listCacheRef: TreeListOption[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        list: [],
        keyMap: BTL_KEYMAP_DEF,
      },
      ['value']
    );

    console.log('changes', changes);

    if (hasChanges(changes, ['keyMap'], true)) {
      this.keyMap = { ...BTL_KEYMAP_DEF, ...this.keyMap };
    }

    if (hasChanges(changes, ['value'])) {
      this.value = selectValueOrFail(this.value);
    }

    if (
      hasChanges(changes, ['list'], true) &&
      changes.list.currentValue !== this.listCacheRef
    ) {
      this.listCacheRef = this.list;

      console.log('Changes: LIST');

      this.modelSrvc.getListItemsMap(this.list, this.itemsMap, {
        keyMap: this.keyMap,
        separator: this.valueSeparatorChar,
        collapsed: this.startCollapsed,
      });

      this.showSearch = this.itemsMap.size > 10;

      if (isNotEmptyArray(this.value)) {
        this.applyValue(this.value);
      }

      this.updateListViewModel();
    }

    if (
      hasChanges(changes, ['value']) &&
      this.itemsMap.size > 0 &&
      (!changes.list ||
        (changes.list && changes.list.currentValue === this.listCacheRef))
    ) {
      console.log('Changes: VALUE');
      this.applyValue(this.value);
    }

    if (hasChanges(changes, ['viewFilter'], true) && !changes.list) {
      this.updateListViewModel();
    }

    if (
      hasChanges(changes, ['startCollapsed']) &&
      typeof this.startCollapsed === 'boolean'
    ) {
      this.toggleCollapseAll(this.startCollapsed);
    }

    // if (
    //   hasChanges(changes, [
    //     'options',
    //     'showSingleGroupHeader',
    //     'optionsDefault',
    //   ])
    // ) {
    //   this.updateActionButtonsState();
    // }

    if (hasChanges(changes, ['maxHeightItems', 'list'], true)) {
      this.DOM.setCssProps(this.host.nativeElement, {
        '--list-max-items': Math.max(
          this.itemsMap.get(BTL_ROOT_ID).groupsCount + 3,
          this.maxHeightItems
        ),
      });
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasFooter =
          (!this.readonly && objectHasTruthyValue(this.listActions)) ||
          !this.DOM.isEmpty(this.footer.nativeElement);

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

  private updateListViewModel(expand = false) {
    console.log(this.viewFilter);
    this.listViewModel = this.modelSrvc.getListViewModel(
      this.list,
      this.itemsMap,
      this.viewFilter,
      {
        expand,
        keyMap: this.keyMap,
      }
    );
    console.log(this.listViewModel);
    this.cd.detectChanges();
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

  public toggleCollapseAll(force = null): void {
    for (const item of this.itemsMap.values()) {
      if (item.childrenCount && item.id !== BTL_ROOT_ID) {
        item.collapsed = force !== null ? force : !item.collapsed;
      }
    }
    this.updateListViewModel();
  }

  public itemClick(item: TreeListItem, element: HTMLElement): void {
    if (item.childrenCount && !item.allOptionsHidden) {
      this.toggleItemCollapsed(item, element);
    } else if (!this.readonly) {
      this.toggleItemSelect(item);
    }

    this.updateActionButtonsState();
  }

  public toggleItemCollapsed(item: TreeListItem, element: HTMLElement): void {
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

  public toggleItemSelect(item: TreeListItem): void {
    item.selected = !item.selected;

    for (const parenID of item.parentIDs) {
      const parent = this.itemsMap.get(parenID);
      parent.selectedCount = parent.selectedCount + (item.selected ? 1 : -1);

      parent.selected = parent.selectedCount === parent.childrenCount;

      parent.indeterminate = !parent.selected && !!parent.selectedCount;
    }

    this.cd.detectChanges();
  }

  public clearList(): void {
    this.applyValue(null);
    this.updateActionButtonsState();
  }

  public resetList(): void {}

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

  private applyValue(value: itemID[]) {
    let firstSelectedID: itemID;

    this.itemsMap.forEach((item: TreeListItem, index: number) => {
      item.selected = !!value && value.includes(item.id);
      if (!firstSelectedID && item.selected) {
        firstSelectedID = item.id;
      }
    });

    if (firstSelectedID && this.itemElements) {
      const item = this.itemsMap.get(firstSelectedID);

      let index = this.listViewModel.findIndex(id => id === firstSelectedID);

      if (index === -1 && item.parentIDs) {
        item.parentIDs.forEach(id => {
          this.itemsMap.get(id).collapsed = false;
        });
        this.updateListViewModel();

        index = this.listViewModel.findIndex(id => id === firstSelectedID);
      }

      const element = this.listElement.nativeElement.children[index];

      const groupsBefore = this.listViewModel.slice(0, index).filter(id => {
        const itm = this.itemsMap.get(id);

        return (
          itm.childrenCount > 0 && (itm.parentCount || 0) < item.parentCount
        );
      }).length;

      console.log(
        'item',
        firstSelectedID,
        'has',
        groupsBefore,
        'groups before it'
      );

      const elOffset = element.offsetTop;
      const scrollTop = this.listElement.nativeElement.scrollTop;

      console.log(
        // 'element',
        // element,
        'index',
        index,
        'elOffset',
        elOffset,
        'scrollTop',
        scrollTop,
        'group offset',
        groupsBefore * 44,
        'new scrollTop',
        elOffset - groupsBefore * LIST_EL_HEIGHT
      );

      this.listElement.nativeElement.scrollTop =
        element.offsetTop - groupsBefore * LIST_EL_HEIGHT;
    }
  }

  private emitChange(): void {
    this.changed.emit({
      selectedIDs: this.value,
      selectedValues: [],
    });
  }

  protected updateActionButtonsState(
    forceClear: boolean = null,
    forceReset: boolean = null
  ) {
    // this.listActionsState.clear.hidden =
    //   forceClear !== null
    //     ? forceClear
    //     : !this.selectedIDs || this.selectedIDs.length === 0;
    // this.listActionsState.reset.hidden =
    //   forceReset !== null
    //     ? forceReset
    //     : !this.selectedIDs ||
    //       !this.optionsDefaultIDs ||
    //       isEqual(this.selectedIDs.sort(), this.optionsDefaultIDs.sort());
  }

  public isGroupSelected(item: TreeListItem): boolean {
    return item.parentIDs.some(groupID => this.itemsMap.get(groupID).selected);
  }

  public showCheckbox(item: TreeListItem): boolean {
    return this.type === SelectType.multi && !this.readonly && !this.disabled;
  }

  public getItemViewContext(
    id: itemID,
    index: number
  ): TreeListItemViewContext {
    const item = this.itemsMap.get(id);
    // const prevItem = this.itemsMap.get(this.listViewModel[index - 1]);
    const nextItem = this.itemsMap.get(this.listViewModel[index + 1]);
    return {
      index,
      item,
      groupSelected: this.isGroupSelected(item),
      nextInViewIsGroup: Boolean(nextItem && nextItem.childrenCount),
    };
  }

  public trackBy(index: number, id: itemID): itemID {
    return id;
  }

  log() {
    console.log('---------CMPNT---------\n', this);
    console.log('---------LIST---------\n', this.list);
    console.log('---------MAP---------\n', this.itemsMap);
    console.log('---------VIEWMODEL---------\n', this.listViewModel);
  }
}
