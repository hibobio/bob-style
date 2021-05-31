import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  tap,
} from 'rxjs/operators';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ButtonType } from '../../buttons/buttons.enum';
import { Button } from '../../buttons/buttons.interface';
import { Keys } from '../../enums';
import { InputAutoCompleteOptions } from '../../form-elements/input/input.enum';
import { Icons } from '../../icons/icons.enum';
import { PagerComponent } from '../../navigation/pager/pager.component';
import { PagerConfig } from '../../navigation/pager/pager.interface';
import { pager } from '../../navigation/pager/pager.operator';
import { CompactSearchComponent } from '../../search/compact-search/compact-search.component';
import { CompactSearchConfig } from '../../search/compact-search/compact-search.interface';
import { search } from '../../search/search/search.operator';
import { HighlightPipe } from '../../services/filters/highlight.pipe';
import { InputObservable } from '../../services/utils/decorators';
import {
  getEventPath,
  getMapValues,
  isArray,
  isFunction,
  isKey,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { clone, filterByEventKey } from '../../services/utils/rxjs.operators';
import { UtilsService } from '../../services/utils/utils.service';
import { SelectOption } from '../list.interface';
import {
  EDITABLE_LIST_ALLOWED_ACTIONS_DEF,
  EDITABLE_LIST_ITEMS_BEFORE_PAGER,
  EDITABLE_LIST_PAGER_SLICESIZE,
  EDITABLE_LIST_SEARCH_MIN_LENGTH,
  LIST_EDIT_BTN_BASE,
} from './editable-list.const';
import { ListActionType, ListSortType } from './editable-list.enum';
import {
  EditableListActions,
  EditableListState,
  EditableListViewItem,
} from './editable-list.interface';
import { EditableListUtils, EditListState } from './editable-list.static';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseEditableListElement implements OnInit, OnDestroy {
  constructor(
    protected cd: ChangeDetectorRef,
    protected translateService: TranslateService,
    protected utilsService: UtilsService
  ) {
    this.state = new EditListState(
      this.list$,
      this.searchValue$,
      this.currentSlice$
    );
  }

  @ViewChild('addItemInput') addItemInput: ElementRef<HTMLInputElement>;
  @ViewChildren('editItemInput') editItemInputs: QueryList<
    ElementRef<HTMLInputElement>
  >;
  @ViewChild(PagerComponent, { static: true }) pagerCmpnt: PagerComponent;
  @ViewChild(CompactSearchComponent, { static: true })
  searchCmpnt: CompactSearchComponent;

  @Input() maxChars = 100;

  @Input('sortType') set setSortType(sortType: ListSortType) {
    sortType &&
      this.sortList(this.state.list, null, (this.sortType = sortType));
  }
  public sortType: ListSortType;

  @Input('allowedActions') set setAllowedActions(
    allowedActions: EditableListActions
  ) {
    this.allowedActions = {
      ...EDITABLE_LIST_ALLOWED_ACTIONS_DEF,
      ...allowedActions,
    };
  }
  public allowedActions = { ...EDITABLE_LIST_ALLOWED_ACTIONS_DEF };

  @Output() changed: EventEmitter<EditableListState> = new EventEmitter();

  @InputObservable()
  @Input('list')
  listInput$: BehaviorSubject<SelectOption[]>;

  readonly list$: BehaviorSubject<SelectOption[]> = new BehaviorSubject([]);
  public viewList$: Observable<EditableListViewItem[]>;
  readonly searchValue$: BehaviorSubject<string> = new BehaviorSubject('');
  readonly currentSlice$: BehaviorSubject<
    [number, number]
  > = new BehaviorSubject([0, EDITABLE_LIST_PAGER_SLICESIZE]);

  readonly pagerMinItems = EDITABLE_LIST_ITEMS_BEFORE_PAGER;
  readonly emptyIterable = [];
  readonly order = ListSortType;
  readonly autoComplete = InputAutoCompleteOptions;

  protected deleted: Map<string, SelectOption> = new Map();
  protected subs: Subscription[] = [];

  readonly state: EditListState;

  //#region config consts
  readonly pagerConfig: PagerConfig = {
    sliceStep: EDITABLE_LIST_PAGER_SLICESIZE,
    sliceMax: EDITABLE_LIST_PAGER_SLICESIZE,
    sliceSize: EDITABLE_LIST_PAGER_SLICESIZE,
    showSliceSizeSelect: false,
  };
  readonly searchConfig: CompactSearchConfig = {
    debounceTime: 300,
    openIfNotEmpty: true,
  };

  readonly addButton: Button = {
    ...LIST_EDIT_BTN_BASE,
    type: ButtonType.secondary,
    icon: Icons.add,
    text: this.translateService.instant('common.add'),
  };

  readonly removeButton: Button = {
    ...LIST_EDIT_BTN_BASE,
    type: ButtonType.negative,
    text: this.translateService.instant('common.remove'),
  };

  readonly cancelButton: Button = {
    ...LIST_EDIT_BTN_BASE,
    type: ButtonType.tertiary,
    text: this.translateService.instant('common.cancel'),
  };

  readonly doneButton: Button = {
    ...LIST_EDIT_BTN_BASE,
    type: ButtonType.secondary,
    text: this.translateService.instant('common.save'),
  };

  readonly sortButton: Button = {
    ...LIST_EDIT_BTN_BASE,
    type: ButtonType.tertiary,
    throttle: false,
    icons: {
      [ListSortType.Asc]: Icons.sort_asc,
      [ListSortType.Desc]: Icons.sort_desc,
      [ListSortType.UserDefined]: Icons.sort_asc,
    },
    texts: {
      [ListSortType.Asc]: this.translateService.instant(
        'list-editor.editor.sortAsc'
      ),
      [ListSortType.Desc]: this.translateService.instant(
        'list-editor.editor.sortDesc'
      ),
      [ListSortType.UserDefined]: this.translateService.instant(
        'list-editor.editor.sortCustom'
      ),
    },
  } as Button;

  readonly deleteButton: Button = {
    ...LIST_EDIT_BTN_BASE,
    type: ButtonType.tertiary,
    icon: Icons.delete,
  };

  readonly editButton: Button = {
    ...LIST_EDIT_BTN_BASE,
    type: ButtonType.tertiary,
    icon: Icons.edit,
  };

  readonly menuItems = [
    {
      key: 'edit',
      label: this.translateService.instant('common.rename'),
    },
    {
      key: 'remove',
      label: this.translateService.instant('common.delete'),
    },
    // {
    //   key: 'moveToStart',
    //   label: 'Move to beginning',
    // },
    // {
    //   key: 'moveToEnd',
    //   label: 'Move to end',
    // },
  ];
  //#endregion

  ngOnInit(): void {
    //
    this.viewList$ = this.list$.pipe(
      search(this.searchCmpnt, 'value', EDITABLE_LIST_SEARCH_MIN_LENGTH),
      pager(this.pagerCmpnt, EDITABLE_LIST_ITEMS_BEFORE_PAGER),

      map((list) =>
        list.map((item, viewIndex) => ({
          index: this.getIndexByItem(item),
          viewIndex,
          data: item,
          highlightedValue:
            this.state.searchValue &&
            HighlightPipe.prototype.transform(
              item.value,
              this.state.searchValue,
              true
            ),
        }))
      ),
      shareReplay(1)
    );

    this.subs.push(
      this.listInput$
        .pipe(
          filter(isArray),
          distinctUntilChanged(),
          clone(),
          tap((list) => {
            this.emptyIterable.length =
              list.length > EDITABLE_LIST_ITEMS_BEFORE_PAGER
                ? EDITABLE_LIST_PAGER_SLICESIZE
                : EDITABLE_LIST_ITEMS_BEFORE_PAGER;
            this.sortType = EditableListUtils.getListSortType(list);
          })
        )
        .subscribe(this.list$),

      this.searchCmpnt.searchChange
        .pipe(
          map(
            (value) =>
              (value?.trim().length >= EDITABLE_LIST_SEARCH_MIN_LENGTH &&
                value?.trim()) ||
              ''
          ),
          distinctUntilChanged()
          // tap(() => {
          //   this.pagerCmpnt.currentPage = 0;
          // })
        )
        .subscribe(this.searchValue$),

      this.pagerCmpnt.sliceChange
        .pipe(filter(Boolean))
        .subscribe(this.currentSlice$),

      merge(
        this.utilsService.getWindowKeydownEvent(true).pipe(
          filter(
            () =>
              this.state.currentAction && this.state.currentAction !== 'order'
          ),
          filterByEventKey(Keys.escape)
        ),

        this.utilsService.getWindowClickEvent(true).pipe(
          filter((event: MouseEvent) => {
            if (!['add', 'remove', 'edit'].includes(this.state.currentAction)) {
              return false;
            }
            return !getEventPath(event).some(
              (el) =>
                isFunction(el.matches) &&
                el.matches(
                  this.state.currentAction === 'add'
                    ? '.bel-header-top'
                    : '.bel-item[cdkDrag].focused'
                )
            );
          })
        )
      ).subscribe(() => {
        this.cancel();
      }),

      this.utilsService
        .getWindowKeydownEvent(true)
        .pipe(
          filter(
            (event: KeyboardEvent) =>
              isKey(event.key, Keys.enter) &&
              ['add', 'remove', 'edit'].includes(this.state.currentAction)
          )
        )
        .subscribe(() => {
          if (this.state.currentAction === 'add') {
            this.addItemApply();
          }
          if (this.state.currentAction === 'remove') {
            this.removeItemApply(
              this.state.list[this.state.currentItemIndex],
              this.state.currentItemIndex
            );
          }
          if (this.state.currentAction === 'edit') {
            this.editItemApply(
              this.state.list[this.state.currentItemIndex],
              this.state.currentItemIndex
            );
          }
        })
    );
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);
  }

  public abstract sortList(
    list: SelectOption[],
    order: ListSortType,
    currentOrder: ListSortType
  ): void;
  public abstract onDrop(
    { item, previousIndex, currentIndex }: Partial<CdkDragDrop<any>>,
    subList?: SelectOption[]
  ): void;
  public abstract addItem(): void;
  public abstract addItemApply(): void;
  public abstract removeItem(item: SelectOption, index: number): void;
  public abstract removeItemApply(item: SelectOption, index: number): void;
  public abstract editItem(
    item: SelectOption,
    index: number,
    viewListIndex: number
  ): void;
  public abstract editItemApply(item: SelectOption, index: number): void;
  public abstract cancel(action?: ListActionType | 'all'): void;

  public onDragStart(): void {
    this.cancel();
    this.state.currentAction = 'order';
    this.cd.detectChanges();
  }

  protected transmit(): void {
    this.changed.emit({
      list: this.state.list.map((item) => {
        return String(item.id).startsWith('new--')
          ? ({ value: item.value } as SelectOption)
          : { ...item };
      }),

      create: this.state.create.slice(),

      ...getMapValues(this.deleted).reduce(
        (acc, item) => {
          acc.delete.push(this.state.getItemOrigValue(item));
          acc.deletedIDs.push(item.id);
          return acc;
        },
        { delete: [], deletedIDs: [] }
      ),
    });
  }

  public getIndexFromSublistIndex(
    subList: SelectOption[],
    subListIndex: number
  ): number {
    return this.state.list.findIndex((i) => i === subList[subListIndex]);
  }

  public getIndexByItem(item: SelectOption): number {
    return this.state.list.findIndex((i) => i === item);
  }
}
