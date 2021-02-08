/*
 *ngFor="let c of oneDimArray | sortBy:'asc'"
 *ngFor="let c of arrayOfObjects | sortBy:'asc':'propertyName'"
 */
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { SortType } from '../../types';
import { arrOfObjSortByProp, isEmptyArray } from '../utils/functional-utils';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {
  transform(value: any[], dir: SortType = 'asc', key?: string): any[] {
    if (isEmptyArray(value) || !dir) {
      return value;
    }

    // sort 1d array
    if (!key) {
      if (dir === 'asc') {
        return value.slice().sort();
      } else {
        return value.slice().sort().reverse();
      }
    }

    return arrOfObjSortByProp(value.slice(), key, dir);
  }
}

@NgModule({
  imports: [],
  declarations: [SortByPipe],
  exports: [SortByPipe],
})
export class SortByPipeModule {}
