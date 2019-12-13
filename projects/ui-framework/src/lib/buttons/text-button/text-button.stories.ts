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
import { Icons } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LinkColor } from '../../indicators/link/link.enum';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const color = values(LinkColor);
const icons = values(Icons);

const button1 = `
<b-text-button (clicked)="onClick($event)"
               [text]="text"
               [color]="color"
               [disabled]="disabled">
</b-text-button>
`;

const button2 = `
<b-text-button (clicked)="onClick($event)"
               [text]="text"
               [icon]="icon"
               [color]="color"
               [disabled]="disabled">
</b-text-button>
`;
const note = `
  ## Text Button Element
  #### Module
  *ButtonsModule*
  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  [text] | text | Button text | &nbsp;
  [icon] | Icons | Icon enum value | &nbsp;
  [color] | LinkColor | color of text and icon | dark
  [disabled] | boolean | disabled | false
  (clicked) | EventEmitter | button click event  | &nbsp;

  ~~~
  ${button1}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Text button'">
  <style>
    b-text-button {
      margin: 0 20px;
    }
  </style>
    ${button1}
    ${button2}
</b-story-book-layout>
`;

story.add(
  'Text Button',
  () => ({
    template: storyTemplate,
    props: {
      text: text('text', 'Click here!'),
      icon: select('icon', icons, Icons.phone_link),
      color: select('color', color, LinkColor.none),
      disabled: boolean('disabled', false),
      onClick: action('Text button'),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
