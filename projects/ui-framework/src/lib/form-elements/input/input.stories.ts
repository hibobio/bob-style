import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { InputModule } from './input.module';
import { InputAutoCompleteOptions, InputTypes } from './input.enum';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const inputTypes = values(InputTypes);
const inputAutoCompleteOptions = values(InputAutoCompleteOptions);

const template = `
<b-input
        [inputType]="inputType"
        [label]="label"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [required]="required"

        [hintMessage]="hintMessage"
        [warnMessage]="warnMessage"
        [errorMessage]="errorMessage"

        [enableBrowserAutoComplete]="enableBrowserAutoComplete"

        (inputEvents)="inputEvents($event)">
</b-input>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Input'">
  <div style="width: 400px; margin: 30px auto;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Input Element
  #### Module
  *InputModule* or *FormElementsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  type | InputType | type of input field
  value | string/number/float | type of input field
  label | string | label text
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | text | hint text
  errorMessage | text | error text
  enableBrowserAutoComplete | InputAutoCompleteOptions | shows browser autocomplete options
  hideLabelOnFocus | boolean | hides label on focus
  inputEvents | InputEvents | input events emitter

  ~~~
  ${template}
  ~~~
`;
inputStories.add(
  'Input',
  () => {
    return {
      template: storyTemplate,
      props: {
        inputEvents: action(),
        inputType: select('inputType', inputTypes, InputTypes.text),
        value: text('value', ''),
        label: text('label', 'Input label'),
        placeholder: text('placeholder', 'Input placeholder'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),

        hintMessage: text('hintMessage', 'This field should contain something'),
        errorMessage: text('errorMessage', ''),
        warnMessage: text('warnMessage', ''),

        enableBrowserAutoComplete: select(
          'enableBrowserAutoComplete',
          inputAutoCompleteOptions,
          InputAutoCompleteOptions.off
        )
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, InputModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
