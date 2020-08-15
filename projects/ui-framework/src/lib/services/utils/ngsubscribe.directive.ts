/**
 *  original idea: https://stackblitz.com/edit/ngsubscribe-full
 *  updated version: https://github.com/wardbell/ngx-subscribe
 *
 * Directive alternative to subscribing with AsyncPipe via *ngIf just to get the data
 *
 * Instead of <ng-container *ngIf="data$ | as data"> use:
 *
 * <ng-container *ngSubscribe="data$ as data">
 *    {{ data }}
 * </ng-container>
 *
 * <ng-container *ngSubscribe="[data1$, data2$] as allData">
 *    {{ allData[0] }} - {{ allData[1] }}
 * </ng-container>
 *
 * <ng-container *ngSubscribe="{data1: data1$, data2: data2$} as allData">
 *    {{ allData?.data1 }} - {{ allData?.data2 }}
 * </ng-container>
 *
 */

import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgModule,
} from '@angular/core';
import {
  combineLatest,
  EMPTY,
  isObservable,
  Observable,
  Subscription,
} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isArray, isPlainObject } from './functional-utils';

export class NgSubscribeContext {
  public $implicit: any = null;
  public ngSubscribe: any = null;
}

@Directive({
  selector: '[ngSubscribe]',
})
export class NgSubscribeDirective implements OnInit, OnDestroy {
  constructor(
    private viewContainer: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private templateRef: TemplateRef<any>
  ) {}

  private observable:
    | Observable<any>
    | Observable<any>[]
    | { [key: string]: Observable<any> };
  private context: NgSubscribeContext = new NgSubscribeContext();
  private subscription: Subscription;

  @Input()
  set ngSubscribe(
    inputObservable:
      | Observable<any>
      | Observable<any>[]
      | { [key: string]: any | Observable<any> }
  ) {
    //
    if (this.observable !== inputObservable) {
      this.observable = inputObservable;
      this.subscription?.unsubscribe();
      this.context.ngSubscribe = undefined;

      let innerObservable: Observable<any>;

      if (isObservable<any>(inputObservable)) {
        //
        innerObservable = inputObservable;
        //
      } else if (isArray<Observable<any>>(inputObservable)) {
        //
        innerObservable = combineLatest(inputObservable).pipe(startWith([]));
        //
      } else if (isPlainObject(inputObservable)) {
        //
        const { result, keys } = Object.keys(inputObservable).reduce(
          (acc, k) => {
            const o = inputObservable[k];

            if (isObservable<any>(o)) {
              acc.keys.push(k);
            } else {
              // assume this property is a static value.
              // will not change, even if you mutate inputObservable[k]
              acc.result[k] = o;
            }
            return acc;
          },
          {
            result: {},
            keys: [] as string[],
          }
        );

        innerObservable = combineLatest(
          keys.map((k) => inputObservable[k])
        ).pipe(
          map((values) =>
            keys.reduce((acc, k, i) => {
              acc[k] = values[i];
              return acc;
            }, result)
          ),
          startWith(result)
        );
        //
      } else {
        //
        innerObservable = EMPTY;
        //
      }

      this.subscription = innerObservable.subscribe((value) => {
        this.context.ngSubscribe = value;
        this.cdr.markForCheck();
      });
    }
  }

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}

@NgModule({
  declarations: [NgSubscribeDirective],
  exports: [NgSubscribeDirective],
})
export class NgSubscribeModule {}
