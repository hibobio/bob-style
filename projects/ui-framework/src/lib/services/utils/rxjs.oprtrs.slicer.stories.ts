import { of, Subject } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { arrayOfNumbers } from './functional-utils';
import { debug } from './rxjs.operators';
import { slicer, timedSlice } from './rxjs.oprtrs.slicer';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const code1 = `prev$ = new Subject();
next$ = new Subject();

items$ = of( arrayOfNumbers(10,1) ).pipe(
    slicer(3, this.next$, this.prev$, {
        loop: true,
    })
);

<ng-container *ngFor="let itm of items$|async">
    {{ itm }}
</ng-container>

<button (click)="prev$.next()">prev</button>
<button (click)="next$.next()">next</button>`;

const code2 = `items$ = of(arrayOfNumbers(27, 1)).pipe(
    timedSlice(6, 1000, {
        loop: true,
        shuffle: 'auto',
    })
);

<ng-container *ngFor="let itm of items$|async">
    {{ itm }}
</ng-container>`;

@Component({
  selector: 'b-rxjs-operators',
  template: `
    <div class="brd pad-16">
      <div class="flx" style="flex-wrap:wrap; justify-content:space-between">
        <div class="flx-col flx-grow flx-center mrg-16">
          <h3>slicer</h3>

          <div class="flx flx-center">
            <button (click)="prev$.next()">&lt; prev</button>
            <h4
              class="brd pad-16 mrg-8"
              style="width: 120px; text-align: center;"
            >
              <ng-container *ngFor="let itm of itemsSliced$ | async">
                {{ itm }}
              </ng-container>
            </h4>
            <button (click)="next$.next()">next &gt;</button>
          </div>
        </div>

        <textarea
          class="brd pad-16 mrg-16"
          style="width: 350px; height:320px; resize: none; background: transparent;"
          >{{ code1 }}</textarea
        >
      </div>
    </div>

    <div class="brd pad-16 mrg-t-16">
      <div class="flx" style="flex-wrap:wrap; justify-content:space-between">
        <div class="flx-col flx-grow flx-center mrg-16">
          <h3>timedSlice</h3>

          <div class="flx flx-center">
            <h4
              class="brd pad-16 mrg-8"
              style="width: 100px; text-align: center;"
            >
              <ng-container
                *ngFor="let itm of itemsTimeSliced$ | async; let i = index"
              >
                {{ itm }} <br *ngIf="i == 2" />
              </ng-container>
            </h4>
          </div>
        </div>

        <textarea
          class="brd pad-16 mrg-16"
          style="width: 350px; height:250px; resize: none; background: transparent;"
          >{{ code2 }}</textarea
        >
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        text-align: center;
      }
    `,
  ],
  providers: [],
})
export class RxjsOperatorsComponent implements OnInit {
  constructor() {}

  code1 = code1;
  code2 = code2;

  prev$ = new Subject();
  next$ = new Subject();

  itemsSliced$ = of(arrayOfNumbers(10, 1)).pipe(
    slicer(3, this.next$, this.prev$, {
      loop: true,
      // shuffle: true,
    }),
    debug('itemsSliced$')
  );

  itemsTimeSliced$ = of(arrayOfNumbers(27, 1)).pipe(
    timedSlice(5, 1000, {
      loop: true,
      shuffle: 'auto',
    }),
    debug('itemsTimeSliced$')
  );

  ngOnInit() {}
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
<b-story-book-layout [title]="'RxJs: slicer / timedSlice'" style="background-color: rgb(247,247,247);">
    ${template}

</b-story-book-layout>
`;

const note = `
  ## RxJs: slicer / timedSlice

  #### slicer
  ~~~
${code1}
  ~~~

  #### timedSlice
  ~~~
${code2}
  ~~~

`;

story.add(
  'RxJs: slicer',
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
