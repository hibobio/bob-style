import { merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ButtonSize, ButtonType } from '../../buttons/buttons.enum';
import { Button } from '../../buttons/buttons.interface';
import { Keys } from '../../enums';
import { InputAutoCompleteOptions } from '../../form-elements/input/input.enum';
import { Icons } from '../../icons/icons.enum';
import {
  applyChanges,
  cloneDeepSimpleObject,
  getEventPath,
  hasChanges,
  isFunction,
  isKey,
  notFirstChanges,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { filterByEventKey } from '../../services/utils/rxjs.operators';
import { UtilsService } from '../../services/utils/utils.service';
import { itemID, SelectOption } from '../list.interface';
import { EDITABLE_LIST_ALLOWED_ACTIONS_DEF } from './editable-list.const';
import { ListActionType, ListSortType } from './editable-list.enum';
import {
  EditableListActions,
  EditableListState,
} from './editable-list.interface';
import { EditableListUtils } from './editable-list.static';

const LIST_EDIT_BTN_BASE: Button = {
  size: ButtonSize.small,
  throttle: 150,
  swallow: true,
};

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseEditableListElement
  implements OnChanges, OnInit, OnDestroy {
  constructor(
    protected cd: ChangeDetectorRef,
    protected translateService: TranslateService,
    protected utilsService: UtilsService
  ) {}

  @ViewChild('addItemInput') addItemInput: ElementRef<HTMLInputElement>;
  @ViewChildren('editItemInput') editItemInputs: QueryList<
    ElementRef<HTMLInputElement>
  >;

  @Input() list: SelectOption[] = [];
  @Input() sortType: ListSortType;
  @Input() allowedActions: EditableListActions = {
    ...EDITABLE_LIST_ALLOWED_ACTIONS_DEF,
  };
  @Input() maxChars = 100;

  @Output() changed: EventEmitter<EditableListState> = new EventEmitter();

  public currentAction: ListActionType;
  public currentItemIndex: number = null;
  public ready = false;

  private subs: Subscription[] = [];

  readonly order = ListSortType;
  readonly autoComplete = InputAutoCompleteOptions;

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
    text: this.translateService.instant('common.done'),
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
      key: 'remove',
      label: this.translateService.instant('common.remove'),
    },
    {
      key: 'edit',
      label: this.translateService.instant('common.rename'),
    },
  ];

  readonly listState: EditableListState = {
    list: [],
    newItem: {
      id: null,
      value: '',
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        list: [],
        allowedActions: { ...EDITABLE_LIST_ALLOWED_ACTIONS_DEF },
      },
      [],
      true
    );

    if (hasChanges(changes, ['list'])) {
      this.listState.list = cloneDeepSimpleObject(this.list);
      this.sortType = EditableListUtils.getListSortType(this.listState.list);
    }

    if (hasChanges(changes, ['sortType'], true)) {
      this.sortList(this.listState.list, null, this.sortType);
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.subs.push(
      merge(
        this.utilsService.getWindowKeydownEvent(true).pipe(
          filter(() => this.currentAction && this.currentAction !== 'order'),
          filterByEventKey(Keys.escape)
        ),

        this.utilsService.getWindowClickEvent(true).pipe(
          filter((event: MouseEvent) => {
            if (!['add', 'remove', 'edit'].includes(this.currentAction)) {
              return false;
            }
            return !getEventPath(event).some(
              (el) =>
                isFunction(el.matches) &&
                el.matches(
                  this.currentAction === 'add'
                    ? '.bel-header-top'
                    : '.bel-item[cdkDrag].focused'
                )
            );
          })
        )
      ).subscribe(() => {
        this.cancel('all');
      }),

      this.utilsService
        .getWindowKeydownEvent(true)
        .pipe(
          filter(
            (event: KeyboardEvent) =>
              isKey(event.key, Keys.enter) &&
              ['add', 'remove', 'edit'].includes(this.currentAction)
          )
        )
        .subscribe(() => {
          if (this.currentAction === 'add') {
            this.addItemApply();
          }
          if (this.currentAction === 'remove') {
            this.removeItemApply(
              this.listState.list[this.currentItemIndex],
              this.currentItemIndex
            );
          }
          if (this.currentAction === 'edit') {
            this.editItemApply(
              this.listState.list[this.currentItemIndex],
              this.currentItemIndex
            );
          }
        })
    );
  }

  ngOnDestroy(): void {
    unsubscribeArray(this.subs);
  }

  public abstract addItem(): void;
  public abstract addItemApply(): void;
  public abstract removeItem(item: SelectOption, index: number): void;
  public abstract removeItemApply(item: SelectOption, index: number): void;
  public abstract editItem(item: SelectOption, index: number): void;
  public abstract editItemApply(item: SelectOption, index: number): void;
  public abstract cancel(action?: ListActionType | 'all'): void;

  public onDragStart(): void {
    this.cancel('all');
    this.currentAction = 'order';
    this.cd.detectChanges();
  }

  public onDrop({ previousIndex, currentIndex }: CdkDragDrop<any>): void {
    this.currentAction = null;

    if (previousIndex !== currentIndex) {
      this.listState.list.splice(
        currentIndex,
        0,
        this.listState.list.splice(previousIndex, 1)[0]
      );
      this.sortType = ListSortType.UserDefined;
      this.transmit();
    }
    this.cd.detectChanges();
  }

  public sortList(
    list: SelectOption[] = this.listState.list,
    order: ListSortType = null,
    currentOrder: ListSortType = this.sortType
  ): void {
    this.sortType = EditableListUtils.sortList(list, order, currentOrder);
    this.transmit();
  }

  protected transmit(): void {
    this.changed.emit({
      list: cloneDeepSimpleObject(this.listState.list),
    });
  }

  public listTrackBy(index: number, item: SelectOption): itemID {
    return (
      (item.id !== undefined && item.id) || item.value || JSON.stringify(item)
    );
  }
}
