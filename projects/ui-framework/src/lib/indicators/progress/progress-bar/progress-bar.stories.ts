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
import { ProgressBarModule } from './progress-bar.module';
import {
  randomNumber,
  randomFromArray,
} from '../../../services/utils/functional-utils';
import { ProgressType, ProgressSize } from '../progress.enum';
import { ColorService } from '../../../services/color-service/color.service';

import { Icons } from '../../../icons/icons.enum';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);

const template = `
  <b-progress-bar [type]="type"
                  [size]="size"
                  [data]="{
                    color: color,
                    trackColor: trackColor,
                    value: value,
                    headerTextPrimary: headerTextPrimary || false,
                    headerTextSecondary: headerTextSecondary,
                    iconHeaderRight: iconHeaderRight
                  }"
                  [config]="{
                    disableAnimation: disableAnimation,
                    hideValue: hideValue,
                    clickable: clickable
                  }"
                  (clicked)="onClick($event)">
  </b-progress-bar>
`;

const examples = `
<b-progress-bar [type]="'primary'"
                [size]="'medium'"
                [data]="{
                  color: color2,
                  value: value2,
                  headerTextPrimary: 'Primary medium',
                  headerTextSecondary: textRight2,
                  iconHeaderRight: icon2
                }"
                [config]="{
                  disableAnimation: disableAnimation,
                  hideValue: hideValue,
                  clickable: clickable
                }"
                (clicked)="onClick($event)">
</b-progress-bar>
<br><br>
<b-progress-bar [type]="'primary'"
                [size]="'large'"
                [data]="{
                  color: color1,
                  value: value1,
                  headerTextPrimary: 'Primary large',
                  headerTextSecondary: textRight1,
                  iconHeaderRight: icon1
                }"
                [config]="{
                  disableAnimation: disableAnimation,
                  hideValue: hideValue,
                  clickable: clickable
                }"
                (clicked)="onClick($event)">
</b-progress-bar>
`;

const examples2 = `
  <b-progress-bar [type]="'secondary'"
                  [data]="{
                    value: value3
                  }"
                  [config]="{
                    disableAnimation: disableAnimation,
                    hideValue: hideValue,
                    clickable: clickable
                  }"
                  (clicked)="onClick($event)">
      <span header-left>
        <strong style="margin-right: 16px;">Secondary</strong> 1 size, 1 color
      </span>
  </b-progress-bar>

  <br><br>

  <b-progress-bar style="max-width: 300px;"
                [attr.data-tooltip]="smallBarTooltip"
                data-tooltip-wrap="pre"
                [type]="'primary'"
                [size]="'small'"
                [data]="{
                  color: color5,
                  value: value4,
                  headerTextPrimary: false,
                  headerTextSecondary: textRight3,
                  iconHeaderRight: icon3
                }"
                [config]="{
                  disableAnimation: disableAnimation,
                  hideValue: true,
                  clickable: clickable
                }"
                (clicked)="onClick($event)">
  </b-progress-bar>
  <span class="b-caption">

  </span>
`;

