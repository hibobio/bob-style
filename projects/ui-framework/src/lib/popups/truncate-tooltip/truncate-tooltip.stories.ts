import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  boolean,
  number,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { TooltipPosition } from '../tooltip/tooltip.enum';
import { TruncateTooltipType } from './truncate-tooltip.enum';
import { TruncateTooltipModule } from './truncate-tooltip.module';

const story = storiesOf(ComponentGroupType.Tooltip, module).addDecorator(
  withKnobs
);

const template1 = `
  <b-big-body *bTruncateTooltip="maxLines">
    {{ testText || 'Structural directive tooltip example.' }}
    <span class="span1" *ngIf="!testText">{{ testText || text1 }}</span>
    <span class="span2" *ngIf="!testText">{{ text2 }}</span>
  </b-big-body>
`;
const template2 = `
  <b-truncate-tooltip *ngIf="!testText" [maxLines]="maxLines"
      [type]="type"
      [position]="position"
      [expectChanges]="true"
      [tooltipClass]="[
        tooltipClass_TextLeft ? 'text-left' : '',
        tooltipClass_TextRight ? 'text-right' : '',
        tooltipClass_TextCenter ? 'text-center' : '',
        tooltipClass_PreWrap ? 'pre-wrap' : '',
        tooltipClass_NoWrap ? 'no-wrap' : ''
      ]">
    <b-display-3>
      <span>
        <!-- this html comment should not be displayed -->
        {{testText || text4}}
      </span>
      <span *ngIf="!testText">
        Text truncation / line-clamping, however, is set immidiately.
      </span>
    </b-display-3>
  </b-truncate-tooltip>

  <b-truncate-tooltip *ngIf="testText"
      class="b-display-3"
      [maxLines]="maxLines"
      [text]="testText"
      [type]="type"
      [position]="position"
        [tooltipClass]="[
        tooltipClass_TextLeft ? 'text-left' : '',
        tooltipClass_TextRight ? 'text-right' : '',
        tooltipClass_TextCenter ? 'text-center' : '',
        tooltipClass_PreWrap ? 'pre-wrap' : '',
        tooltipClass_NoWrap ? 'no-wrap' : ''
      ]"
  ></b-truncate-tooltip>
`;
const template3 = `
  <p [b-truncate-tooltip]="maxLines"
        [type]="type"
        [position]="position"
        [expectChanges]="true"
        [tooltipClass]="[
          tooltipClass_TextLeft ? 'text-left' : '',
          tooltipClass_TextRight ? 'text-right' : '',
          tooltipClass_TextCenter ? 'text-center' : '',
          tooltipClass_PreWrap ? 'pre-wrap' : '',
          tooltipClass_NoWrap ? 'no-wrap' : ''
        ]">
    <span>{{ testText || text1 }}</span>
    <span *ngIf="!testText">{{ text2 }}</span>
  </p>
`;

const template4 = `
  <h3 [b-truncate-tooltip]="maxLines" [type]="truncateTooltipType.css"
          [position]="position"
          [expectChanges]="true"
          [tooltipClass]="[
            tooltipClass_TextLeft ? 'text-left' : '',
            tooltipClass_TextRight ? 'text-right' : '',
            tooltipClass_TextCenter ? 'text-center' : '',
            tooltipClass_PreWrap ? 'pre-wrap' : '',
            tooltipClass_NoWrap ? 'no-wrap' : ''
          ]">
     {{ testText || text3 }}
  </h3>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Truncate Tooltip'" style="background-color: rgb(247,247,247);">

<div style="text-align: left; max-width: 500px;">
  ${template2}
  <br><br>
  ${template3}
 <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">
  ${template4}

</div>


</b-story-book-layout>
`;

