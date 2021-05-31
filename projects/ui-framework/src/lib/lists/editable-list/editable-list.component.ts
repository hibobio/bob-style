import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  arrayRemoveItemMutate,
  isNumber,
  normalizeString,
  normalizeStringSpaces,
  simpleUID,
} from '../../services/utils/functional-utils';
import { UtilsService } from '../../services/utils/utils.service';
import { SelectOption } from '../list.interface';
import { BaseEditableListElement } from './editable-list.abstract';
import { EDITABLE_LIST_ITEMS_BEFORE_PAGER } from './editable-list.const';
import { ListActionType, ListSortType } from './editable-list.enum';
import { EditableListUtils } from './editable-list.static';

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
    protected hostElRef: ElementRef<HTMLElement>,
    protected zone: NgZone,
    protected cd: ChangeDetectorRef,
    protected translateService: TranslateService,
    protected utilsService: UtilsService
  ) {
    super(hostElRef, zone, cd, translateService, utilsService);
  }

  debug = false;

  public onMenuAction(
    action: ListActionType,
    item: SelectOption,
    index: number
  ): void {
    action === 'remove'
      ? this.removeItem(item, index)
      : action === 'edit'
      ? this.editItem(item, index)
      : action === 'moveToStart'
      ? this.onDrop({ previousIndex: index, currentIndex: 0 })
      : action === 'moveToEnd'
      ? this.onDrop({
          previousIndex: index,
          currentIndex: this.state.size,
        })
      : null;
  }

  public onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const hoverItemViewIndex = parseInt(target.dataset.itemViewIndex, 10);

    if (
      !isNumber(hoverItemViewIndex) &&
      !target.matches('.bel-item, .bel-item *') &&
      this.state.currentAction === null &&
      this.state.hoverItemViewIndex !== null
    ) {
      this.state.hoverItemViewIndex = null;
      this.cd.detectChanges();
    } else if (
      isNumber(hoverItemViewIndex) &&
      this.state.hoverItemViewIndex !== hoverItemViewIndex
    ) {
      this.state.hoverItemViewIndex = hoverItemViewIndex;
      this.cd.detectChanges();
    }
  }

  public sortList(
    order: ListSortType = null,
    currentOrder: ListSortType = this.state.sortType
  ): void {
    this.state.sortType = EditableListUtils.sortList(
      this.state.list,
      order,
      currentOrder
    );
    this.state.updateList();
    this.transmit();
  }

  public onDrop({
    item,
    previousIndex,
    currentIndex,
  }: Partial<CdkDragDrop<any>>): void {
    previousIndex = this.state.getIndexFromViewListIndex(previousIndex);
    currentIndex = this.state.getIndexFromViewListIndex(currentIndex);

    this.state.currentAction = null;

    if (previousIndex !== currentIndex) {
      this.state.list.splice(
        currentIndex,
        0,
        this.state.list.splice(previousIndex, 1)[0]
      );
      this.state.updateList();
      this.state.sortType = ListSortType.UserDefined;
      this.transmit();
    }
    this.cd.detectChanges();
  }

  public addItem(): void {
    if (this.state.currentAction === 'edit') {
      this.cancel('edit');
    }
    this.state.ready = true;
    this.state.currentItemIndex = null;
    this.state.currentAction = 'add';
    this.cd.detectChanges();
    this.addItemInput?.nativeElement.focus();
  }

  public addItemApply(): void {
    const value = normalizeStringSpaces(this.state.newItem.value);
    const valueID = normalizeString(this.state.newItem.value, true, true);

    if (value) {
      this.state.currentAction = null;

      if (this.state.deleted.has(valueID)) {
        this.state.list.splice(this.state.currentSlice[0], 0, {
          ...this.state.deleted.get(valueID),
          value,
        });
        this.state.deleted.delete(valueID);
      } else {
        this.state.list.splice(this.state.currentSlice[0], 0, {
          id: simpleUID('new--'),
          value,
        });
        this.state.create.push(value);
      }

      this.state.updateList();
      this.transmit();

      this.state.sortType = ListSortType.UserDefined;
      this.state.newItem.value = '';
      this.state.size - 1 <= EDITABLE_LIST_ITEMS_BEFORE_PAGER &&
        (this.state.emptyIterable.length = this.state.size);
      this.cd.detectChanges();
      //
    } else {
      this.cancel('add');
    }
  }

  public removeItem(item: SelectOption, index: number): void {
    this.state.ready = true;
    this.state.currentAction = 'remove';
    this.state.currentItemIndex = index;
    this.cd.detectChanges();
  }

  public removeItemApply(item: SelectOption, index: number): void {
    this.state.currentAction = null;
    this.state.currentItemIndex = null;

    if (!String(item.id).startsWith('new--')) {
      this.state.deleted.set(normalizeString(item.value, true, true), item);
    } else {
      arrayRemoveItemMutate(this.state.create, item.value);
    }

    this.state.list.splice(index, 1);
    this.state.updateList();
    this.transmit();

    this.state.size + 1 <= EDITABLE_LIST_ITEMS_BEFORE_PAGER &&
      (this.state.emptyIterable.length = this.state.size);
    this.cd.detectChanges();
  }

  public editItem(item: SelectOption, index: number): void {
    this.state.ready = true;
    this.state.currentAction = 'edit';
    this.state.currentItemIndex = index;
    this.state.saveItemPrevValue(item);
    this.cd.detectChanges();

    this.editItemInput?.nativeElement.focus();
  }

  public editItemApply(item: SelectOption, index: number): void {
    item.value = normalizeStringSpaces(item.value);

    if (item.value && item.value !== this.state.getItemPrevValue(item)) {
      this.state.currentAction = null;
      this.state.currentItemIndex = null;
      this.state.clearItemPrevValue(item);
      this.transmit();
      this.cd.detectChanges();
    } else {
      this.cancel('edit');
    }
  }

  public cancel(
    action: ListActionType | 'all' = this.state.currentAction || 'all'
  ) {
    if (action === 'edit') {
      this.state.restoreItemPrevValue(this.state.currentItem);
    }
    this.state.currentAction = null;
    this.state.currentItemIndex = null;
    this.state.newItem.value = '';
    this.cd.detectChanges();
  }
}
