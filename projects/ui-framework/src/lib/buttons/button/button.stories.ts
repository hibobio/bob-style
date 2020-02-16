import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { ButtonType, ButtonSize } from '../buttons.enum';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { Icons } from '../../icons/icons.enum';

import buttonsProps from '../button.properties.md';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const template = `
<b-button (clicked)="onClick($event)"
          [type]="type"
          [size]="size"
          [text]="text"
          [disabled]="disabled">
</b-button>

<b-button (clicked)="onClick($event)"
          [type]="type"
          [size]="size"
          [text]="text"
          [disabled]="disabled"
          [icon]="icon">
</b-button>
`;

const templForNotes = `<b-button [type]="type"
            [size]="size"
            [text]="text"
            [disabled]="disabled"
            (clicked)="onClick($event)">
    Click me
</b-button>`;

const note = `
  ## Button Element
  #### Module
  *ButtonsModule*

  ~~~
  ${templForNotes}
  ~~~

  #### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [type] | ButtonType | button type | primary
  [size] | ButtonSize | button size | medium
  [icon] | Icons | button icon | &nbsp;

  ${buttonsProps}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Button'">
  <style>
    b-button {
      margin: 0 10px;
    }
  </style>
    ${template}
</b-story-book-layout>
`;

story.add(
  'Regular Button',
  () => ({
    template: storyTemplate,
    props: {
      onClick: action('onClick'),
      text: text('text', 'Click me'),
      type: select('type', Object.values(ButtonType), ButtonType.primary),
      size: select('size', Object.values(ButtonSize), ButtonSize.medium),
      disabled: boolean('disabled', false),
      icon: select('icon', Object.values(Icons), Icons.timeline),
    },
    moduleMetadata: {
      imports: [ButtonsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
