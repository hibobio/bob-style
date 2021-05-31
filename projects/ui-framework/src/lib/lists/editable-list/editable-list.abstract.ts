import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ButtonType } from '../../buttons/buttons.enum';
import { Button } from '../../buttons/buttons.interface';
import { Keys } from '../../enums';
import { InputAutoCompleteOptions } from '../../form-elements/input/input.enum';
import { Icons } from '../../icons/icons.enum';
import { PagerComponent } from '../../navigation/pager/pager.component';
import { PagerConfig } from '../../navigation/pager/pager.interface';
import { CompactSearchComponent } from '../../search/compact-search/compact-search.component';
import { CompactSearchConfig } from '../../search/compact-search/compact-search.interface';
import { InputObservable } from '../../services/utils/decorators';
import {
  getEventPath,
  getMapValues,
  isFunction,
  isKey,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import {
  filterByEventKey,
  outsideZone,
} from '../../services/utils/rxjs.operators';
import { UtilsService } from '../../services/utils/utils.service';
import { SelectOption } from '../list.interface';
import {
  EDITABLE_LIST_ALLOWED_ACTIONS_DEF,
  EDITABLE_LIST_ITEMS_BEFORE_PAGER,
  EDITABLE_LIST_PAGER_SLICESIZE,
  LIST_EDIT_BTN_BASE,
} from './editable-list.const';
import { ListActionType, ListSortType } from './editable-list.enum';
import {
  EditableListActions,
  EditableListState,
} from './editable-list.interface';
import { EditListState } from './editable-list.static';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseEditableListElement implements OnInit, OnDestroy {
  constructor(
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected translateService: TranslateService,
    protected utilsService: UtilsService
  ) {
    this.state = new EditListState();
  }

  @ViewChild(CdkDropList, { static: true, read: ElementRef })
  itemListElRef: ElementRef<HTMLElement>;

  @ViewChild('addItemInput')
  addItemInput: ElementRef<HTMLInputElement>;
  @ViewChild('editItemInput') editItemInput: ElementRef<HTMLInputElement>;
  @ViewChild(PagerComponent, { static: true }) pagerCmpnt: PagerComponent;
  @ViewChild(CompactSearchComponent, { static: true })
  searchCmpnt: CompactSearchComponent;

  @Input() maxChars = 100;

  @Input('sortType') set setSortType(sortType: ListSortType) {
    sortType && this.sortList(null, (this.state.sortType = sortType));
  }

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
  listInput$: Observable<SelectOption[]>;

  readonly pagerMinItems = EDITABLE_LIST_ITEMS_BEFORE_PAGER;
  readonly order = ListSortType;
  readonly autoComplete = InputAutoCompleteOptions;

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
    this.state.init(this.listInput$, this.searchCmpnt, this.pagerCmpnt);

    this.subs.push(
      //
      fromEvent<MouseEvent>(this.itemListElRef.nativeElement, 'mouseover')
        .pipe(outsideZone(this.zone))
        .subscribe((event) => {
          this.onMouseOver(event);
        }),

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
                    : '.bel-item-edit'
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
              this.state.currentItem,
              this.state.currentItemIndex
            );
          }
          if (this.state.currentAction === 'edit') {
            this.editItemApply(
              this.state.currentItem,
              this.state.currentItemIndex
            );
          }
        })
    );
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);
    this.state.destroy();
  }

  public abstract sortList(
    order: ListSortType,
    currentOrder: ListSortType
  ): void;
  public abstract onMouseOver(event: MouseEvent): void;
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

      ...getMapValues(this.state.deleted).reduce(
        (acc, item) => {
          acc.delete.push(this.state.getItemOrigValue(item));
          acc.deletedIDs.push(item.id);
          return acc;
        },
        { delete: [], deletedIDs: [] }
      ),
    });
  }

  public getGridRowFromIndex(index: number): string {
    return (index || 0) + 1 + '/' + ((index || 0) + 2);
  }
}
