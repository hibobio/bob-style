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
  NgModule,
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';

export class NgLetContext {
  $implicit: any = null;
  ngLet: any = null;
}

@Directive({
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
