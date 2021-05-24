import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  arrayRemoveItemMutate,
  isFunction,
  normalizeString,
  normalizeStringSpaces,
  simpleUID,
} from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { SelectOption } from '../list.interface';
import { BaseEditableListElement } from './editable-list.abstract';
import { ListActionType, ListSortType } from './editable-list.enum';

@Component({
  selector: 'b-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

  animations: [
    trigger('zoomInOut', [
      transition(':enter', [
        animate(
          '150ms',
          keyframes([
            style({
              transform: 'scaleY(0.95) scaleX(0.99) translateY(-10px)',
              opacity: 0,
            }),
            style({
              transform: 'scaleY(1) scaleX(1) translateY(0)',
              opacity: 1,
            }),
          ])
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms',
          keyframes([
            style({
              transform: 'scaleY(1) scaleX(1) translateY(0)',
              opacity: 1,
            }),
            style({
              transform: 'scaleY(0.9) scaleX(0.95) translateY(-5px)',
              opacity: 0,
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class EditableListComponent extends BaseEditableListElement {
  constructor(
    protected cd: ChangeDetectorRef,
    protected translateService: TranslateService,
    protected utilsService: UtilsService
  ) {
    super(cd, translateService, utilsService);
  }

  public onMenuAction(
    action: ListActionType,
    item: SelectOption,
    index: number
  ): void {
    action === 'remove'
      ? this.removeItem(item, index)
      : action === 'edit'
      ? this.editItem(item, index)
      : null;
  }

  public addItem(): void {
    if (this.currentAction === 'edit') {
      this.cancel('edit');
    }
    this.ready = true;
    this.currentItemIndex = null;
    this.currentAction = 'add';
    this.cd.detectChanges();
    this.addItemInput?.nativeElement.focus();
  }

  public addItemApply(): void {
    const value = normalizeStringSpaces(this.listState.newItem.value);
    const valueID = normalizeString(this.listState.newItem.value, true, true);

    if (value) {
      this.currentAction = null;

      if (this.deleted.has(valueID)) {
        this.listState.list.unshift({ ...this.deleted.get(valueID), value });
        this.deleted.delete(valueID);
      } else {
        this.listState.create.push(value);
        this.listState.list.unshift({
          id: simpleUID('new--'),
          value,
        });
      }

      this.transmit();

      this.sortType = ListSortType.UserDefined;
      this.listState.newItem.value = '';
      this.cd.detectChanges();
      //
    } else {
      this.cancel('add');
    }
  }

  public removeItem(item: SelectOption, index: number): void {
    this.ready = true;
    this.currentAction = 'remove';
    this.currentItemIndex = index;
    this.cd.detectChanges();
  }

  public removeItemApply(item: SelectOption, index: number): void {
    this.currentAction = null;
    this.currentItemIndex = null;

    if (!String(item.id).startsWith('new--')) {
      this.deleted.set(normalizeString(item.value, true, true), item);
    } else {
      arrayRemoveItemMutate(this.listState.create, item.value);
    }

    this.listState.list.splice(index, 1);
    this.transmit();

    this.cd.detectChanges();
  }

  public editItem(item: SelectOption, index: number): void {
    this.ready = true;
    this.currentAction = 'edit';
    this.currentItemIndex = index;
    item.originalValue = normalizeStringSpaces(item.value);
    this.cd.detectChanges();

    (isFunction(this.editItemInputs?.get)
      ? this.editItemInputs?.get(index)
      : this.editItemInputs?.toArray()[index]
    )?.nativeElement.focus();
  }

  public editItemApply(item: SelectOption, index: number): void {
    item.value = normalizeStringSpaces(item.value);

    if (item.value && item.value !== item.originalValue) {
      this.currentAction = null;
      this.currentItemIndex = null;
      delete item.originalValue;
      this.transmit();
      this.cd.detectChanges();
    } else {
      this.cancel('edit');
    }
  }

  public cancel(action: ListActionType | 'all' = this.currentAction || 'all') {
    if (action === 'edit') {
      this.currentItem.value = this.currentItem.originalValue || '';
      delete this.currentItem.originalValue;
    }
    this.currentAction = null;
    this.currentItemIndex = null;
    this.listState.newItem.value = '';
    this.cd.detectChanges();
  }
}
