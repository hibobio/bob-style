import { BehaviorSubject, isObservable, Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { shareReplay } from 'rxjs/operators';

import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { isArray } from '../../services/utils/functional-utils';
import { PagerComponent } from './pager.component';
import { pager } from './pager.operator';

@Pipe({ name: 'pager', pure: false })
export class PagerPipe<T = any> implements PipeTransform, OnDestroy {
  constructor(private cd: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(cd);
  }
  private asyncPipe: AsyncPipe;
  private sub: Subscription;

  private items$: BehaviorSubject<T[]> = new BehaviorSubject(undefined);
  private itemsSlice$: Observable<T[]>;

  private lastItems: T[] | Observable<T[]>;

  transform(
    items: T[] | Observable<T[]>,
    pagerCmpnt: PagerComponent<T>,
    minItems?: number
  ): T[] {
    if ((!isArray(items) && !isObservable(items)) || !pagerCmpnt?.sliceChange) {
      return;
    }

    if (!this.itemsSlice$) {
      this.itemsSlice$ = this.items$.pipe(
        pager(pagerCmpnt, minItems),
        shareReplay(1)
      );
    }

    if (this.lastItems !== items) {
      this.lastItems = items;

      if (isObservable(items)) {
        this.sub?.unsubscribe();
        this.sub = items.subscribe(this.items$);
      }

      if (isArray(items)) {
        this.items$.next(items);
      }
    }

    return this.asyncPipe.transform(this.itemsSlice$);
  }

  ngOnDestroy(): void {
    this.items$?.complete();
    this.sub?.unsubscribe();
  }
}
