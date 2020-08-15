import { NgModule, Pipe, TrackByFunction } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { asArray } from '../utils/functional-utils';

/**
 * Pipe to generate NgFor TrackBy identity function
 *
 * <ng-container *ngFor="let item of items; trackBy: ('id' | trackByProp)"
 * <ng-container *ngFor="let item of items; trackBy: (['type', 'id'] | trackByProp)"
 *
 */

@Pipe({
  name: 'trackByProp',
  pure: true,
})
export class TrackByPropPipe implements PipeTransform {
  //
  public transform(
    propKeys: '$index' | string | string[]
  ): TrackByFunction<any> {
    //

    return function <T = any>(index: number, item: T): any {
      return propKeys === '$index'
        ? index
        : asArray(propKeys)
            .map((key) => item[key])
            .join('|');
    };
  }
}

@NgModule({
  imports: [],
  declarations: [TrackByPropPipe],
  exports: [TrackByPropPipe],
})
export class TrackByPropModule {}
