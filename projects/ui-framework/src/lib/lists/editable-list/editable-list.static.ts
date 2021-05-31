import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

import { ElementRef } from '@angular/core';

import { PagerComponent } from '../../navigation/pager/pager.component';
import { pager } from '../../navigation/pager/pager.operator';
import { CompactSearchComponent } from '../../search/compact-search/compact-search.component';
import { search } from '../../search/search/search.operator';
import { HighlightPipe } from '../../services/filters/highlight.pipe';
import {
  arrOfObjSortByProp,
  isArray,
  isNumber,
  isObject,
  normalizeStringSpaces,
  unsubscribeArray,
} from '../../services/utils/functional-utils';
import { log } from '../../services/utils/logger';
import { clone } from '../../services/utils/rxjs.operators';
import { GenericObject } from '../../types';
import { SelectOption } from '../list.interface';
import {
  EDITABLE_LIST_ITEMS_BEFORE_PAGER,
  EDITABLE_LIST_PAGER_SLICESIZE,
  EDITABLE_LIST_SEARCH_MIN_LENGTH,
} from './editable-list.const';
import { ListSortType } from './editable-list.enum';
import { EditableListViewItem } from './editable-list.interface';

export class EditListState {
  constructor() {}

  readonly list$ = new BehaviorSubject<SelectOption[]>(undefined);
  readonly viewList$ = new BehaviorSubject<EditableListViewItem[]>(undefined);
  readonly searchValue$ = new BehaviorSubject<string>('');
  readonly currentSlice$ = new BehaviorSubject<[number, number]>([
    0,
    EDITABLE_LIST_PAGER_SLICESIZE,
  ]);

  readonly emptyIterable = [];
  readonly newItem = {
    id: null,
    value: '',
  };
  readonly create = [];
  readonly deleted: Map<string, SelectOption> = new Map();
  readonly originalValues: GenericObject<string> = {};
  readonly previousValues: GenericObject<string> = {};

  private _currentItemIndex = null;
  public currentItemViewIndex = null;

  public hoverItemIndex = null;
  private _hoverItemViewIndex = null;

  public currentAction = null;
  public sortType: ListSortType;
  public ready = false;
  public size: number;

  private subs: Subscription[] = [];

  public get list(): SelectOption[] {
    return this.list$.getValue();
  }
  public set list(list: SelectOption[]) {
    this.list$.next(list);
  }

  public get viewList(): EditableListViewItem[] {
    return this.viewList$.getValue();
  }

  public get searchValue(): string {
    return this.searchValue$.getValue();
  }

  public set currentItemIndex(index: number) {
    this._currentItemIndex = index;
    this.currentItemViewIndex = this.getViewListIndexFromIndex(index);
  }
  public get currentItemIndex(): number {
    return this._currentItemIndex;
  }

  public set hoverItemViewIndex(index: number) {
    this._hoverItemViewIndex = index;
    this.hoverItemIndex = this.getIndexFromViewListIndex(index);
  }
  public get hoverItemViewIndex(): number {
    return this._hoverItemViewIndex;
  }

  public get currentItem(): SelectOption {
    return this.list[this.currentItemIndex] || this.newItem;
  }
  public get hoverItem(): SelectOption {
    return this.viewList[this.hoverItemViewIndex]?.data;
  }

  public get currentSlice(): [number, number] {
    return this.currentSlice$.getValue();
  }

  public getItemIndex(item: SelectOption): number {
    const idx = isObject(item)
      ? this.list.findIndex((itm) => itm === item)
      : -1;
    return idx === -1 ? null : idx;
  }
  public getIndexFromViewListIndex(viewListIndex: number): number {
    return isNumber(viewListIndex)
      ? this.getItemIndex(this.viewList[viewListIndex]?.data)
      : null;
  }
  public getViewListIndexFromIndex(index: number): number {
    const idx =
      isNumber(index) && this.list[index]
        ? this.viewList.findIndex((itm) => itm.data === this.list[index])
        : -1;
    return idx === -1 ? null : idx;
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

  public updateSize(size: number): number {
    this.size = size;
    this.emptyIterable.length =
      this.size > EDITABLE_LIST_ITEMS_BEFORE_PAGER
        ? EDITABLE_LIST_PAGER_SLICESIZE
        : this.size;
    return this.size;
  }

  public updateList(): number {
    this.list = this.list.slice();
    return this.updateSize(this.list.length);
  }

  public init(
    listInput$: Observable<SelectOption[]>,
    searchCmpnt: CompactSearchComponent,
    pagerCmpnt: PagerComponent,
    hostElRef?: ElementRef<HTMLElement>
  ) {
    //
    if (this.subs.length) {
      log.wrn('EditListState already initialized', 'EditListState');
      return;
    }
    this.subs.push(
      //
      searchCmpnt.searchChange
        .pipe(
          map(
            (value) =>
              (value?.trim().length >= EDITABLE_LIST_SEARCH_MIN_LENGTH &&
                value?.trim()) ||
              ''
          ),
          distinctUntilChanged(),
          tap(() => {
            pagerCmpnt.setCurrentPage = 0;
          })
        )
        .subscribe(this.searchValue$),

      pagerCmpnt.pageChange.subscribe((page) => {
        this.currentItemIndex = null;
        this.hoverItemViewIndex = null;
        this.currentAction = null;
        hostElRef?.nativeElement.scrollIntoView();
      }),

      pagerCmpnt.sliceChange
        .pipe(filter(Boolean))
        .subscribe(this.currentSlice$),

      listInput$
        .pipe(
          filter(isArray),
          distinctUntilChanged(),
          clone(),
          tap((list) => {
            this.updateSize(list.length);
            this.sortType = EditableListUtils.getListSortType(list);
          })
        )
        .subscribe(this.list$),

      this.list$
        .pipe(
          search<SelectOption>(
            searchCmpnt,
            'value',
            EDITABLE_LIST_SEARCH_MIN_LENGTH
          ),
          pager<SelectOption>(pagerCmpnt, EDITABLE_LIST_ITEMS_BEFORE_PAGER),

          map((list) =>
            list.map((item, viewIndex) => ({
              index: this.getItemIndex(item),
              viewIndex,
              data: item,
              highlightedValue:
                this.searchValue &&
                HighlightPipe.prototype.transform(
                  item.value,
                  this.searchValue,
                  true
                ),
            }))
          )
        )
        .subscribe(this.viewList$)
    );
  }

  public destroy(): void {
    unsubscribeArray(this.subs);
    [this.list$, this.viewList$, this.searchValue$, this.currentSlice$].forEach(
      (subj) => {
        subj.complete();
        subj.unsubscribe();
      }
    );
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
