import {
  BehaviorSubject,
  combineLatest,
  isObservable,
  Subscription,
} from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  tap,
} from 'rxjs/operators';

import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { isArray, isNumber } from '../../services/utils/functional-utils';
import { PagerComponent } from './pager.component';

@Pipe({ name: 'pager', pure: false })
export class PagerPipe<T = any> implements PipeTransform, OnDestroy {
  constructor(private cd: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(cd);
  }
  private asyncPipe: AsyncPipe;

  private items$: BehaviorSubject<T[]> = new BehaviorSubject(undefined);
  private itemsSlice$: Observable<T[]>;

  private hidePager = false;
  private lastItems: any;
  private sub: Subscription;

  transform(
    items: T[] | Observable<T[]>,
    pager: PagerComponent<T>,
    minItems?: number
  ): T[] {
    if ((!isArray(items) && !isObservable(items)) || !pager?.sliceChange) {
      return;
    }

    if (!this.itemsSlice$) {
      this.itemsSlice$ = combineLatest([
        this.items$.pipe(
          filter(isArray),
          tap((itms) => {
            if (
              !pager.items ||
              (isNumber(pager.items) && pager.items !== itms.length)
            ) {
              minItems &&
                (this.hidePager = pager.hidden = itms.length <= minItems);
              pager.items = itms.length;
              pager.ngOnInit();
            }
          })
        ),

        (pager.sliceChange as Observable<number[]>).pipe(
          filter(isArray),
          startWith([0, minItems || pager.config?.sliceSize]),
          distinctUntilChanged(
            (prev, curr) => prev[0] === curr[0] && prev[1] === curr[1]
          )
        ),
        //
      ]).pipe(
        map(([itms, slice]) =>
          this.hidePager === true ? itms : itms.slice(...slice)
        ),
        shareReplay(1)
      );
    }

    if (true || this.lastItems !== items) {
      if (isObservable(items)) {
        this.sub?.unsubscribe();
        this.sub = items.subscribe(this.items$);
        this.lastItems = items;
      }

      if (isArray(items)) {
        this.items$.next(items);
        this.lastItems = items;
      }
    }

    return this.asyncPipe.transform(this.itemsSlice$);
  }

  ngOnDestroy(): void {
    this.items$?.complete();
    this.sub?.unsubscribe();
  }
}
