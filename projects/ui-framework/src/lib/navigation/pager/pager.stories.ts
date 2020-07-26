import { storiesOf } from '@storybook/angular';
import { boolean, object, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { arrayOfNumbers } from '../../services/utils/functional-utils';
import { PagerModule } from './pager.module';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs';

const story = storiesOf(ComponentGroupType.Navigation, module).addDecorator(
  withKnobs
);

const template = `<b-pager  [items]="items"
            [currentPage]="currentPage"
            [config]="config"
            (pageChange)="onPageChange($event)"
            (sliceChange)="onSliceChange($event)"
            (sliceSizeChange)="onSliceSizeChange($event)">
</b-pager>`;

const storyTemplate = `
<b-story-book-layout [title]="'Pager'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Pager

  #### Module
  *PagerModule*

  ~~~
  ${template}
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

  #### Usage examples

  ~~~
  <ng-container *ngFor="let item of itemsSlice">
    <item-component [item]="item"></item-component>
  </ng-container>

  <b-pager [items]="itemsDataArray" (sliceChange)="itemsSlice = $event"></b-pager>
  ~~~

  ~~~
  <ng-container *ngIf="currentSlice">
    <ng-container *ngFor="let item of itemsDataArray | slice : currentSlice[0] : currentSlice[1]">
      <item-component [item]="item"></item-component>
    </ng-container>
  </ng-container>

  <b-pager [items]="itemsDataArray.length" (sliceChange)="currentSlice = $event"></b-pager>
  ~~~

  #### interface: PagerConfig
  Name | Type | Description
  --- | --- | ---
  sliceSize | number | current items per page
  sliceMax | number | max items per page
  sliceStep | number | items per page step for items-per-page Select

  #### const: PAGER<sub>-</sub>CONFIG<sub>-</sub>DEF
  ~~~
  const PAGER_CONFIG_DEF: PagerConfig = {
    sliceStep: 25,
    sliceMax: 100,
    sliceSize: 50,
  };
  ~~~


`;

const itemsNumber = 45;
const itemsMock: number[] = arrayOfNumbers(itemsNumber) as number[];

story.add(
  'Pager',
  () => {
    return {
      template: storyTemplate,
      props: {
        currentPage: number('currentPage', 2),
        items: object('items', itemsMock),
        config: object('config', {
          sliceStep: 25,
          sliceMax: 100,
          sliceSize: 50,
        }),
        onSliceChange: action('sliceChange'),
        onPageChange: action('pageChange'),
        onSliceSizeChange: action('sliceSizeChange'),
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, PagerModule],
      },
    };
  },
  { notes: { markdown: note } }
);
