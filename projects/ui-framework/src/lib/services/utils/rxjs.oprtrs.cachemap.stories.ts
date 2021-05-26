import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { mockThings } from '../../mock.const';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { GenericObject } from '../../types';
import {
  cloneDeepSimpleObject,
  randomFromArray,
  stringify,
  unsubscribeArray,
} from './functional-utils';
import { cacheMap, cacheSwitchMap } from './rxjs.oprtrs.cachemap';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const code1 = `input$.pipe(
  cacheSwitchMap(
    (v) => apiGetSmth$(v)
  )
).subscribe()`;

const code2 = `input$.pipe(
  cacheMap(
    (v) => expensiveCalculation(v)
  )
).subscribe()`;

@Component({
  selector: 'b-rxjs-operators',
  template: `
    <div class="brd pad-16 grd-eq-2 gap-16 mrg-b-24">
      <div class="flx-grow">
        <h3 class="brd-b pad-b-8 mrg-b-16 mrg-t-0">cacheMap</h3>

        <strong>input:</strong>
        <div class="flx mrg-t-8">
          <button class="mrg-4" (click)="req2(5)">5</button>
          <button class="mrg-4" (click)="req2({ a: 6 })">
            {{ '{' }}a:6{{ '}' }}
          </button>
          <button class="mrg-4" (click)="req2([1, 2, 3])">[1,2,3]</button>
        </div>

        <div class="flx">
          <input
            hidden
            #reqInp2
            class="mrg-4"
            type="text"
            placeholder="req smth!"
          /><button class="mrg-4" (click)="req2(reqInp2.value)">
            something!
          </button>
        </div>
      </div>

      <textarea
        class="flx-grow brd pad-16"
        style="min-width: 250px; height:150px; resize: none; background: transparent;"
        >{{ code2 }}</textarea
      >

      <div class="flx-grow brd pad-4" style="border-color:red;">
        <strong class="mrg-4">map "expensive calculation" call log:</strong>
        <div
          class="brd pad-8 mrg-4"
          style="width: 200px; height:auto; resize: none; background: transparent; white-space:pre-line;"
          [innerHTML]="calcLog1frmtd$ | async"
        ></div>
      </div>

      <div class="flx-grow brd pad-4" style="border-color:green;">
        <strong class="mrg-4"
          ><u>cache</u>Map "expensive calculation" call log:</strong
        >
        <div
          class="brd pad-8 mrg-4"
          style="width: 200px; height:auto; resize: none; background: transparent; white-space:pre-line;"
          [innerHTML]="calcLog2frmtd$ | async"
        ></div>
      </div>
    </div>

    <div class="brd pad-16 grd-eq-2 gap-16">
      <div class="flx-grow">
        <h3 class="brd-b pad-b-8 mrg-b-16 mrg-t-0">cacheSwitchMap</h3>

        <strong>send "request":</strong>
        <div class="flx mrg-t-8">
          <button class="mrg-4" (click)="req1(5)">5</button>
          <button class="mrg-4" (click)="req1({ a: 6 })">
            {{ '{' }}a:6{{ '}' }}
          </button>
          <button class="mrg-4" (click)="req1([1, 2, 3])">[1,2,3]</button>
        </div>
        <div class="flx">
          <input
            hidden
            #reqInp1
            class="mrg-4"
            type="text"
            placeholder="req smth!"
          /><button class="mrg-4" (click)="req1(reqInp1.value)">
            something!
          </button>
        </div>
      </div>
      <textarea
        class="flx-grow brd pad-16"
        style="min-width: 250px; height:150px; resize: none; background: transparent;"
        >{{ code1 }}</textarea
      >

      <div class="flx-grow brd pad-4" style="border-color:red;">
        <strong class="mrg-4">switchMap "api" call log:</strong>
        <div
          class="brd pad-8 mrg-4"
          style="width: 200px; height:auto; resize: none; background: transparent; white-space:pre-line;"
          [innerHTML]="apiLog1frmtd$ | async"
        ></div>
      </div>

      <div class="flx-grow brd pad-4" style="border-color:green;">
        <strong class="mrg-4"><u>cache</u>SwitchMap "api" call log:</strong>
        <div
          class="brd pad-8 mrg-4"
          style="width: 200px; height:auto; resize: none; background: transparent; white-space:pre-line;"
          [innerHTML]="apiLog2frmtd$ | async"
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        text-align: left;
      }
    `,
  ],
  providers: [],
})
export class RxjsOperatorsComponent implements OnInit {
  code1 = code1;
  code2 = code2;
  subs: Subscription[] = [];

  cswApi$ = new Subject<any>();
  apiLog1$ = new BehaviorSubject<GenericObject>({});
  apiLog2$ = new BehaviorSubject<GenericObject>({});
  apiLog1frmtd$: Observable<string>;
  apiLog2frmtd$: Observable<string>;

  cwCalc$ = new Subject<any>();
  calcLog1$ = new BehaviorSubject<GenericObject>({});
  calcLog2$ = new BehaviorSubject<GenericObject>({});
  calcLog1frmtd$: Observable<string>;
  calcLog2frmtd$: Observable<string>;

  rndmReqs = mockThings(5).concat([5, { a: 6 }, [1, 2, 3]]);

