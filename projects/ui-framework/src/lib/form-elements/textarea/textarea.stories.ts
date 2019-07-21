import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs,
  number
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { TextareaModule } from './textarea.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const textareaStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-textarea [maxChars]="maxChars"
            [label]="label"
            [placeholder]="placeholder"
            [value]="value"
            [disabled]="disabled"
            [required]="required"
            [hintMessage]="hintMessage"
            [warnMessage]="warnMessage"
            [errorMessage]="errorMessage"
            (inputEvents)="inputEvents($event)">
</b-textarea>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Textarea'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Textarea Element
  #### Module
  *TextareaModule* or *FormElementsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  maxChars | number | maximum characters
  value | string/number/float | type of input field
  label | string | label text
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | text | hint text
  errorMessage | text | error text
  inputEvents | InputEvent | input events emitter

  ~~~
  ${template}
  ~~~
`;
textareaStories.add(
  'Textarea',
  () => {
    return {
      template: storyTemplate,
      props: {
        inputEvents: action('inputEvents'),
        maxChars: number('maxChars', ''),
        value: text('value', ''),
        label: text('label', 'Input label'),
        placeholder: text('placeholder', 'Input placeholder'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', '')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TextareaModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
