import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ButtonType, ButtonSize } from '../buttons.enum';

import buttonsProps from '../button.properties.md';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const button = `<b-chevron-button [type]="type"
                    [text]="text"
                    [size]="size"
                    [active]="active"
                    [disabled]="disabled"
                    (clicked)="onClick($event)">
</b-chevron-button>`;

const note = `
  ## Chevron button
  #### Module
  *ButtonsModule*

  ~~~
  ${button}
  ~~~

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | ButtonType | button type | primary
  [size] | ButtonSize | button size | medium
  [active] | boolean | changes chevron down / up | false

  ${buttonsProps}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chevron button'">
    ${button}
</b-story-book-layout>
`;

story.add(
  'Chevron Button',
  () => ({
    template: storyTemplate,
    props: {
      text: text('text', 'Jump to section'),
      type: select('type', Object.values(ButtonType), ButtonType.secondary),
      size: select('size', Object.values(ButtonSize), ButtonSize.medium),
      active: boolean('active', false),
      disabled: boolean('disabled', false),
      onClick: action('chevron button clicked'),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
