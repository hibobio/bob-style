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
import { CompactSearchComponent } from '../compact-search/compact-search.component';
import { SearchComponent } from './search.component';
import { search } from './search.operator';

@Pipe({ name: 'search', pure: false })
export class SearchPipe<T = any> implements PipeTransform, OnDestroy {
  constructor(private cd: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(cd);
  }
  private asyncPipe: AsyncPipe;
  private sub: Subscription;

  private items$: BehaviorSubject<T[]> = new BehaviorSubject(undefined);
  private itemsFiltered$: Observable<T[]>;

  transform(
    items: T[] | Observable<T[]>,
    searchCmpnt: SearchComponent | CompactSearchComponent,
    searchPath?: string,
    minLength?: number
  ): T[] {
    if (
      (!isArray(items) && !isObservable(items)) ||
      !searchCmpnt?.searchChange
    ) {
      return;
    }

    if (!this.itemsFiltered$) {
      this.itemsFiltered$ = this.items$.pipe(
        search(searchCmpnt, searchPath, minLength),
        shareReplay(1)
      );
    }

    if (isObservable(items)) {
      this.sub?.unsubscribe();
      this.sub = items.subscribe(this.items$);
    }

    if (isArray(items)) {
      this.items$.next(items);
    }

    return this.asyncPipe.transform(this.itemsFiltered$);
  }

  ngOnDestroy(): void {
    this.items$?.complete();
    this.sub?.unsubscribe();
  }
}