const note = `
  ## Truncate Tooltip

  #### Module
  *TruncateTooltipModule*

 --------

  #### (example 1) Use as a component (b-truncate-tooltip):
  ~~~
  <b-truncate-tooltip [maxLines]="maxLines" [type]="truncateTooltipType.css">
      {{ text }}
  </b-truncate-tooltip>
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [maxLines] | number | maximum lines. the overflowing text will be truncated and tooltip with \
  full text will be shown. \to disable truncation, set to 0 or null. | 1
  [type] | TruncateTooltipType | Use Material tooltip or CSS tooltip. Defaut 'auto' type will \
  use Material for text longer than 130 chars, otherwise CSS. \
  Set to 'none' to disable tooltip. \
  **Note:** type can not be changed dynamically, it's can be set only once. | auto
  [position] | TooltipPosition | above or below | above
  [trustCssVars] | boolean | performance can be optimised, if --line-height and --font-size \
  CSS variables exist on the element | false
  [expectChanges] | boolean | if text inside truncate-tooltip component will be changing, set to true | false
  [tooltipClass] | TooltipClass / TooltipClass[] | classes to control tooltip text-align and wrapping | &nbsp;

   --------

  #### (example 2) Use as a component with an attrubute selector ([b-truncate-tooltip]):
  ~~~
  <p [b-truncate-tooltip]="maxLines" [type]="truncateTooltipType.css">
    {{ text }}
  </p>
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  b-truncate-tooltip (or maxLines) | number | maximum lines | 1
  other properties are the same as in example 1

 --------

  #### <s>(example 3) Use as a (structural) directive (*bTruncateTooltip):</s> DEPRECATED, DONT USE
  ~~~
  <b-big-body *bTruncateTooltip="maxLines">
   {{ text }}
  </b-big-body>
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  bTruncateTooltip | number | maximum lines  | 1
  other properties are not supported

  --------

  ### NOTE:
  - In most cases it's better to use b-truncate-tooltip component in place of text-containing \
  elements like P or DIV etc. You can add classes to it (example 1).
  - If you want to preserve the HTML element, you can use the component with an attribute selector (example 2).
  - Use *bTruncateTooltip on another component (like b-display-3, etc) (example 3). This use is \
  basically the same as wrapping your component in b-truncate-tooltip (as in example 1).
  - Text inside the directive/component should be of uniform (same) font-size!
  - Elements inside the directive/component should not have margin or padding.
  - There should not be any adjacent block-level elements inside (\`\`\`<p>A</p> <p>B</p>\`\`\` Bad).
  - Single-child wrapping block-level elements are allowed (\`\`\`<p>AB</p>\`\`\` OK).
  - Any number of adjacent inline elements are allowed  (\`\`\`<p><span>A</span> <span>B</span></p>\`\`\` OK).

  ### LIMITATIONS:
  - Structural directive *bTruncateTooltip wraps the element it exists on with b-truncate-tooltip \
  component. So if the element had any layout-related classes or styles, directive may break layout. \
  This use is effectively same as wrapping your element in b-truncate-tooltip component yourself.


`;

story.add(
  'Truncate Tooltip',
  () => {
    return {
      template: storyTemplate,
      props: {
        truncateTooltipType: TruncateTooltipType,

        maxLines: number('bTruncateTooltip/maxLines', 2, {}, 'Props'),
        type: select(
          'type',
          Object.values(TruncateTooltipType),
          TruncateTooltipType.auto,
          'Props'
        ),
        position: select(
          'position',
          Object.values(TooltipPosition),
          TooltipPosition.above,
          'Props'
        ),

        text1: `If you’re trying to wear official headgear in a public setting, my advice is
        to take yourself as seriously as you expect others to take you.
          A photographer may not allow you to wear the colander
          if you’ve just pulled it out while giggling. But if you walk in wearing it – if it is clear that this
          headgear is truly a serious part of your traditional Pastafarian beliefs, as you are claiming –
          then they are less likely to make trouble.`,
        text2: '😊 And this text too!',
        text3:
          'This is a pure CSS tooltip!\nLooks and feels the same as matTooltip-based ones.\nCant be used inside overflow hidden containers.',
        text4:
          'By default, the tooltip is initialized lazily -\n only after user hovers over the element for 200ms.\n\n',

        tooltipClass_TextLeft: boolean('TextLeft', false, 'tooltipClass'),
        tooltipClass_TextRight: boolean('TextRight', false, 'tooltipClass'),
        tooltipClass_TextCenter: boolean('TextCenter', false, 'tooltipClass'),
        tooltipClass_PreWrap: boolean('PreWrap', false, 'tooltipClass'),
        tooltipClass_NoWrap: boolean('NoWrap', false, 'tooltipClass'),

        testText: text('testText', ``),
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          TypographyModule,
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          TruncateTooltipModule,
        ],
        entryComponents: [],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
