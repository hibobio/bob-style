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
import { ProgressSize } from '../progress.enum';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const template = `
  <b-progress-donut [size]="size"
                  [data]="{
                    color: color,
                    value: value,
                    headerTextPrimary: headerTextPrimary || false,
                    headerTextSecondary: headerTextSecondary
                  }"
                  [config]="{
                    disableAnimation: disableAnimation,
                    hideValue: hideValue
                  }">
  </b-progress-donut>
`;

const examples = `

<b-progress-donut style="margin: 0 30px 30px 0;"
                [size]="'small'"
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

<b-progress-donut style="margin: 0 30px 30px 0;"
                [size]="'medium'"
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

<b-progress-donut style="margin: 0 30px 30px 0;"
                [size]="'large'"
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
</b-progress-donut>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Progress Donut'">
  <div>
    ${template}
    <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">

    <div style="display:flex; flex-wrap: wrap; align-items: center;">
      ${examples}
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

  *Note*: Progress donut animates when it appears in viewport. <br>
  To disable this behaviour (and all animation in general), \
  pass \`\`\`{ disableAnimation: true }\`\`\` as [config].

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [size] | ProgressSize | theme size | medium
  [data] | ProgressDonutData | \`\`\`color: string\`\`\` - bar color,<br>\
  \`\`\`value: number\`\`\` -  progress value (0-100) **&lt;= number indicating percentage**,<br>\
  \`\`\`headerTextPrimary: string / boolean\`\`\` - \
   text for the top line of the header (headings font-family),<br>\
   \`\`\`headerTextSecondary: string / boolean\`\`\` - \
   text for the bottom line of the header (smaller font-size &amp; lighter grey color)<br><br>\
   **Note**: If \`headerTextPrimary\` is not provided (set to falsy value), value (in %) will be put in its place. \
   To hide primary text slot completely, also set \`hideValue\` to true in \`config\` |  &nbsp;
  [config] | ProgressDonutConfig | \`\`\`disableAnimation: boolean\`\`\` - disables animation <br>\
  \`\`\`hideValue: boolean\`\`\` - hides value text |  &nbsp;

  ~~~
  ${template}
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

story.add(
  'Progress Donut',
  () => {
    return {
      template: storyTemplate,
      props: {
        ProgressSize: ProgressSize,

        size: select('size', Object.values(ProgressSize), ProgressSize.medium),
        color: select(
          'color',
          ['#9d9d9d', '#ff962b', '#f8bc20', '#17b456', '#e52c51', '#4b95ec'],
          '#4b95ec'
        ),
        value: number('value', randomNumber(20, 80)),

        headerTextPrimary: text('headerTextPrimary', ''),
        headerTextSecondary: text('headerTextSecondary', 'Have voted'),

        disableAnimation: boolean('disableAnimation', false),
        hideValue: boolean('hideValue', false),
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, ProgressDonutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
