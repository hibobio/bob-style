import { NgModule, Pipe, PipeTransform, TrackByFunction } from '@angular/core';

import {
  asArray,
  isObject,
  isPrimitive,
  objectGetDeepestValid,
  objectStringID,
} from '../utils/functional-utils';

/**
 * Pipe to generate NgFor TrackBy identity function
 * @example
 * ```html
 * <ng-container *ngFor="let item of items; trackBy: ('id' | trackByProp)">
 * <ng-container *ngFor="let item of items; trackBy: (['type', 'id'] | trackByProp)">
 * ```
 * Can be used with a 'path':
 * ```html
 * <ng-container *ngFor="let ee of ees; trackBy: ('work.title' | trackByProp)">
 * ```
 * ( will return ee.work.title )
 *
 * .
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
      let xxx;

      xxx =
        propKeys === '$index'
          ? index
          : isPrimitive(item)
          ? `${index}__${item}`
          : isObject(item)
          ? asArray(propKeys)
              .map((key) => {
                const val = objectGetDeepestValid(item, key, index);
                return isPrimitive(val) ? val : objectStringID(val);
              })
              .join('__')
          : `${index}__${objectStringID(item)}`;

      if (propKeys === 'key') {
        console.log('trackByProp', xxx);
      }

      return xxx;
    };
  }
}

@NgModule({
  imports: [],
  declarations: [TrackByPropPipe],
  exports: [TrackByPropPipe],
})
export class TrackByPropModule {}
