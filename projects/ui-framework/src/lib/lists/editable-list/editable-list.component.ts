import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '../../services/utils/utils.service';
import { SelectOption } from '../list.interface';
import { BaseEditableListElement } from './editable-list.abstract';
import { ListActionType, ListSortType } from './editable-list.enum';

@Component({
  selector: 'b-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableListComponent extends BaseEditableListElement {
  constructor(
    protected hostElRef: ElementRef<HTMLElement>,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected translateService: TranslateService,
    protected utilsService: UtilsService
  ) {
    super(hostElRef, zone, cd, translateService, utilsService);
  }

  public addItem(): void {
    this.currentItemIndex = null;
    this.currentAction = 'add';
    this.cd.detectChanges();

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.addItemInput.nativeElement.focus();
      }, 0);
    });
  }

  public addItemApply(): void {
    if (this.listState.newItem.value.trim()) {
      this.currentAction = null;
      this.addedItem = true;

      this.listState.list.unshift({
        id: null,
        value: this.listState.newItem.value.trim(),
      });

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
    console.log('removeItem');

    this.currentAction = 'remove';
    this.addedItem = false;

    this.currentItemIndex = index;
    this.cd.detectChanges();
  }

  public removeItemApply(item: SelectOption, index: number): void {
    this.currentAction = null;
    this.currentItemIndex = null;
    this.removedItemIndex = index;
    this.cd.detectChanges();

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        // this.currentItemIndex = null;
        this.removedItemIndex = null;
        this.listState.list.splice(index, 1);
        this.transmit();
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 150);
    });
  }

  public editItem(item: SelectOption, index: number): void {
    console.log('editItem');
    this.currentAction = 'edit';
    this.currentItemIndex = index;

    item.originalValue = item.value;
    this.editItemInputs.get(index).nativeElement.focus();
  }

  public cancelEdit(item: SelectOption, event: FocusEvent = null): void {
    const relatedTarget = event && (event.relatedTarget as HTMLButtonElement);
    if (
      (relatedTarget &&
        (relatedTarget.matches('.save-edit-btn button') ||
          relatedTarget.matches('.edit-input'))) ||
      !item
    ) {
      return;
    }
    item.value = item.originalValue;
    delete item.originalValue;
    this.currentItemIndex = null;
  }

  public saveEdit(item: SelectOption): void {
    if (item.value) {
      this.listState.list[this.currentItemIndex].value = item.value;
      this.currentItemIndex = null;
      this.transmit();
    } else {
      this.cancelEdit(item);
    }
  }

  public cancel(action: ListActionType | 'all' = 'all') {
    if (action) {
      this.currentAction = null;
      this.addedItem = false;
      this.currentItemIndex = null;
      this.removedItemIndex = null;
      this.listState.newItem.value = '';
      this.cd.detectChanges();
    }
  }
}
