import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { log } from '../../services/utils/logger';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { MasonryTestModule } from './masonry-test.component';
import { masonryCardsMock } from './masonry.mock';
import { MasonryLayoutModule } from './masonry.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template1 = `<b-masonry-layout #masonry [config]="{
          columns: columns,
          columnWidth: columnWidth,
          gap: gap
        }"
      (masonryItemsChanged)="onMasonryItemsChanged($event)"
      [debug]="debug">

    <b-masonry-item *ngFor="let card of cards">
      <b-masonry-test-card  [card]="card">
      </b-masonry-test-card>
    </b-masonry-item>


</b-masonry-layout>

<div style="margin: 30px auto;">
    <button (click)="masonry.init()" type="button">init</button>
    <button (click)="masonry.destroy()" type="button">destroy</button>
    <button (click)="cards = cards.concat(masonryCardsMock())" type="button">more data</button>
</div>

`;

const templateForNotes = `<b-masonry-layout [config]="config">

    <b-masonry-item *ngFor="let card of cards">

      <b-card [card]="card"></b-card>

    </b-masonry-item>

</b-masonry-layout>`;

const storyTemplate = `
<b-story-book-layout [title]="'Masonry Layout'">

  ${template1}

</b-story-book-layout>
`;

const note = `
  ## Masonry Layout Component <br><span style="font-size:85%">+ Masonry Item Component</span>

  #### Module
  *MasonryLayoutModule*

  ~~~
  ${templateForNotes}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [config] | MasonryConfig | defaults to 3 columns with 16px gap


  #### interface: MasonryConfig
  Name | Type | Description | Default value
  --- | --- | --- | ---
  columns | number | fixed number of equal-width colums in rows | 3
  columnWidth | number | min-width of column (number of columns in row will be automatic)<br>\
    Note: If columns prop is provided, columnWidth is ignored. | &nbsp;
  gap | number | spacing between cells | 16

  #### public methods (just is case)
  Name | Description
  --- | ---
  init() | (re)initialize Masonry Layout
  destroy() | This will add \`single-column\` class on host element (which will remove the masonry layout) + remove masonry-related inline CSS on items + stop all observers/listeners.

  ------------------------

  #### Note

  - You should always use \`b-masonry-item\` component as a wrapper for your actual item.
  - \`b-masonry-item\`'s should be direct children of \`b-masonry-layout\`
  - \`b-masonry-item\` should have only 1 child

  ------------------------

  #### How it works

  Masonry Layout component uses CSS grid for layout, but to achieve the masonry look (various height elements positioned sequentially in rows - which is the main challenge, as opposed to positioning such items in columns, which is very easy), it sets row height (with grid-auto-rows CSS property) to 1px and then adjusts it via JS for each of the items to fit the actual height of the item (with grid-row-end CSS property). Every time DOM or width of the host element or screen size changes, the height for each item needs to be recalculated and the CSS updated.

  To watch for and react to changes, masonry Layout component uses MutationObserver and ResizeObserver on its host element. Whenever width of the host element, or DOM of its contents is changed  (text changes, elements added/removed), the items CSS is recalculated/updated.
  Additionally MutationObserver watches for certain html attribute changes - for example \`src\` on &lt;img&gt; and some special ones - see below.

  #### Triggering Masonry update for an item

  Sometimes you may need to make sure that the Masonry Layout component updates the item's height. Basically this may only be needed, when you change something that affects item's height, and its not text and/or DOM elements being added/removed.
  For example, some classes that change CSS dimentions of something.
  Another example is images. Once they load they may change the height of the item, but the DOM does not change, so MutationObserver watcher is not trigger and layout is not updated.
  To tell Masonry Layout that an item is updated, change one of these attributes: \`data-loaded\`, \`data-updated\` on any of the item's elements. The value does not matter, it just needs to change - incrementing some counter there is enough to trigger MutationObserver and the updaye of the item's height.

  Example to update Masonry on image load:

  \`\`\`
  <img #imgEl [src]="img$ | async" />

  @ViewChild('imgEl') imgEl: ElementRef;

  ngOnInit(): void {
     this.img$ = this.getImageSourseObservable().pipe(
      tap(() => {
        const imageEl = this.imgEl?.nativeElement;

        if (imageEl) {
          imageEl.addEventListener('load', () => {
            imageEl.setAttribute('data-loaded', 'true');
          });
        }
      })
    );
  }
  \`\`\`

`;

story.add(
  'Masonry Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        cards: masonryCardsMock(),
        masonryCardsMock: masonryCardsMock,
        columns: number('columns', undefined),
        columnWidth: number('columnWidth', 250),
        gap: number('gap', 16),
        debug: boolean('debug', false),

        onMasonryItemsChanged: (event) => {
          log.inf(event, 'masonryItemsChanged');
        },
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          MasonryLayoutModule,
          MasonryTestModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
