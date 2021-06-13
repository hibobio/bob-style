import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { boolean, number, object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { mockThings } from '../../mock.const';
import { arrayOfNumbers } from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { PagerModule } from './pager.module';

const story = storiesOf(ComponentGroupType.Navigation, module).addDecorator(
  withKnobs
);

const templateForNotes = `<b-pager  [items]="items"
            [currentPage]="currentPage"
            [config]="config"
            (pageChange)="onPageChange($event)"
            (sliceChange)="onSliceChange($event)"
            (stateChange)="onStateChange($event)"
            (sliceSizeChange)="onSliceSizeChange($event)">
</b-pager>`;

const storyTemplate = `
<b-story-book-layout [title]="'Pager'">
  <div>

    <div class="mrg-b-24" style="min-height:130px;">
      <ul class="reset-list flx flx-wrap" style="font-size:8px; line-height:1;">
        <li class="brd rounded" style="padding: 1px 2px; margin: 2px;" *ngFor="let item of (items$ | pager:pager)">
          {{item}}
        </li>
      </ul>
    </div>

        <b-pager #pager
                [config]="{
                  sliceStep: config.sliceStep,
                  sliceMax: config.sliceMax,
                  sliceSize: config.sliceSize,
                  showSliceSizeSelect: showSliceSizeSelect,
                  resetOnSliceSizeChange: resetOnSliceSizeChange
                }"
                (pageChange)="onPageChange($event)"
                (sliceChange)="onSliceChange($event)"
                (stateChange)="onStateChange($event)"
                (sliceSizeChange)="onSliceSizeChange($event)">
    </b-pager>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Pager

  #### Module
  *PagerModule*

  ~~~
  ${templateForNotes}
  ~~~

  #### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [config] | PagerConfig | pages/slices config (see interface details below) | PAGER<sub>-</sub>CONFIG<sub>-</sub>DEF
  [items] | number / any[] | if number is provided, this is considered as 'items length';<br>\
  you can also provide your original data array | []
  [currentPage] | number | sets current page (by zero-based index) | 0
  (pageChange) | number | emits current page zero-based index | &nbsp;
  (sliceChange) |  EventEmitter<wbr>&lt;number[] / any[]&gt; | if a number was provided for [items] (that is considered to be your items array length), the output emits current slice indexes;<br>\
  if you provided your data array as [items], the output emits a slice of your data array ('current page items') | &nbsp;
  (sliceSizeChange) | number | emits on slice size change (from the Select) | &nbsp;
  (stateChange) | PagerState | combination of currentPage, slice, sliceSize, offset | &nbsp;

  --------------------------------

  ### Usage examples


  #### Connect everything automatically with PagerPipe

  ~~~
  public pager: PagerComponent;

      /* ! items can also be observable items$ ! */
  <ng-container *ngFor="let item of items | pager:pager">
    <some-component [item]="item"></some-component>
  </ng-container>

  <b-pager #pager [config]="pagerConfig"></b-pager>
  ~~~

  #### Manual connections

  ~~~
  <ng-container *ngFor="let item of itemsSlice">
    <some-component [item]="item"></some-component>
  </ng-container>

  <b-pager [items]="itemsDataArray" [config]="pagerConfig"
        (sliceChange)="itemsSlice = $event"></b-pager>
  ~~~
  ~~~
  <ng-container *ngIf="currentSlice">
    <ng-container *ngFor="let item of itemsDataArray | slice : currentSlice[0] : currentSlice[1]">
      <some-component [item]="item"></some-component>
    </ng-container>
  </ng-container>

  <b-pager [items]="itemsDataArray.length" [config]="pagerConfig"
        (sliceChange)="currentSlice = $event"></b-pager>
  ~~~

  #### interface: PagerState
  Name | Type | Description
  --- | --- | ---
  currentPage | number | current page
  currentSlice | number[] | current slice [start inclusive index, end exclusive index]
  sliceSize | number | current slice size; limit (API usage)
  offset | number | offset (API usage)

  #### interface: PagerConfig
  Name | Type | Description | Default
  --- | --- | --- | ---
  sliceSize | number | current items per page | &nbsp;
  sliceMax | number | max items per page | &nbsp;
  sliceStep | number | items per page step for items-per-page Select | &nbsp;
  resetOnSliceSizeChange | boolean | should reset to first page on slice size change | false

  #### const: PAGER<sub>-</sub>CONFIG<sub>-</sub>DEF
  ~~~
  const PAGER_CONFIG_DEF: PagerConfig = {
    sliceStep: 25,
    sliceMax: 100,
    sliceSize: 50,
  };
  ~~~


`;

const itemsNumber = 145;
const things = mockThings();
const itemsMock = arrayOfNumbers(itemsNumber).map((_, n) => {
  const item = things[n % things.length].toLowerCase();
  return (
    n +
    1 +
    ' ' +
    (n === 0 && item.endsWith('s')
      ? things
          .slice()
          .reverse()
          .find((i) => !i.endsWith('s'))
          .toLowerCase()
      : item) +
    (n !== 0 && ['h', 'x', 'ss'].some((e) => item.endsWith(e))
      ? 'es'
      : n !== 0 && !item.endsWith('s')
      ? 's'
      : '')
  );
});

const itemsMock$ = of(itemsMock).pipe(delay(500));

story.add(
  'Pager',
  () => {
    return {
      template: storyTemplate,
      props: {
        currentPage: number('currentPage', 2),
        itemsNotes: object('items', itemsMock),
        items$: itemsMock$,
        config: object('config', {
          sliceStep: 25,
          sliceMax: 100,
          sliceSize: 50,
        }),

        showSliceSizeSelect: boolean('showSliceSizeSelect', true),
        resetOnSliceSizeChange: boolean('resetOnSliceSizeChange', false),

        onSliceChange: action('sliceChange'),
        onPageChange: action('pageChange'),
        onSliceSizeChange: action('sliceSizeChange'),
        onStateChange: action('stateChange'),
      },
      moduleMetadata: {
        imports: [
          CommonModule,
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          PagerModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
