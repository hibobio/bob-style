import { storiesOf } from '@storybook/angular';
import {
  text,
  boolean,
  withKnobs,
  number
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { TextareaModule } from './textarea.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { mockText } from '../../mock.const';

const textareaStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-textarea
            [value]="value"
            [label]="label"
            [description]="description"
            [placeholder]="placeholder"
            [maxChars]="maxChars"
            [minChars]="minChars"
            [readonly]="readonly"
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
  value | string/number/float | type of input field
  label | string | label text
  description | string | description text (above icon)
  placeholder | string | placeholder text (inside input)
  minChars | number | minimum length
  maxChars | number | maximum characters
  readonly | boolean | disables input
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | text | hint text
  warnMessage | string | warning text
  errorMessage | text | error text
  (inputEvents) | InputEvent | input events emitter

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
        value: text('value', ''),
        label: text('label', 'Input label'),
        description: text('description', mockText(30)),
        placeholder: text('placeholder', 'Input placeholder'),
        maxChars: number('maxChars', ''),
        minChars: number('minChars', ''),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        readonly: boolean('readonly', false),
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
