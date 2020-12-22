import { storiesOf } from '@storybook/angular';
import { select, boolean, withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { Icons, IconColor } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

// @ts-ignore: md file and not a module
import buttonsProps from '../button.properties.md';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const template = `<b-square-button [type]="type"
                   [size]="size"
                   [round]="round"
                   [icon]="icon"
                   [color]="color"
                   [toolTipSummary]="toolTipSummary"
                   [disabled]="disabled"
                   (clicked)="onClick($event)">
</b-square-button>`;

const note = `
  ## Square Button Element
  #### Module
  *ButtonsModule*

  ~~~
  ${template}
  ~~~

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | ButtonType | button type | secondary
  [size] | ButtonSize | button size | medium
  [icon] | Icons | button icon | &nbsp;
  <s>[color]</s> | IconColor | button icon color (deprecated, use [type] instead) | dark
  [round] | boolean | make it round! | &nbsp;
  [toolTipSummary] | string | Tooltip text | &nbsp;
  [text] | string | same as toolTipSummary - text will be displayed as tooltip | &nbsp;


  ${buttonsProps}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Square button'">
    ${template}
</b-story-book-layout>
`;

story.add(
  'Square Button',
  () => ({
    template: storyTemplate,
    props: {
      type: select('type', [0, ...Object.values(ButtonType)], 0),
      size: select('size', [...Object.values(ButtonSize), 0], 0),
      icon: select('icon', [0, ...Object.values(Icons)], Icons.phone_link),
      color: select('color', [0, ...Object.values(IconColor)], 0),
      round: boolean('round', false),
      toolTipSummary: text('toolTipSummary', 'Call me'),
      disabled: boolean('disabled', false),
      onClick: action('Square button'),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
