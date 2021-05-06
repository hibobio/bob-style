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
  QueryList,
  ViewChildren,
} from '@angular/core';
import { itemID, SelectOption } from '../list.interface';
import { Icons } from '../../icons/icons.enum';
import { ButtonType, ButtonSize } from '../../buttons/buttons.enum';
import {
  EditableListActions,
  EditableListState,
} from './editable-list.interface';
import {
  applyChanges,
  notFirstChanges,
  cloneObject,
  hasChanges,
  cloneArray,
  isKey,
  isNumber,
} from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';
import { EDITABLE_LIST_ALLOWED_ACTIONS_DEF } from './editable-list.const';
import { IconActionsType, ListSortType } from './editable-list.enum';
import { Keys } from '../../enums';
import { EditableListUtils } from './editable-list.static';
import { InputAutoCompleteOptions } from '../../form-elements/input/input.enum';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MenuItem } from 'bob-style';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'b-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableListComponent implements OnChanges {
  constructor(
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService) {}

  @ViewChild('addItemInput') addItemInput: ElementRef;
  @ViewChildren('editItemInput') editItemInputs: QueryList<ElementRef<HTMLInputElement>>;
  @Input() list: SelectOption[] = [];
  @Input() sortType: ListSortType;
  @Input() allowedActions: EditableListActions = cloneObject(
    EDITABLE_LIST_ALLOWED_ACTIONS_DEF
  );
  @Input() maxChars = 100;
  @Output() changed: EventEmitter<EditableListState> = new EventEmitter<
    EditableListState
  >();

  readonly icons = Icons;
  readonly buttonType = ButtonType;
  readonly buttonSize = ButtonSize;
  readonly order = ListSortType;
  readonly autoComplete = InputAutoCompleteOptions;

  public listState: EditableListState = {
    list: [],
  };

  public isDragged = false;
  public addingItem = false;
  public addingItemLen = 0;
  public addedItem = false;
  public inputInvalid = false;
  public itemHandledIndex: number = null;
  public removedItem = false;
  public currentActionType: IconActionsType;
  public currentEditInput: ElementRef<HTMLInputElement>;
  public editInputInvalid: boolean;
  public isFocusOutEdit: boolean;
  @HostListener('keydown.outside-zone', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (isNumber(this.itemHandledIndex) && isKey(event.key, Keys.escape)) {
      this.removeCancel();
    }
    if (isNumber(this.itemHandledIndex) && isKey(event.key, Keys.enter)) {
      this.zone.run(() => {
        this.removeItem(this.itemHandledIndex, true);
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
    if (this.currentEditInput) {
      this.cancelEdit(this.listState.list[this.itemHandledIndex], event);
      return;
    }
    if (isNumber(this.itemHandledIndex)) {
      this.removeCancel(event);
    }
   if (this.addingItem) {
      this.addItemCancel(event);
    }
 }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        list: [],
        allowedActions: cloneObject(EDITABLE_LIST_ALLOWED_ACTIONS_DEF),
      },
      [],
      true
    );

    if (hasChanges(changes, ['list'])) {
      this.listState.list = cloneDeep(this.list);
      this.sortType = EditableListUtils.getListSortType(
        this.listState.list
      );
    }

    if (hasChanges(changes, ['sortType'], true)) {
      this.sortList(
        this.listState.list,
        null,
        this.sortType
      );
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public get isEditMode(): boolean {
    return this.currentActionType === 'edit';
  }

  public initMenuItems(index: number, item: SelectOption): MenuItem[] {
    return [
      {
        label: this.translateService.instant('common.delete'),
        id: 'remove',
        action: this.removeItem.bind(this, index, false)
      },
      {
        label: this.translateService.instant('common.rename'),
        id: 'edit',
        action: this.editItem.bind(this, item, index)
      }
    ]
  }

  public saveEdit(item: SelectOption): void {
    if (item.value) {
      this.listState.list[this.itemHandledIndex].value = item.value
      this.itemHandledIndex = null;
      this.currentEditInput = null;
      this.transmit();
    } else {
      this.cancelEdit(item);
    }
  }

  public cancelEdit(item: SelectOption, event: FocusEvent = null): void {
    const relatedTarget = event && (event.relatedTarget as HTMLButtonElement);
    if (relatedTarget && (relatedTarget.matches('.save-edit-btn button') ||
    relatedTarget.matches('.edit-input')) || !item) { 
      return;
    }
    item.value = item.originalValue;
    this.itemHandledIndex = null;
    this.currentEditInput = null;
  }

  public get isMultipleActions(): boolean {
    return this.allowedActions.remove && this.allowedActions.edit;
  }

  public editItem(item: SelectOption, index: number): void {
    this.itemHandledIndex = index;
    this.currentActionType = 'edit'
    item.originalValue = item.value;
    this.addingItemLen = item.value.length;
    this.currentEditInput = this.editItemInputs.toArray().find(i => i.nativeElement.id === this.itemHandledIndex.toString());
    this.currentEditInput.nativeElement.focus();
  }

  public addItem(confirm = false): void {
    this.itemHandledIndex = null;
    this.currentActionType = null;
    const value = this.addItemInput.nativeElement.value.replace(/\s+/gi, ' ').trim();
    if (!confirm) {
      this.addingItem = true;
      this.addingItemLen = value.length;
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.addItemInput.nativeElement.focus();
          if (!this.cd['destroyed']) {
            this.cd.detectChanges();
          }
        }, 0);
      });
    } else {
      if (value) {
          this.addingItem = false;
          this.addedItem = true;
          EditableListUtils.addItem(this.listState.list, value);
          this.transmit();
          this.sortType = ListSortType.UserDefined;
          this.addItemInput.nativeElement.value = '';
          this.addingItemLen = 0;
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
    this.currentActionType = 'remove'
    if (!confirm) {
      this.itemHandledIndex = index;
    } else {
      this.addedItem = false;
      this.removedItem = true;

      setTimeout(() => {
        this.itemHandledIndex = null;
        this.removedItem = false;
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
      this.itemHandledIndex = null;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }
  }

  public onInputChange(): void {
    const value = this.currentEditInput ? this.currentEditInput.nativeElement.value.trim() : 
    this.addItemInput.nativeElement.value.trim();
    this.addingItemLen = value.length;
    this.inputInvalid = false;
    this.editInputInvalid = false;

    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  public onDragStart(): void {
    this.isDragged = true;
    this.addedItem = false;
  }

  public onDrop(event: CdkDragDrop<SelectOption[]>): void {
    this.isDragged = false;
    if (EditableListUtils.onDrop(this.listState.list, event.previousIndex, event.currentIndex)) {
      this.sortType = ListSortType.UserDefined;
      this.transmit();
    }
  }

  public sortList(
    list: SelectOption[] = this.listState.list,
    order: ListSortType = null,
    currentOrder: ListSortType = this.sortType
  ): void {
    this.sortType = EditableListUtils.sortList(
      list,
      order,
      currentOrder
    );
    this.addedItem = false;
    this.transmit();
  }

  private transmit(): void {
    this.changed.emit(
      Object.assign({}, {
        list: cloneArray(this.listState.list),
      })
    );
  }

  public listTrackBy(index: number, item: SelectOption): itemID {
    return (
      (item.id !== undefined && item.id) || item.value || JSON.stringify(item)
    );
  }
}