  req1(what: any) {
    this.cswApi$.next(
      cloneDeepSimpleObject(what || randomFromArray(this.rndmReqs))
    );
  }
  req2(what: any) {
    this.cwCalc$.next(
      cloneDeepSimpleObject(what || randomFromArray(this.rndmReqs))
    );
  }

  ngOnInit() {
    const action = <T = GenericObject>(log: T, smth: any) => {
      const key = stringify(smth).replace(/\s+/g, '');
      return { [key]: (log[key] || 0) + 1 } as T;
    };

    const calculator = <T = GenericObject>(log$: BehaviorSubject<T>) => (
      smth: any
    ): T => action(log$.getValue(), smth);

    const mapper = <T = GenericObject>(log$: BehaviorSubject<T>) => (
      smth: any
    ): Observable<T> => of(action(log$.getValue(), smth));

    const combiner = <T = GenericObject>(log$: BehaviorSubject<T>) => (
      smth: T
    ): T => ({
      ...log$.getValue(),
      ...smth,
    });

    const formatter = (log: GenericObject): string => {
      return stringify(log)
        .replace(/([:}][^,{}]+),/g, '$1\n')
        .replace(/^{\s*|\s*}$/g, '');
    };

    this.subs.push(
      this.cswApi$
        .pipe(switchMap(mapper(this.apiLog1$)), map(combiner(this.apiLog1$)))
        .subscribe(this.apiLog1$),

      this.cswApi$
        .pipe(
          cacheSwitchMap(mapper(this.apiLog2$)),
          map(combiner(this.apiLog2$))
        )
        .subscribe(this.apiLog2$),

      this.cwCalc$
        .pipe(map(calculator(this.calcLog1$)), map(combiner(this.calcLog1$)))
        .subscribe(this.calcLog1$),

      this.cwCalc$
        .pipe(
          cacheMap(calculator(this.calcLog2$)),
          map(combiner(this.calcLog2$))
        )
        .subscribe(this.calcLog2$)
    );

    this.apiLog1frmtd$ = this.apiLog1$.pipe(map(formatter));
    this.apiLog2frmtd$ = this.apiLog2$.pipe(map(formatter));

    this.calcLog1frmtd$ = this.calcLog1$.pipe(map(formatter));
    this.calcLog2frmtd$ = this.calcLog2$.pipe(map(formatter));
  }

  ngOnDestroy() {
    unsubscribeArray(this.subs);
  }
}

@NgModule({
  declarations: [RxjsOperatorsComponent],
  imports: [CommonModule],
  exports: [RxjsOperatorsComponent],
})
export class RxjsOperatorsModule {}

const template = `
<b-rxjs-operators></b-rxjs-operators>
`;

const storyTemplate = `
<b-story-book-layout [title]="'RxJs: cacheMap / cacheSwitchMap'" style="background-color: rgb(247,247,247);">
    ${template}

</b-story-book-layout>
`;

const note = `
  ## RxJs: cacheMap / cacheSwitchMap

  ### cacheMap / CacheSwitchMapConfig

  \`cacheMap\` is like \`map\` operator, except it caches mapping results.<br>
  takes mapper function: \`(val: T) => R\`

  \`cacheSwitchMap\` is like \`switchMap\` operator, except it caches switch-mapping results.<br>
  takes mapper function: \`(val: T) => Observable<R>\`

  Internal cache (instance of \`SimpleCache\`) stores max 20 items for max 15 min, configurable.<br>
  After the stream has no more subscriptions, cache is cleared.

  **Additional (optional) arguments:** <br>
  <u>trackBy</u>: \`(val: T) => K\` - function to get unique id from value<br>
  <u>ignoreEmpty</u>: \`boolean\` - if true, will ignore empty & falsy values (except 0 and '')<br>
  <u>capacity</u>: \`number\` - max size of cache (defaults to 20)<br>
  <u>TTL</u>: \`number\` - time to live, in ms. items in cache expire after this time. if item is requested, expiration timer resets.<br>
  <u>clearCacheOnComplete</u>: \`boolean\` - if cache should be cleared when there are no more subsciptions to the stream (useful when you pass your own dataCache).<br>
  <u>dataCache</u>: \`Map<K, R | Observable<R>>\` - you can pass your own Map that will be used for cache store - for example to share cache between streams, or to store it on the component - in this case you can set \`TTL\` to null and \`clearCacheOnComplete\` to false


  ~~~
  this.cached$ = this.source$.pipe(
    cacheMap<number, string>((num) => {
      return this.mapStringToNumber(num); // sync mapper
    })
  );

  this.cached$ = this.source$.pipe(
    cacheMap<number, string>({
        mapper: (num) => this.mapStringToNumber(num), // sync mapper
        ignoreEmpty: true, // will ignore empty & falsey (except 0 & '')
      })
  );

  this.cached$ = this.source$.pipe(
    cacheSwitchMap<number, string>((num) => {
          return this.getStringFromNumber$(num); // async
        })
  );

  this.cached$ = this.source$.pipe(
    cacheSwitchMap<number, string>({
        mapper: (num) => {
          return this.getStringFromNumber$(num);  // async
        },
        ignoreEmpty: true, // will ignore empty & falsey (except 0 & '')
      })
  );
  ~~~



`;

story.add(
  'RxJs: cacheMap',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        declarations: [],
        imports: [StoryBookLayoutModule, RxjsOperatorsModule],
        entryComponents: [],
      },
    };
  },
  { notes: { markdown: note } }
);
