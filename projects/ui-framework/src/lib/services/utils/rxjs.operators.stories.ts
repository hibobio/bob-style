import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { interval, Observable, of, Subject, Subscription } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Component, NgModule, OnInit } from '@angular/core';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {
  randomFromArray,
  randomNumber,
  unsubscribeArray,
} from './functional-utils';
import { cacheMap, cacheSwitchMap } from './rxjs.oprtrs.cachemap';
import { CommonModule } from '@angular/common';
import { debug } from './rxjs.operators';
import { ColorPaletteService } from '../color-service/color-palette.service';
import { PalletteColorSet } from '../color-service/color-palette.enum';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

@Component({
  selector: 'b-rxjs-operators',
  template: `
    <div class="brd pad-16 mrg-16">
      <p>
        CacheMap example: <br />
        {{ cacheMapLog }}<br />
        {{ cacheMapLog2 }}
      </p>
      <div class="flx">
        <button class="mrg-r-8" type="button" (click)="subscToCacheMap()">
          start
        </button>
        <button type="button" (click)="unSubscToCacheMap()">stop</button>
      </div>
    </div>

    <div class="brd pad-16 mrg-16">
      <p>
        CacheSwitchMap example: <br />
        {{ cacheSwitchMapLog }}<br />
        {{ cacheSwitchMapLog2 }}
      </p>
      <div class="flx">
        <button class="mrg-r-8" type="button" (click)="subscToCacheSwitchMap()">
          start
        </button>
        <button type="button" (click)="unSubscToCacheSwitchMap()">stop</button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        width: 350px;
        padding: 16px;
        border: 1px solid black;
        text-align: left;
      }
    `,
  ],
  providers: [],
})
export class RxjsOperatorsComponent implements OnInit {
  constructor(private cps: ColorPaletteService) {}

  interval$: Observable<number> = interval(1000);
  cacheMapped$: Observable<string>;
  cacheSwitchMapped$: Observable<string>;
  cacheMapLog = '';
  cacheMapLog2 = '';
  cacheSwitchMapLog = '';
  cacheSwitchMapLog2 = '';
  subs1: Subscription[] = [];
  subs2: Subscription[] = [];
  cache = new Map();

  counter1 = -1;
  counter2 = -1;

  done$ = new Subject();

  counters = {};

  colorPaletteGenerator = this.cps.paletteColorGenerator(PalletteColorSet.set1);

  ngOnInit() {
    const falsyValues = [null, undefined, {}, [], 0, ''];

    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 4, 6, 8, 10];

    this.cacheMapped$ = this.interval$.pipe(
      filter(() => {
        if (this.counter1 >= values.length - 1) {
          this.done$.next(1);
          return false;
        }
        return true;
      }),
      map(() => {
        return randomNumber(1, 100) > 70
          ? randomFromArray(falsyValues)
          : (() => {
              return values[++this.counter1];
            })();
      }),
      cacheMap<number, string>({
        mapper: (num) => '-' + num,
        ignoreEmpty: true,
      })
    );

    const mapper$ = (num: number) => {
      return of('-' + String(num));
    };

    this.cacheSwitchMapped$ = this.interval$.pipe(
      filter(() => {
        if (this.counter2 >= values.length - 1) {
          this.done$.next(1);
          return false;
        }
        return true;
      }),
      map(() => {
        return randomNumber(1, 100) > 70
          ? randomFromArray(falsyValues)
          : (() => {
              return values[++this.counter2];
            })();
      }),
      cacheSwitchMap<number, string>({
        mapper: (num) => {
          return mapper$(num);
        },
        ignoreEmpty: true,
      })
    );
  }

  subscToCacheMap() {
    this.counter1 = -1;

    this.subs1.push(
      this.cacheMapped$
        .pipe(
          debug('cacheMapped sub 1', {
            color: this.colorPaletteGenerator.next(),
          }),
          takeUntil(this.done$)
        )
        .subscribe((v) => {
          this.cacheMapLog += v;
        })
    );

    setTimeout(() => {
      this.subs1.push(
        this.cacheMapped$
          .pipe(
            debug('cacheMapped sub 2', {
              color: this.colorPaletteGenerator.next(),
            }),
            takeUntil(this.done$)
          )
          .subscribe((v) => {
            this.cacheMapLog2 += v;
          })
      );
    }, 1000);
  }
  unSubscToCacheMap() {
    unsubscribeArray(this.subs1);
  }

  subscToCacheSwitchMap() {
    this.counter2 = -1;

    this.subs2.push(
      this.cacheSwitchMapped$
        .pipe(
          debug('cacheSwitchMapped sub 1', {
            color: this.colorPaletteGenerator.next(),
          }),
          takeUntil(this.done$)
        )
        .subscribe((v) => {
          this.cacheSwitchMapLog += v;
        })
    );

    setTimeout(() => {
      this.subs2.push(
        this.cacheSwitchMapped$
          .pipe(
            debug('cacheSwitchMapped sub 2', {
              color: this.colorPaletteGenerator.next(),
            }),
            takeUntil(this.done$)
          )
          .subscribe((v) => {
            this.cacheSwitchMapLog2 += v;
          })
      );
    }, 1000);
  }
  unSubscToCacheSwitchMap() {
    unsubscribeArray(this.subs2);
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
<b-story-book-layout [title]="'RxJs Operators'" style="background-color: rgb(247,247,247);">
    ${template}

</b-story-book-layout>
`;

const note = `
  ## RxJs Operators

  ### cacheMap / CacheSwitchMapConfig

  \`cacheMap\` is like \`map\` operator, except it caches mapping results.
  takes mapper function: \`(val: T) => R\`

  \`cacheSwitchMap\` is like \`switchMap\` operator, except it caches switch-mapping results.
  takes mapper function: \`(val: T) => Observable<R>\`

  Internal cache (instance of \`SimpleCache\`) stores max 20 items for max 15 min, configurable.
  After the stream has no more subscriptions, cache is cleared.

  **Additional (optional) arguments:**
  trackBy: \`(val: T) => K\` - function to get unique id from value
  ignoreEmpty: \`boolean\` - if true, will ignore empty & falsy values (except 0 and '')
  capacity: \`number\` - max size of cache (defaults to 20)
  TTL: \`number\` - time to live, in ms. items in cache expire after this time. if item is requested, expiration timer resets.
  clearCacheOnComplete: \`boolean\` - if cache should be cleared when there are no more subsciptions to the stream (useful when you pass your own dataCache).
  dataCache: \`Map<K, R | Observable<R>>\` - you can pass your own Map that will be used for cache store - for example to share cache between streams, or to store it on the component - in this case you can set \`TTL\` to null and \`clearCacheOnComplete\` to false


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
  'RxJs Operators',
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