const template3 = `
  <b-progress-bar [type]="progressType.primary"
                  [size]="progressSize.large"
                  [data]="{
                    color: color4,
                    value: value4
                  }"
                  [config]="{
                    disableAnimation: disableAnimation,
                    hideValue: hideValue,
                    clickable: clickable
                  }"
                  (clicked)="onClick($event)">
      <span header-left>
       Can also transclude passed ng-content
      </span>
      <b-button header-right [type]="'secondary'" [size]="'small'" [text]="'Click me'"></b-button>
  </b-progress-bar>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Progress Bar'">
  <div>
    ${template}
    <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">
    ${examples}
    <br><br>
    ${template3}
    <br><br>
    ${examples2}
    <div style="margin-top: 100vh; padding-bottom: 100px;">
    <h3 style="text-align: left; margin-bottom: 50px;">Progress bars animate as they come into view</h3>
      ${examples}
    </div>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Progress Bar
  #### Module
  *ProgressBarModule*

  *Note*: Progress bar animates when it appears in viewport. <br>
  To disable this behaviour (and all animation in general), \
  pass \`\`\`{ disableAnimation: true }\`\`\` as [config].

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | ProgressType | theme | primary
  [size] | ProgressSize | theme size | medium
  [data] | ProgressBarData | \`\`\`color: string\`\`\` - bar color,<br>\
  \`\`\`value: number\`\`\` -  progress value (0-100) **&lt;= number indicating percentage**,<br>\
  \`\`\`headerTextPrimary: string / boolean\`\`\` - text \
   for the left part of header,<br>\
   \`\`\`headerTextSecondary: string / boolean\`\`\` - text for the right part of header,<br>\
    \`\`\`iconHeaderRight: Icons\`\`\` - icon for the right part of header<br><br>\
    **Note:** You can set header texts to falsy values to hide them |  &nbsp;
  [config] | ProgressBarConfig | \`\`\`disableAnimation: boolean\`\`\` - disables animation <br>\
  \`\`\`clickable: boolean\`\`\` - will add hover style to the bars\
   (sets to true automatically if \`(clicked)\` listener exists) |  &nbsp;
  &lt;elem header-left&gt; | ng-content | content for the left part of header | &nbsp;
  &lt;elem header-right&gt; | ng-content | content for the right part of header | &nbsp;

  ~~~
  ${template}
  ${template3}
  ~~~

  #### Example \`data\`
  ~~~
data = {
      color: '#926296',
      value: 73,
      headerTextPrimary: 'Strongly disagree',
      headerTextSecondary: '12/32',
      iconHeaderRight: Icons.doc_icon
    }
  ~~~

  <br>

  #### Small tooltip example
  (no value, no primary text, secondary text and icon appear on the left, not on the right)

  ~~~
<b-progress-bar  [type]="barType.primary'"
                 [size]="barSize.small"
                 [data]="{
                    ...
                    headerTextPrimary: false,
                }"
                [config]="{
                  hideValue: true
                }">
</b-progress-bar>
  ~~~
`;

const icons = [
  Icons.calendar,
  Icons.chat,
  Icons.doc_add,
  Icons.doc_icon,
  Icons.email,
  Icons.harmonise,
  Icons.home_main,
  Icons.home,
  Icons.infinite,
  Icons.lock,
  Icons.megaphone,
  Icons.note,
  Icons.department_icon,
  Icons.person,
  Icons.person_check,
  Icons.print,
  Icons.success,
  Icons.tag,
];

const randomStuff = {
  progressType: ProgressType,
  progressSize: ProgressSize,

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

  icon1: randomFromArray(icons, 1),
  icon2: randomFromArray(icons, 1),
  icon3: randomFromArray(icons, 1),
};

const toAdd = () => ({
  template: storyTemplate,
  props: {
    smallBarTooltip: `type = primary
size = small
headerTextPrimary = false
hideValue = true`,

    ...randomStuff,

    type: select('type', Object.values(ProgressType), ProgressType.primary),
    size: select('size', Object.values(ProgressSize), ProgressSize.medium),
    color: select(
      'color',
      [0, '#9d9d9d', '#ff962b', '#f8bc20', '#17b456', '#e52c51', '#4b95ec'],
      0
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

    headerTextPrimary: text('headerTextPrimary', 'Make America great again!'),
    headerTextSecondary: text(
      'headerTextSecondary',
      randomNumber(1, 20) + '/' + randomNumber(20, 30)
    ),
    iconHeaderRight: select('iconHeaderRight', icons, Icons.doc_icon),
    disableAnimation: boolean('disableAnimation', false),
    hideValue: boolean('hideValue', false),
    clickable: boolean('clickable', false),
    onClick: action('bar clicked'),
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, ProgressBarModule, ButtonsModule],
  },
});

story.add('Progress Bar', toAdd, { notes: { markdown: note } });
story2.add('Progress Bar', toAdd, { notes: { markdown: note } });
