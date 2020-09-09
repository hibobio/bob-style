import { storiesOf } from '@storybook/angular';
import {
  select,
  boolean,
  withKnobs,
  text,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { Icons, IconColor } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import buttonsProps from '../button.properties.md';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const template = `<b-round-button [type]="type"
                   [size]="size"
                   [icon]="icon"
                   [disabled]="disabled"
                   (clicked)="onClick($event)">
</b-round-button>
&nbsp;&nbsp;
<b-round-button [type]="'secondary'"
                   [size]="size"
                   [icon]="'b-icon-close'"
                   [disabled]="disabled"
                   (clicked)="onClick($event)">
</b-round-button>`;

const note = `
  ## Round Button Element
  #### Module
  *ButtonsModule*

  ~~~
<b-round-button [type]="type"
                   [size]="size"
                   [icon]="icon"
                   [disabled]="disabled"
                   (clicked)="onClick($event)">
</b-round-button>
  ~~~

  #### Properties (same as Square Button)

  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | ButtonType | button type | secondary
  [size] | ButtonSize | button size | medium
  [icon] | Icons | button icon | &nbsp;
  [color] | IconColor | button icon color | dark
  [toolTipSummary] | string | Tooltip text | &nbsp;
  [text] | string | same as toolTipSummary - text will be displayed as tooltip | &nbsp;


  ${buttonsProps}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Round button'">
    ${template}
</b-story-book-layout>
`;

story.add(
  'Round Button',
  () => ({
    template: storyTemplate,
    props: {
      type: select('type', Object.values(ButtonType), ButtonType.primary),
      size: select('size', Object.values(ButtonSize), ButtonSize.medium),
      icon: select('icon', Object.values(Icons), Icons.tick),
      disabled: boolean('disabled', false),
      onClick: action('Square button'),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
