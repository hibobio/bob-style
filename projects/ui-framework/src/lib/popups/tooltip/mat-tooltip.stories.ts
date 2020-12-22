import { storiesOf } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs';
import { radios } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TooltipPosition, TooltipClass } from './tooltip.enum';
import { DividerModule } from '../../layout/divider/divider.module';
import { TypographyModule } from '../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';

const story = storiesOf(ComponentGroupType.Tooltip, module).addDecorator(
  withKnobs
);

const template = `
  <b-heading [matTooltip]="tooltipText"
             [matTooltipPosition]="tooltipPosition"
             [matTooltipClass]="tooltipClass">
       Hover over this text to see tooltip.
  </b-heading>
`;

const note = `
  ## Material Tooltip

  #### Module
  *MatTooltipModule*

  #### Properties
  Name | Type | Description | default
  --- | --- | --- | ---
  [matTooltip] | string | tooltip text | &nbsp;
  [matTooltipPosition] | TooltipPosition | default position - above or below | above
  [matTooltipClass] | TooltipClass[] | add classes to define text-align (TextLeft, TextCenter, TextRight) and wrapping \
  PreWrap, NoWrap - add PreWrap class to make tooltip respect line-break symbols \`\`\`\\n\`\`\` in text!) | TextCenter

  ~~~
  ${template}
  ~~~

`;

const storyTemplate = `<b-story-book-layout [title]="'Material Tooltip'">
  <div >

    <div style="text-align:left; max-width: 400px; margin: 0 auto;">
      <p>Material Tooltip should be used in cases when CSS Tooltip does not look good.

      <p><strong>When to use:</strong> For long tooltip text; when inside  \
      <u>overflow: hidden</u> or <u>overflow: auto</u> container; \
      when CSS Tooltip does not look good for whatever reason.</p>

      <p><strong>When not to use:</strong> For short (1-3) words text; If CSS Tooltip looks good, stay with CSS.</p>
    </div>

    <b-divider></b-divider>

      ${template}
  </div>
</b-story-book-layout>`;

story.add(
  'Material Tooltip',
  () => ({
    template: storyTemplate,
    props: {
      tooltipText: text(
        'tooltipText',
        'Works best for long text text. \n Automatically positions itself above \
        or below \n depending on available space.'
      ),

      tooltipPosition: radios(
        'tooltipPosition',
        Object.values(TooltipPosition) as any[],
        TooltipPosition.above as any
      ),

      tooltipClass: radios(
        'tooltipClass',
        Object.values(TooltipClass) as any[],
        TooltipClass.TextCenter as any
      ),
    },
    moduleMetadata: {
      imports: [
        StoryBookLayoutModule,
        DividerModule,
        TypographyModule,
        MatTooltipModule,
        BrowserAnimationsModule,
      ],
    },
  }),
  { notes: { markdown: note } }
);
