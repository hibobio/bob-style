import { storiesOf } from '@storybook/angular';
import { number, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { TruncateTooltipModule } from './truncate-tooltip.module';
import { UtilComponentsModule } from '../util-components/utilComponents.module';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const template1 = `
  <b-big-body *bTruncateTooltip="maxLines" class="employee-title">
    <span class="span1">{{ text1 }}</span>
    <span class="span2">{{ text2 }}</span>
  </b-big-body>
`;
const template2 = `
  <b-truncate-tooltip [maxLines]="maxLines" class="employee-title">
    <b-display-3>
      <span>
        <!-- this html comment should not be displayed -->
        By default, the tooltip is initialized lazily - only after user hovers over the element for 200ms.
      </span>
      <span>
        Text truncation / line-clamping, however, is set immidiately.
      </span>
    </b-display-3>
  </b-truncate-tooltip>
`;
const template3 = `
  <p b-truncate-tooltip="3" class="employee-title">
    <span>{{ text1 }}</span>
    <span>{{ text2 }}</span>
  </p>
`;

const template4 = `
  <div b-truncate-tooltip="2" [type]="'css'">
    <h3>
      This is a pure CSS tooltip! Looks and feels the same as matTooltip-based ones.
      Can't be used inside overflow hidden containers.
    </h3>
  </div>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Truncate Tooltip'" style="background-color: rgb(247,247,247);">
  <div style="min-width: 100%; min-height: 100%;">
    <div style="padding: 100px 50px 50px; max-width: 600px; margin: auto; text-align: left;">
      <p>${template1}</p>
      <br>
      <p>${template2}</p>
      <br>
      ${template3}
      <br>
      ${template4}
    </div>
  </div>
  <b-stats></b-stats>
</b-story-book-layout>
`;

const note = `
  ## Truncate Tooltip

  #### Module
  *TruncateTooltipModule*

 --------

  #### (example 1) Use as a component (b-truncate-tooltip):
  ~~~
  ${template2}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  maxLines | number | maximum lines. the overflowing text will be truncated and tooltip with full text will be shown. to disable truncation, set to 0 or null. | 1 (optional)

   --------

  #### (example 2) Use as a component with an attrubute selector ([b-truncate-tooltip]):
  ~~~
  ${template3}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  b-truncate-tooltip (or maxLines) | number | maximum lines | 1 (optional)

 --------

  #### (example 3) Use as a (structural) directive (*bTruncateTooltip):
  ~~~
  ${template1}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  bTruncateTooltip | number | maximum lines  | 1 (optional)

  --------

  ### NOTE:
  - In most cases it's better to use b-truncate-tooltip component in place of text-containing elements like P or DIV etc. You can add classes to it (example 1).
  - If you want to preserve the HTML element, you can use the component with an attribute selector (example 2).
  - Use *bTruncateTooltip on another component (like b-display-3, etc) (example 3). This use is basically the same as wrapping your component in b-truncate-tooltip (as in example 1).
  - Text inside the directive/component should be of uniform (same) font-size!
  - Elements inside the directive/component should not have margin or padding.
  - There should not be any adjacent block-level elements inside (\`\`\`<p>A</p> <p>B</p>\`\`\` Bad).
  - Single-child wrapping block-level elements are allowed (\`\`\`<p>AB</p>\`\`\` OK).
  - Any number of adjacent inline elements are allowed  (\`\`\`<p><span>A</span> <span>B</span></p>\`\`\` OK).

  ### LIMITATIONS:
  - Structural directive *bTruncateTooltip wraps the element it exists on with b-truncate-tooltip component. So if the element had any layout-related classes or styles, directive may break layout. This use is effectively same as wrapping your element in b-truncate-tooltip component yourself.


`;

story.add(
  'Truncate Tooltip',
  () => {
    return {
      template: storyTemplate,
      props: {
        maxLines: number('bTruncateTooltip/maxLines', 2),
        text1: text(
          'text1',
          `If you’re trying to wear official headgear in a public setting, my advice is
        to take yourself as seriously as you expect others to take you.
          A photographer may not allow you to wear the colander
          if you’ve just pulled it out while giggling. But if you walk in wearing it – if it is clear that this
          headgear is truly a serious part of your traditional Pastafarian beliefs, as you are claiming –
          then they are less likely to make trouble.`
        ),
        text2: text('text2', '😊 And this text too!')
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          TypographyModule,
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          TruncateTooltipModule,
          UtilComponentsModule
        ],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
