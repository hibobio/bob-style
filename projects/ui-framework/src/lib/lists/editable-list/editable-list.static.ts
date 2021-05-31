import { BehaviorSubject } from 'rxjs';

import {
  arrOfObjSortByProp,
  normalizeStringSpaces,
} from '../../services/utils/functional-utils';
import { GenericObject } from '../../types';
import { SelectOption } from '../list.interface';
import { ListSortType } from './editable-list.enum';
import { EditableListStateLocal } from './editable-list.interface';

export class EditListState implements EditableListStateLocal {
  constructor(
    private list$: BehaviorSubject<SelectOption[]>,
    private searchValue$: BehaviorSubject<string>,
    private currentSlice$: BehaviorSubject<[number, number]>
  ) {}

  readonly newItem = {
    id: null,
    value: '',
  };
  readonly create = [];
  readonly originalValues: GenericObject<string> = {};
  readonly previousValues: GenericObject<string> = {};

  public currentItemIndex = null;
  public hoverItemIndex = null;
  public currentAction = null;
  public ready = false;
  public size: number;

  public get list(): SelectOption[] {
    return this.list$.getValue();
  }
  public set list(list: SelectOption[]) {
    this.list$.next(list);
  }
  public get searchValue(): string {
    return this.searchValue$.getValue();
  }
  public get currentItem(): SelectOption {
    return this.list[this.currentItemIndex] || this.newItem;
  }
  public get currentSlice(): [number, number] {
    return this.currentSlice$.getValue();
  }

  public saveItemPrevValue(item: SelectOption): void {
    if (!this.originalValues[item.id]) {
      this.originalValues[item.id] = item.value;
    }
    this.previousValues[item.id] = normalizeStringSpaces(item.value);
  }
  public getItemOrigValue(item: SelectOption): string {
    return this.originalValues[item.id] || item.value || '';
  }
  public getItemPrevValue(item: SelectOption): string {
    return this.previousValues[item.id] || item.value || '';
  }
  public clearItemPrevValue(item: SelectOption): void {
    delete this.previousValues[item.id];
  }
  public restoreItemPrevValue(item: SelectOption): void {
    this.clearItemPrevValue(item);
  }

  public updateList() {
    this.size = this.list.length;
    this.list = this.list.slice();
  }
}

export class EditableListUtils {
  //
  public static sortList(
    list: SelectOption[],
    order: ListSortType = null,
    currentOrder: ListSortType = null
  ): ListSortType {
    if (order === ListSortType.UserDefined) {
      return ListSortType.UserDefined;
    }

    const shouldBeAscending =
      order === ListSortType.Asc ||
      (!order && currentOrder && currentOrder !== ListSortType.Asc) ||
      (!order && !currentOrder && !this.isListAscending(list));

    arrOfObjSortByProp(list, 'value', shouldBeAscending ? 'asc' : 'desc');

    return shouldBeAscending ? ListSortType.Asc : ListSortType.Desc;
  }

  public static isListAscending(list: SelectOption[]): boolean {
    const length = list.length;
    return !list.find(
      (itm, indx) =>
        indx + 2 <= length && list[indx].value > list[indx + 1].value
    );
  }

  public static isListDescending(list: SelectOption[]): boolean {
    const length = list.length;
    return !list.find(
      (itm, indx) =>
        indx + 2 <= length && list[indx].value < list[indx + 1].value
    );
  }

  public static getListSortType(list: SelectOption[]): ListSortType {
    const result = this.isListAscending(list)
      ? ListSortType.Asc
      : this.isListDescending(list)
      ? ListSortType.Desc
      : ListSortType.UserDefined;
    return result;
  }
}
