import { Observable } from 'rxjs/internal/Observable';
import { map, shareReplay } from 'rxjs/operators';

import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';

import { isNumber } from '../../services/utils/functional-utils';
import { PagerComponent } from './pager.component';

@Pipe({ name: 'pager', pure: false })
export class PagerPipe implements PipeTransform {
  constructor(private cd: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(cd);
  }

  private asyncPipe: AsyncPipe;
  private sliceChange: Observable<number[]>;

  transform<T = any>(items: T[], pager: PagerComponent<T>): T[] {
    if (!this.sliceChange) {
      this.sliceChange = (pager?.sliceChange as Observable<number[]>)?.pipe(
        shareReplay(1)
      );
    }
    if (
      items?.length &&
      (!pager.items || (isNumber(pager.items) && pager.items !== items.length))
    ) {
      pager.items = items.length;
    }

    return this.asyncPipe.transform(
      this.sliceChange.pipe(map((slice: number[]) => items.slice(...slice)))
    );
  }
}
