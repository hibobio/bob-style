import { storiesOf } from '@storybook/angular';
import {
  select,
  withKnobs,
  boolean,
  object,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { ProgressType, ProgressSize } from '../progress.enum';
import { MultiProgressBarModule } from './multi-progress-bar.module';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);

const template = `
<b-multi-progress-bar [data]="data"
     [type]="type" [size]="size"
      [config]="{
        trackColor: trackColor,
        direction: direction,
        clickable: clickable,
        disableAnimation: disableAnimation
      }"
      (clicked)="onClick($event)">
</b-multi-progress-bar>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi Progress Bar'">
  <div style="max-width: 300px">
    ${template}
    <br><br>
    <b-button type="secondary" size="small">
      <b-multi-progress-bar [data]="data2" class="mrg-r-8"></b-multi-progress-bar> <span class="b-caption">(420)</span>
    </b-button>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Multi Progress Bar
  #### Module
  *MultiProgressBarModule*

  *Note*: Progress bar animates when it appears in viewport. <br>
  To disable this behaviour (and all animation in general), \
  pass \`\`\`{ disableAnimation: true }\`\`\` as [config].

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | ProgressType | theme | primary
  [size] | ProgressSize | theme size | medium
  [data] | MultiProgressBarData[] | \`\`\`color: ColorPalette/string\`\`\` - bar color (if color is not passed, color for the Palette will be used),<br>\
  \`\`\`value: number\`\`\` -  progress value;<br>\
  **Note:** If the sum of all values does not add up to 100, then the sum of all values will be taken for 100%, and all the progress bars will display relative to that. |  &nbsp;
  [config] | MultiProgressBarConfig |  \`\`\`total: boolean\`\`\` - number to be considered as 100% instead of the sum of values <br>\
  \`\`\`disableAnimation: boolean\`\`\` - disables animation <br>\
  \`\`\`clickable: boolean\`\`\` - will add hover style to the bars\
   (sets to true automatically if \`(clicked)\` listener exists)<br>\
   \`\`\`trackColor:  ColorPalette/string\`\`\` - bg color of the bar track (by default its light grey) <br>\
   \`\`\`direction: ProgressDirection\`\`\` - how the values are sorted left-to-right: maxToMin (default) or minToMax  |  &nbsp;

  ~~~
  ${template}
  ~~~
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    progressType: ProgressType,
    progressSize: ProgressSize,

    type: select('type', Object.values(ProgressType), ProgressType.primary),
    size: select('size', Object.values(ProgressSize), ProgressSize.medium),

    data2: [
      { value: 76, color: 'green' },
      { value: 43, color: 'yellow' },
      { value: 21, color: 'red' },
    ],

    data: object('data', [
      { value: 13 },
      { value: 27 },
      { value: 5 },
      { value: 67 },
    ]),

    trackColor: select(
      'trackColor',
      [
        0,
        'rgba(200, 200, 200, 0.15)',
        'rgba(157,157,157, 0.15)',
        'rgba(255,150,43, 0.15)',
        'rgba(248,188,32, 0.15)',
        'rgba(23,180,86, 0.15)',
        'rgba(229,44,81, 0.15)',
        'rgba(75,149,236, 0.15)',
      ],
      'rgba(200, 200, 200, 0.15)'
    ),
    direction: select('direction', ['min-to-max', 'max-to-min'], 'max-to-min'),
    disableAnimation: boolean('disableAnimation', false),
    clickable: boolean('clickable', false),
    onClick: action('bar clicked'),
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, MultiProgressBarModule, ButtonsModule],
  },
});

story.add('Multi Progress Bar', toAdd, { notes: { markdown: note } });
story2.add('Multi Progress Bar', toAdd, { notes: { markdown: note } });
