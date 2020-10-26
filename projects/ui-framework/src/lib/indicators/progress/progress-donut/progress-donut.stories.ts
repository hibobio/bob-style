import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs,
  number,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { ProgressDonutModule } from './progress-donut.module';
import { randomNumber } from '../../../services/utils/functional-utils';
import { DonutSize, ProgressSize } from '../progress.enum';
import { Icons, IconSize } from '../../../icons/icons.enum';
import { IconsModule } from '../../../icons/icons.module';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);

const template = `<b-progress-donut [size]="size"
                  [donutSize]="donutSize"
                  [customSize]="customSize"
                  [data]="{
                    color: color,
                    trackColor: trackColor,
                    value: value,
                    headerTextPrimary: headerTextPrimary || false,
                    headerTextSecondary: headerTextSecondary
                  }"
                  [config]="{
                    disableAnimation: disableAnimation,
                    hideValue: hideValue,
                    showValueInCenter: showValueInCenter
                  }">
  </b-progress-donut>`;

const examples = `

<style>
b-progress-donut {
  margin: 0 30px 30px 0;
}
</style>

<b-progress-donut [size]="progressSize.small"
                [data]="{
                  color: 'orange',
                  value: 17,
                  headerTextPrimary: null,
                  headerTextSecondary: 'Want candy'
                }"
                [config]="{
                  disableAnimation: disableAnimation,
                  hideValue: false
                }">
</b-progress-donut>

<b-progress-donut [size]="progressSize.medium"
                [data]="{
                  color: 'green',
                  value: 24,
                  headerTextPrimary: null,
                  headerTextSecondary: 'Want cake'
                }"
                [config]="{
                  disableAnimation: disableAnimation,
                  hideValue: false
                }">
</b-progress-donut>

<b-progress-donut [size]="progressSize.large"
                [data]="{
                  color: 'red',
                  value: 59,
                  headerTextPrimary: null,
                  headerTextSecondary: 'Want a hug'
                }"
                [config]="{
                  disableAnimation: disableAnimation,
                  hideValue: false
                }">
</b-progress-donut>`;

const contentExmpls = `<b-progress-donut [size]="progressSize.medium"
                [data]="{
                  color: 'pink',
                  value: 62
                }"
                [config]="{
                  hideValue: true
                }">
    <b-icon [icon]="icons.analytics_alt" [size]="iconSize.small"></b-icon>
</b-progress-donut>

<b-progress-donut [size]="progressSize.medium"
                [data]="{
                  color: 'purple',
                  value: 37
                }"
                [config]="{
                  hideValue: true
                }">
        <span>37</span>
</b-progress-donut>`;

const storyTemplate = `
<b-story-book-layout [title]="'Progress Donut'">
  <div>
    ${template}
    <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">

    <div style="display:flex; flex-wrap: wrap; align-items: center;">
      ${examples}
      ${contentExmpls}
    </div>

    <div style="margin-top: 100vh; padding-bottom: 100px;">
    <h3 style="text-align: left; margin-bottom: 50px;">Progress donuts animate as they come into view</h3>
    <div style="display:flex; flex-wrap: wrap; align-items: center;">
      ${examples}
    </div>
    </div>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Progress Donut
  #### Module
  *ProgressDonutModule*

  ~~~
  ${template}
  ~~~

  *Note*: Progress donut animates when it appears in viewport. <br>
  To disable this behaviour (and all animation in general), \
  pass \`\`\`{ disableAnimation: true }\`\`\` as [config].

  *Note*: You should use only one of: \`\`\`[donutSize]\`\`\`, \`\`\`[customSize]\`\`\` or \`\`\`[size]\`\`\` inputs (they will be considered in this order). \`\`\`[donutSize]\`\`\` uses same sizes as Pie Chart. \`\`\`[size]\`\`\` is unique to Progress Donut, but by now is <u>deprecated</u>.

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [donutSize] | DonutSize | donut size preset | &nbsp;
  [customSize] | number | custom donut diameter | &nbsp;
  <s>[size]</s> | ProgressSize | theme size (deprecated) | medium
  [data] | ProgressData | \`\`\`color: string\`\`\` - bar color,<br>\
  \`\`\`value: number\`\`\` -  progress value (0-100) **&lt;= number indicating percentage**,<br>\
  \`\`\`headerTextPrimary: string / boolean\`\`\` - \
   text for the top line of the header (headings font-family),<br>\
   \`\`\`headerTextSecondary: string / boolean\`\`\` - \
   text for the bottom line of the header (smaller font-size &amp; lighter grey color)<br><br>\
   **Note**: If \`headerTextPrimary\` is not provided (set to falsy value), value (in %) will be put in its place. \
   To hide primary text slot completely, also set \`hideValue\` to true in \`config\` |  &nbsp;
  [config] | ProgressDonutConfig | \`\`\`disableAnimation: boolean\`\`\` - disables animation <br>\
  \`\`\`hideValue: boolean\`\`\` - hides value text<br>\
  \`\`\`showValueInCenter: boolean\`\`\` - puts value in the donut center |  &nbsp;

  #### Passing content to be placed in the center:

  ~~~
  ${contentExmpls}
  ~~~

  #### Example \`data\`
  ~~~
data = {
      color: '#926296',
      value: 73,
      headerTextPrimary: '$68,500',
      headerTextSecondary: 'Total budget',
    }
  ~~~
  ~~~
data = {
      color: '#926296',
      value: 87,
      headerTextSecondary: 'Complete',
    }
  ~~~
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    progressSize: ProgressSize,
    icons: Icons,
    iconSize: IconSize,

    size: select('size', [0, ...Object.values(ProgressSize)], 0),
    donutSize: select('donutSize', [0, ...Object.values(DonutSize)], 0),
    customSize: number('customSize', 0),

    color: select(
      'color',
      ['#9d9d9d', '#ff962b', '#f8bc20', '#17b456', '#e52c51', '#4b95ec'],
      '#4b95ec'
    ),
    value: number('value', randomNumber(20, 80)),

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

    headerTextPrimary: text('headerTextPrimary', ''),
    headerTextSecondary: text('headerTextSecondary', 'Have voted'),

    hideValue: boolean('hideValue', false),
    showValueInCenter: boolean('showValueInCenter', false),
    disableAnimation: boolean('disableAnimation', false),
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, ProgressDonutModule, IconsModule],
  },
});

story.add('Progress Donut', toAdd, { notes: { markdown: note } });
story2.add('Progress Donut', toAdd, { notes: { markdown: note } });
