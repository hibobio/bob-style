import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  NgZone,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { SelectOption } from '../list.interface';
import { DropResult } from 'ngx-smooth-dnd';
import { Icons } from '../../icons/icons.enum';
import { ButtonType, ButtonSize } from '../../buttons/buttons.enum';
import {
  EditableListActions,
  EditableListTranslation,
  EditableListState,
} from './editable-list.interface';
import {
  applyChanges,
  notFirstChanges,
  cloneObject,
  hasChanges,
  isNotEmptyArray,
  cloneArray,
  isKey,
  isNumber,
} from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';
import {
  EDITABLE_LIST_TRANSLATION,
  EDITABLE_LIST_ALLOWED_ACTIONS_DEF,
} from './editable-list.const';
import { ListSortType } from './editable-list.enum';
import { EditableListService } from './editable-list.service';
import { Keys } from '../../enums';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'b-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableListComponent implements OnChanges, OnInit, OnDestroy {
  constructor(
    private editableListService: EditableListService,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChild('addItemInput') addItemInput: ElementRef;

  @Input() list: SelectOption[] = [];
  @Input() sortType: ListSortType;
  @Input() allowedActions: EditableListActions = cloneObject(
    EDITABLE_LIST_ALLOWED_ACTIONS_DEF
  );
  @Input() translation: EditableListTranslation = cloneObject(
    EDITABLE_LIST_TRANSLATION
  );
  @Input() maxChars = 100;
  @Output() changed: EventEmitter<EditableListState> = new EventEmitter<
    EditableListState
  >();
  @Output() inputChanged: EventEmitter<string> = new EventEmitter<string>();

  readonly icons = Icons;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly order = ListSortType;

  public listState: EditableListState = {
    delete: [],
    create: [],
    order: null,
    sortType: null,
    list: [],
  };

  public isDragged = false;
  public addingItem = false;
  public addingItemLen = 0;
  public addedItem = false;
  public inputInvalid = false;
  public sameItemIndex: number = null;
  public removingIndex: number = null;
  public removedItem = false;
  private inputChangeDbncr: Subject<string> = new Subject<string>();
  private inputChangeSbscr: Subscription;

  @HostListener('keydown.outside-zone', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (isNumber(this.removingIndex) && isKey(event.key, Keys.escape)) {
      this.removeCancel();
    }
    if (isNumber(this.removingIndex) && isKey(event.key, Keys.enter)) {
      this.zone.run(() => {
        this.removeItem(this.removingIndex, true);
      });
    }

    if (
      this.addingItem &&
      (isKey(event.key, Keys.enter) || isKey(event.key, Keys.tab))
    ) {
      this.zone.run(() => {
        this.addItem(true);
      });
    }
    if (this.addingItem && isKey(event.key, Keys.escape)) {
      this.addItemCancel();
    }
  }

  @HostListener('focusout.outside-zone', ['$event'])
  onHostFocusout(event: FocusEvent): void {
    if (isNumber(this.removingIndex)) {
      this.removeCancel(event);
    }
    if (this.addingItem) {
      this.addItemCancel(event);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        list: [],
        allowedActions: cloneObject(EDITABLE_LIST_ALLOWED_ACTIONS_DEF),
        translation: cloneObject(EDITABLE_LIST_TRANSLATION),
      },
      [],
      true
    );

    if (hasChanges(changes, ['list'])) {
      this.listState.list = cloneDeep(this.list);
      this.listState.sortType = this.editableListService.getListSortType(
        this.listState.list
      );
    }

    if (hasChanges(changes, ['sortType'], true)) {
      this.sortList(
        this.listState.list,
        this.sortType,
        this.listState.sortType
      );
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public ngOnInit(): void {
    if (this.inputChanged.observers.length) {
      this.inputChangeSbscr = this.inputChangeDbncr
        .pipe(debounceTime(300))
        .subscribe(value => {
          this.inputChanged.emit(value);
        });
    }
  }

  public addItem(confirm = false): void {
    if (!confirm) {
      this.addingItem = true;

      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.addItemInput.nativeElement.focus();
          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }
        }, 0);
      });
    } else {
      const value = this.addItemInput.nativeElement.value
        .replace(/\s+/gi, ' ')
        .trim();

      if (value) {
        this.sameItemIndex = this.listState.list
          .map(i => i.value)
          .findIndex(
            i =>
              i
                .toLowerCase()
                .replace(/[./\\()\"':,.;<>~!@#$%^&*|+=[\]{}`~\?-]/g, '') ===
              value
                .toLowerCase()
                .replace(/[./\\()\"':,.;<>~!@#$%^&*|+=[\]{}`~\?-]/g, '')
          );

        if (this.sameItemIndex > -1) {
          this.inputInvalid = true;
          this.addedItem = false;
        }

        if (this.sameItemIndex === -1) {
          this.addingItem = false;
          this.addedItem = true;
          this.editableListService.addItem(this.listState.list, value);
          this.listState.create.push(value);
          this.transmit();
          this.listState.sortType = ListSortType.UserDefined;
          this.addItemInput.nativeElement.value = '';
          this.addingItemLen = 0;
        }
      } else {
        this.addItemCancel();
      }
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public addItemCancel(event: FocusEvent = null): void {
    const relatedTarget = event && (event.relatedTarget as HTMLElement);

    if (
      !relatedTarget ||
      !relatedTarget.matches(
        '.bel-done-button button, .bel-item-confirm, .bel-item-input'
      )
    ) {
      this.addingItem = false;
      this.inputInvalid = false;
      this.sameItemIndex = null;

      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }

    if (relatedTarget && relatedTarget.matches('.bel-item-confirm')) {
      this.addItemInput.nativeElement.focus();
    }

    if (
      !event ||
      (relatedTarget && relatedTarget.matches('.bel-cancel-button button'))
    ) {
      this.addItemInput.nativeElement.value = '';
      this.addingItemLen = 0;
    }
  }

  public removeItem(index: number, confirm = false): void {
    if (!confirm) {
      this.removingIndex = index;
    } else {
      this.addedItem = false;
      this.removedItem = true;

      setTimeout(() => {
        this.removingIndex = null;
        this.removedItem = false;
        this.listState.delete.push(this.listState.list[index].value);
        this.listState.list.splice(index, 1);
        this.transmit();

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 150);
    }

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public removeCancel(event: FocusEvent = null): void {
    const relatedTarget = event && (event.relatedTarget as HTMLElement);

    if (!relatedTarget || !relatedTarget.matches('.bel-remove-button button')) {
      this.removingIndex = null;

      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }
  }

  public onInputChange(): void {
    const value = this.addItemInput.nativeElement.value.trim();
    this.addingItemLen = value.length;
    this.inputInvalid = false;
    this.sameItemIndex = null;

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }

    if (this.inputChangeSbscr) {
      this.zone.run(() => {
        this.inputChangeDbncr.next(value);
      });
    }
  }

  public ngOnDestroy(): void {
    if (this.inputChangeSbscr) {
      this.inputChangeDbncr.complete();
      this.inputChangeSbscr.unsubscribe();
    }
  }

  public onDragStart(): void {
    this.isDragged = true;
    this.addedItem = false;
  }

  public onDrop(dropResult: DropResult): void {
    this.isDragged = false;
    if (this.editableListService.onDrop(this.listState.list, dropResult)) {
      this.listState.sortType = ListSortType.UserDefined;
      this.transmit();
    }
  }

  public sortList(
    list: SelectOption[] = this.listState.list,
    order: ListSortType = null,
    currentOrder: ListSortType = this.listState.sortType
  ): void {
    this.listState.sortType = this.editableListService.sortList(
      list,
      order,
      currentOrder
    );
    this.addedItem = false;
    this.transmit();
  }

  private transmit(): void {
    this.listState.order = this.listState.list.map(i => i.value);
    const itersection = this.listState.create.filter(i =>
      this.listState.delete.includes(i)
    );

    if (isNotEmptyArray(itersection)) {
      this.listState.create = this.listState.create.filter(
        i => !itersection.includes(i)
      );
      this.listState.delete = this.listState.delete.filter(
        i => !itersection.includes(i)
      );
    }

    this.changed.emit(
      Object.assign({}, this.listState, {
        list: cloneArray(this.listState.list),
      })
    );
  }

  public listTrackBy(index: number, item: SelectOption): string | number {
    return (
      (item.id !== undefined && item.id) || item.value || JSON.stringify(item)
    );
  }
}
