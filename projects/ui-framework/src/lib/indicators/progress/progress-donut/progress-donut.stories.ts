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
import { ColorService } from '../../../services/color-service/color.service';

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
<b-progress-donut
                [size]="'medium'"
                [data]="{
                  color: color2,
                  value: value2,
                  headerTextPrimary: 'Primary medium',
                  headerTextSecondary: textRight2
                }"
                [config]="{
                  disableAnimation: disableAnimation,
                  hideValue: hideValue
                }">
</b-progress-donut>
<br><br>
<b-progress-donut
                [size]="'large'"
                [data]="{
                  color: color1,
                  value: value1,
                  headerTextPrimary: 'Primary large',
                  headerTextSecondary: textRight1
                }"
                [config]="{
                  disableAnimation: disableAnimation,
                  hideValue: hideValue
                }">
</b-progress-donut>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Progress Donut'">
  <div>
    ${template}
    <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">
    ${examples}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Progress Donut
  #### Module
  *ProgressDonutModule*

  *Note*: Progress bar animates when it appears in viewport. <br>
  To disable this behaviour (and all animation in general), \
  pass \`\`\`{ disableAnimation: true }\`\`\` as [config].

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [size] | ProgressSize | theme size | medium
  [data] | ProgressDonutData | \`\`\`color: string\`\`\` - bar color,<br>\
  \`\`\`value: number\`\`\` -  progress value (0-100),<br>\
  \`\`\`headerTextPrimary: string / boolean\`\`\` - text \
   for the left part of header <u>(set to false to hide it)</u>,<br>\
   \`\`\`headerTextSecondary: string / boolean\`\`\` - text for the right part of header,<br>\
    \`\`\`iconHeaderRight: Icons\`\`\` - icon for the right part of header |  &nbsp;
  [config] | ProgressDonutConfig | \`\`\`disableAnimation: boolean\`\`\` - disables animation <br>\
  \`\`\`hideValue: boolean\`\`\` - hides value text |  &nbsp;
  &lt;elem header-left&gt; | ng-content | content for the left part of header | &nbsp;
  &lt;elem header-right&gt; | ng-content | content for the right part of header | &nbsp;

  ~~~
  ${template}
  ~~~

  #### Example \`data\`
  ~~~
data = {
      color: '#926296',
      value: 73,
      headerTextPrimary: 'Strongly disagree',
      headerTextSecondary: '12/32',
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

        color1: ColorService.prototype.randomColor(),
        color2: ColorService.prototype.randomColor(),
        color3: ColorService.prototype.randomColor(),
        color4: ColorService.prototype.randomColor(),
        color5: ColorService.prototype.randomColor(),

        value1: randomNumber(20, 80),
        value2: randomNumber(20, 80),
        value3: randomNumber(20, 80),
        value4: randomNumber(20, 80),
        value5: randomNumber(20, 80),

        textRight1: randomNumber(1, 20) + '/' + randomNumber(20, 30),
        textRight2: randomNumber(1, 20) + '/' + randomNumber(20, 30),
        textRight3: randomNumber(1, 20) + '/' + randomNumber(20, 30),

        size: select('size', Object.values(ProgressSize), ProgressSize.medium),
        color: select(
          'color',
          ['#9d9d9d', '#ff962b', '#f8bc20', '#17b456', '#e52c51', '#4b95ec'],
          '#17b456'
        ),
        value: number('value', randomNumber(20, 80)),

        headerTextPrimary: text(
          'headerTextPrimary',
          'Make America great again!'
        ),
        headerTextSecondary: text(
          'headerTextSecondary',
          randomNumber(1, 20) + '/' + randomNumber(20, 30)
        ),

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
