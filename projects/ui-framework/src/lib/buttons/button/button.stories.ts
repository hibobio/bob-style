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
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { Icons } from '../../icons/icons.enum';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const typeOptions = values(ButtonType);
const sizeOptions = values(ButtonSize);
const icons = values(Icons);

const template = `
<b-button (clicked)="onClick($event)"
          [type]="type"
          [size]="size"
          [disabled]="disabled">
  {{label}}
</b-button>

<b-button (clicked)="onClick($event)"
          [type]="type"
          [size]="size"
          [disabled]="disabled"
          [icon]="icon">
  {{label}}
</b-button>
`;
const note = `
  ## Button Element
  #### Module
  *ButtonsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [label] | string | button text |
  [type] | ButtonType | enum for setting the button type | primary
  [icon] | Icons | icon for button  | &nbsp;
  [size] | ButtonSize | enum for setting the button size | medium
  [disabled] | boolean | disabled | false
  (clicked) | EventEmitter | button click event | &nbsp;

  ~~~
  ${template}
  ~~~
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
      label: text('label', 'Click me'),
      type: select('type', typeOptions, ButtonType.primary),
      size: select('size', sizeOptions, ButtonSize.medium),
      disabled: boolean('disabled', false),
      icon: select('icon', icons, Icons.timeline),
    },
    moduleMetadata: {
      imports: [ButtonsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
