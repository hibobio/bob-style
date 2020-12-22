import { storiesOf } from '@storybook/angular';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { GridLayoutExampleModule } from './grid-layout-example.module';
import { GridItemClass, GridContainerClass } from './grid-layout.enum';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);
const story2 = storiesOf(ComponentGroupType.HtmlCss, module).addDecorator(
  withKnobs
);

const template = `
<b-grid-layout-example
[containerClass]="contGapClass"
[itemsClasses]="[
  element1contGap + (element1newRow ? ' row-start' : '') + (element1pushRight ? ' push-right' : ''),
  element2contGap + (element2newRow ? ' row-start' : '') + (element2pushRight ? ' push-right' : ''),
  element3contGap + (element3newRow ? ' row-start' : '') + (element3pushRight ? ' push-right' : ''),
  element4contGap + (element4newRow ? ' row-start' : '') + (element4pushRight ? ' push-right' : ''),
  element5contGap + (element5newRow ? ' row-start' : '') + (element5pushRight ? ' push-right' : ''),
  element6contGap + (element6newRow ? ' row-start' : '') + (element6pushRight ? ' push-right' : '')
]"

></b-grid-layout-example>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Grid Layout'">
  <div style="max-width: none;">${template}</div>
</b-story-book-layout>
`;

const note = `
  ## Grid Layout

~~~
<div class="grid-layout-12-cols row-gap">

    <div class="col-2-thirds"> 2/3 </div>
    <div class="col-third"> 1/3 </div>

    <div class="col-quarter"> 1/4 </div>
    <div class="col-3-quarters"> 3/4 </div>

    <div class="col-half"> 1/2 </div>
    <div class="col-half"> 1/2 </div>

</div>
~~~

~~~
<div class="grid-layout-12-cols">

    <div class="col-sm-8 col-md-6 col-lg-3"> some thing </div>
    <div class="col-sm-4 col-md-6 col-lg-3"> other thing </div>

</div>
~~~

  #### Classes Enums
  Classnames also available as enums: \`GridContainerClass\` & \`GridItemClass\`;

  #### Container classes
  By default, container with class \`grid-layout-12-cols\` has column-gap (spacing between columns) of 24px.

  Name | Description
  --- | ---
  <span style="white-space:nowrap;">grid-layout-12-cols</span> | Container should always have this class.
  &nbsp; | &nbsp;
  row-gap | Adds row-gap (spacing between rows) of 24px
  no-row-gap | Removes row-gap (spacing between rows)
  no-col-gap | Removes column-gap (spacing between columns)
  no-gap | Removes all gaps
  &nbsp; | &nbsp;

  #### Column classes
  By default, a child of \`grid-layout-12-cols\`, without extra classes, takes full width of container.

  Name | Description
  --- | ---
  col-1...<br>col-12 | *All resolutions / mobile*<br>Sets column width to 1/12 to 12/12 of \
  container width.<br>If some col-NN-X classes are also applied, this becomes mobile (default) layout.
  <span style="white-space:nowrap;">col-sm-1...</span><br><span style="white-space:nowrap;">col-sm-12</span> | *Not mobile*<br>Sets column width to 1/12 to 12/12 of container width - when the screen width is **&gt;=768px**.<br>\
  Below 768px, the column will be full width by default (unless col-X class is applied).
  col-md-1...<br>col-md-12 | *Small desktop*<br>Sets column width to 1/12 to 12/12 of container width - when the screen width is **&gt;=992px**.<br>\
  Below 992px, the column will be full width by default (unless col-X or col-sm-X class is applied).
  col-lg-1...<br>col-lg-12 | *Desktop*<br>Sets column width to 1/12 to 12/12 of container width - when the screen width is **&gt;=1200px**.<br>\
  Below 1200px, the column will be full width by default (unless col-X, col-md-X or col-sm-X class is applied).
  &nbsp; | &nbsp;
  col-quarter,<br>col-*NN*-quarter | same as \`col-3\` & \`col-NN-3\` (1/3 width)
  col-third,<br>col-*NN*-third | same as \`col-4\` & \`col-NN-4\` (1/3 width)
  col-half,<br>col-*NN*-half | same as \`col-6\` & \`col-NN-6\` (1/2 width)
  col-2-thirds,<br>col-*NN*-2-thirds | same as \`col-8\` & \`col-NN-8\` (2/3 width)
  <span style="white-space:nowrap;">col-3-quarters,</span><br><span style="white-space:nowrap;">col-*NN*-3-quarters</span> | same as \`col-9\` & \`col-NN-9\` (3/4 width)
  col-full,<br>col-*NN*-full | same as \`col-12\` & \`col-NN-12\` (full width)
  &nbsp; | &nbsp;
  row-start | element with this class will create a new row (will start from new line)
  &nbsp; | &nbsp;
  push-right | element with this class will move to the end of the row \
  (to rightmost position), possibly adding white space before itself.<br>\
  \`push-right\` overrides \`row-start\`. Having both classes will not start (break to)\
   a new row, unless the prevous row is complete, BUT \`push-right\` moves the next item to new row\
    (there will always be a line break after \`push-right\` item).
`;

const colClasses = [
  'col-1',
  'col-2',
  'col-3',
  'col-4',
  'col-5',
  'col-6',
  'col-7',
  'col-8',
  'col-9',
  'col-10',
  'col-11',
  'col-12',
  ...Object.values(GridItemClass).filter(
    (i) => i !== GridItemClass.rowStart && i !== GridItemClass.pushRight
  ),
];

const colClassDef = GridItemClass.third;

const containerGapClasses = [
  '',
  ...Object.values(GridContainerClass).filter(
    (i) => i !== GridContainerClass.container
  ),
];

const toAdd = () => {
  return {
    template: storyTemplate,
    props: {
      contGapClass: select('Container gap', containerGapClasses, 'row-gap'),

      element1contGap: select(
        'Elem 1 class',
        colClasses,
        GridItemClass.twoThirds
      ),
      element1newRow: boolean('Elem 1 row-start', false),
      element1pushRight: boolean('Elem 1 push-right', false),

      element2contGap: select('Elem 2 class', colClasses, GridItemClass.third),
      element2newRow: boolean('Elem 2 row-start', false),
      element2pushRight: boolean('Elem 2 push-right', false),

      element3contGap: select(
        'Elem 3 class',
        colClasses,
        GridItemClass.quarter
      ),
      element3newRow: boolean('Elem 3 row-start', false),
      element3pushRight: boolean('Elem 3 push-right', false),

      element4contGap: select(
        'Elem 4 class',
        colClasses,
        GridItemClass.twoThirds
      ),
      element4newRow: boolean('Elem 4 row-start', false),
      element4pushRight: boolean('Elem 4 push-right', true),

      element5contGap: select('Elem 5 class', colClasses, GridItemClass.half),
      element5newRow: boolean('Elem 5 row-start', false),
      element5pushRight: boolean('Elem 5 push-right', false),

      element6contGap: select('Elem 6 class', colClasses, GridItemClass.half),
      element6newRow: boolean('Elem 6 row-start', false),
      element6pushRight: boolean('Elem 6 push-right', false),
    },
    moduleMetadata: {
      imports: [
        BrowserAnimationsModule,
        TypographyModule,
        StoryBookLayoutModule,
        GridLayoutExampleModule,
      ],
    },
  };
};

story.add('Grid Layout', toAdd, { notes: { markdown: note } });

story2.add('Grid Layout', toAdd, { notes: { markdown: note } });
