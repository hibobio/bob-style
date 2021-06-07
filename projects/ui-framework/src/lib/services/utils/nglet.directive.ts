/**
 *  *ngLet directive from ngrx-utils
 *  https://github.com/ngrx-utils/ngrx-utils/blob/master/libs/store/src/lib/directives/ngLet.ts
 *
 * <ng-container *ngLet="(someData$ | async) as someData">
 *    {{ someData }}
 * </ng-container>
 *
 * <ng-container *ngLet="{ one: someDataOne$ | async, two: someDataTwo$ | async } as data">
 *    {{ data?.one }} - {{ data?.two }}
 * </ng-container>
 *
 */

import {
  Directive,
  Input,
  NgModule,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

export class NgLetContext {
  $implicit: any = null;
  ngLet: any = null;
}

/**
 * Use to subscribe to observables in the template, instead of the **evil** `*ngIf="smth$|async as smth"` pattern.
 * You can provide fallbacks so that you don't have to use ? all the time.
 * ```ts
 * <ng-container *ngLet="(someData$ | async)||{} as someData">
 *    {{ someData.name }}
 * </ng-container>
 * ```
 * You can combine multiple observables in an object. Also works for non-observables, of course.
 * ```ts
 * <ng-container *ngLet="{ one: someRegularProp?.data||[], two: someDataTwo$|async } as data">
 *    {{ data.one[0] }} - {{ data.two }}
 * </ng-container>
 * ```
 *
 * .
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngLet]',
})
export class NgLetDirective implements OnInit {
  private _context = new NgLetContext();

  @Input()
  set ngLet(value: any) {
    this._context.$implicit = this._context.ngLet = value;
  }

  constructor(
    private _vcr: ViewContainerRef,
    private _templateRef: TemplateRef<NgLetContext>
  ) {}

  ngOnInit() {
    this._vcr.createEmbeddedView(this._templateRef, this._context);
  }
}

@NgModule({
  declarations: [NgLetDirective],
  exports: [NgLetDirective],
})
export class NgLetModule {}
