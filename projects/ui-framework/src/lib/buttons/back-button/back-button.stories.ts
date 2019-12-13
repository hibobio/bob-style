import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { BackButtonType } from '../buttons.enum';
import { values } from 'lodash';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const typeOptions = values(BackButtonType);

const template = `
<b-back-button
  (clicked)="onClick($event)"
  [type]="type"
  [disabled]="disabled">
    {{label}}
</b-back-button>
`;

const note = `
  ## Back Button Element
  #### Module
  *ButtonsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | BackButtonType | enum for setting the button type | secondary
  [disabled] | boolean | disabled | false
  (clicked) | EventEmitter | back button click event | &nbsp;

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Back button'">
    ${template}
</b-story-book-layout>
`;

story.add(
  'Back Button',
  () => ({
    template: storyTemplate,
    props: {
      onClick: action('onClick'),
      label: text('label', 'Back'),
      type: select('type', typeOptions, BackButtonType.secondary),
      disabled: boolean('disabled', false),
    },
    moduleMetadata: {
      imports: [ButtonsModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
