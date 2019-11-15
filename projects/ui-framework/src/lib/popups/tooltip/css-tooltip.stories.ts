import { storiesOf } from '@storybook/angular';
import { withKnobs, text, select } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {
  CSSTooltipWrap,
  CSSTooltipPosition,
  CSSTooltipShowOn,
  CSSTooltipTextAlign,
} from './tooltip.enum';
import { DividerModule } from '../../layout/divider/divider.module';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.Tooltip, module).addDecorator(
  withKnobs
);

const template = `
  <b-heading [attr.data-tooltip]="tooltipText"
     [attr.data-tooltip-position]="tooltipPosition"
     [attr.data-tooltip-align]="tooltipTextAlign"
     [attr.data-tooltip-wrap]="tooltipWrap"
     [attr.data-tooltip-show]="tooltipShowOn"
     tabindex="0">
       Hover over this text to see tooltip.
  </b-heading>
`;

const note = `
  ## CSS Tooltip

  #### Module
  *no module* (styles exist in global CSS)

  #### How-to

  By adding \`\`\`data-tooltip="text"\`\`\` atrribute to any element you will get a simple tooltip with text - on hover or on focus (click).


  #### HTML Attributes
  Name | Type | Description | default
  --- | --- | --- | ---
  [attr.data-tooltip] | string | tooltip text | none
  [attr.data-tooltip-position] | CSSTooltipPosition | above or below | 'above'
  [attr.data-tooltip-align] | CSSTooltipTextAlign | text alignment | 'center'
  [attr.data-tooltip-show] | CSSTooltipShowOn | show on hover or on focus (click) - if using on focus, be sure to add tabindex="0" attribute to non-focusable elements | 'hover'
  [attr.data-tooltip-wrap] | CSSTooltipWrap | white-space CSS property - 'normal', 'nowrap' (single line, only use for predictably short tooltips) or 'pre' (will respect line-break symbols \`\`\`\\n\`\`\` in text!) | 'normal'

  ~~~
  ${template}
  ~~~

  #### Notation
  you can use plain HTML attributes, or Angular [attr.xxx] notation (preferred):

  \`\`\`[attr.data-tooltip]="textProperty" \`\`\`

  \`\`\`[attr.data-tooltip]="'Text string'" \`\`\`

  \`\`\`data-tooltip="Some text" \`\`\`

  \`\`\`data-tooltip="{{ textProperty }}" \`\`\`

`;

const storyTemplate = `<b-story-book-layout [title]="'CSS Tooltip'">
  <div >

    <div style="text-align:left; max-width: 400px; margin: 0 auto;">
      <p>CSS Tooltip is very performant, but has some limitations.

      <p><strong>When to use:</strong> For short tooltips</p>

      <p><strong>When not to use:</strong> For <u>longer</u> text, or if inside  <u>overflow: hidden</u> or <u>overflow: auto</u> container - in this cases, use <u>Material Tooltip</u></p>
    </div>

    <b-divider></b-divider>

      ${template}
  </div>
</b-story-book-layout>`;

story.add(
  'CSS Tooltip',
  () => ({
    template: storyTemplate,
    props: {
      tooltipText: text('tooltipText', 'Works best for \n short text'),
      tooltipPosition: select(
        'tooltipPosition',
        Object.values(CSSTooltipPosition),
        CSSTooltipPosition.above
      ),
      tooltipTextAlign: select(
        'tooltipTextAlign',
        Object.values(CSSTooltipTextAlign),
        CSSTooltipTextAlign.center
      ),
      tooltipWrap: select(
        'tooltipWrap',
        Object.values(CSSTooltipWrap),
        CSSTooltipWrap.normal
      ),
      tooltipShowOn: select(
        'tooltipShowOn',
        Object.values(CSSTooltipShowOn),
        CSSTooltipShowOn.hover
      ),
    },
    moduleMetadata: {
      imports: [StoryBookLayoutModule, DividerModule, TypographyModule],
    },
  }),
  { notes: { markdown: note } }
);
