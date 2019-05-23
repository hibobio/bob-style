import { storiesOf, moduleMetadata } from '@storybook/angular';
import { text, array, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { ChipsModule } from '../chips.module';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { chipOptionsMock } from './chipsOptionsMock';
import { randomFromArray } from '../../../services/utils/functional-utils';

const story = storiesOf(`${ComponentGroupType.ButtonsAndIndicators}.Chips`, module).addDecorator(withKnobs);

const options = chipOptionsMock;
const value = [...randomFromArray(chipOptionsMock, 3), 'Rimming'];

const template = `
  <b-chip-input [options]="options"
                [value]="value"
                [acceptNew]="acceptNew"
                [label]="label"
                [placeholder]="placeholder"
                [required]="required"
                [disabled]="disabled"
                [hintMessage]="hintMessage"
                [errorMessage]="errorMessage">
  </b-chip-input>
`;
const template2 = `
  <p b-chip [type]="type">
    Used as directive
  </p>
`;

const note = `
  ## Text-only Chip
  #### Module
  *ChipsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  value | string[] | array of selected chips | none
  options | string[] | array of all possible chips | none
  acceptNew | boolean | if the input accepts new entries | true
  label | string | label (on top of input) | none
  placeholder | string | placeholder (inide input) | none
  hintMessage | string | text below input | none
  errorMessage | string | error text | none
  required | boolean | if input is required | false
  disabled | boolean | if input is disabled | false


  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chip Input'">
  <div style="padding: 50px;margin:auto;max-width:600px;">
    ${template}
  </div>
</b-story-book-layout>
`;

story.add(
  'Chip Input',
  () => ({
    template: storyTemplate,
    props: {
      value: array('value', value, ','),
      acceptNew: boolean('acceptNew', true),
      label: text('label', 'What are your hobbies?'),
      placeholder: text('placehodler', 'Add tags and press ‘Enter’'),
      disabled: boolean('disabled', false),
      required: boolean('required', false),
      hintMessage: text('hintMessage', 'Stick something in me'),
      errorMessage: text('errorMessage', ''),
      options: array('options', options, ',')
    },
    moduleMetadata: {
      imports: [ChipsModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
