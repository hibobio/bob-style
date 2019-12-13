import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { values } from 'lodash';
import { IconsModule } from '../../icons/icons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ButtonType, ButtonSize } from '../buttons.enum';
import { Icons } from '../../icons/icons.enum';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const button = `
<b-chevron-button (clicked)="onClick($event)"
                 [text]="text"
                 [type]="type"
                 [size]="size"
                 [active]="active"
                 [disabled]="disabled">
</b-chevron-button>
`;

const note = `
  ## Chevron button
  #### Module
  *ButtonsModule*
  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  [text] | text | Button text | &nbsp;
  [active] | boolean | changes chevron down / up | false
  [type] | ButtonType | enum for setting the button type | primary
  [size] | ButtonSize | enum for setting the button size | medium
  [disabled] | boolean | disabled state | false
  (clicked) | EventEmitter | button click event  | &nbsp;

  ~~~
  ${button}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chevron button'">
    ${button}
</b-story-book-layout>
`;

const typeOptions = values(ButtonType);
const sizeOptions = values(ButtonSize);
const icons = values(Icons);

story.add(
  'Chevron Button',
  () => ({
    template: storyTemplate,
    props: {
      text: text('text', 'Jump to section'),
      type: select('type', typeOptions, ButtonType.secondary),
      size: select('size', sizeOptions, ButtonSize.medium),
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
