import { storiesOf } from '@storybook/angular';
import {
  text,
  array,
  boolean,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipInputModule } from './chip-input.module';
import { mockHobbies } from '../../mock.const';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const options = mockHobbies();
const value = [...mockHobbies(3), 'Rimming'];

const template = `
  <b-chip-input [options]="options"
                [value]="value"
                [acceptNew]="acceptNew"
                [label]="label"
                [placeholder]="placeholder"
                [required]="required"
                [disabled]="disabled"
                [hintMessage]="hintMessage"
                [warnMessage]="warnMessage"
                [errorMessage]="errorMessage"
                (changed)="chipInputChangeHandler($event)">
  </b-chip-input>
`;

const note = `
  ## Chip Input
  #### Module
  *ChipInputModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  value | string[] | array of selected chips | none
  options | string[] | array of all possible chips | none
  acceptNew | boolean | if the input accepts new entries | true
  label | string | label (on top of input) | none
  placeholder | string | placeholder (inide input) | none
  hintMessage | string | text below input | none
  warnMessage | string | warning text
  errorMessage | string | error text | none
  required | boolean | if input is required | false
  disabled | boolean | if input is disabled | false
  changed | &lt;ChipInputChange&gt; | handler for event of type ChipInputChange ({value, added, removed}) | none


  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chip Input'">
  <div style="max-width:500px;">
    ${template}
  </div>

</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    value: array('value', value, ','),
    acceptNew: boolean('acceptNew', true),
    label: text('label', 'What are your hobbies?'),
    placeholder: text('placehodler', 'Add tags and press ‘Enter’'),
    disabled: boolean('disabled', false),
    required: boolean('required', false),
    hintMessage: text('hintMessage', 'Stick something in me'),
    warnMessage: text('warnMessage', ''),
    errorMessage: text('errorMessage', ''),
    options: array('options', options, ','),
    chipInputChangeHandler: action('Chip input changed')
  },
  moduleMetadata: {
    imports: [
      ChipInputModule,
      StoryBookLayoutModule,
      BrowserAnimationsModule,
      UtilComponentsModule
    ]
  }
});

story.add('Chip Input', toAdd, { notes: { markdown: note } });

story2.add('Chip Input', toAdd, { notes: { markdown: note } });
