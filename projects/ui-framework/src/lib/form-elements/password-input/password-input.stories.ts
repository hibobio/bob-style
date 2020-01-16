import { storiesOf } from '@storybook/angular';
import {
  boolean,
  number,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { PasswordInputModule } from './password-input.module';
import { ComponentGroupType } from '../../consts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);
const template = `
<b-password-input
              [value]="value"
              [label]="label"
              [placeholder]="placeholder"
              [minChars]="minChars"
              [maxChars]="maxChars"
              [hintMessage]="hintMessage"
              [warnMessage]="warnMessage"
              [errorMessage]="errorMessage"
              [readonly]="readonly"
              [disabled]="disabled"
              [required]="required"
              [hideLabelOnFocus]="hideLabelOnFocus"
              [enableBrowserAutoComplete]="enableBrowserAutoComplete"
              (inputEvents)="onChange($event)">
</b-password-input>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Password Input'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Password Input

  #### Properties

  Name | Type | Description
  --- | --- | --- | ---
  [value] | string | value of input field
  [label] | string | label text (above input)
  [placeholder] | string | placeholder text (inside input)
  [minChars] | number | min length
  [maxChars] | number | max length
  [readonly] | boolean | disables input
  [disabled] | boolean | is field disabled
  [required] | boolean | is field required
  [hintMessage] | string | hint text
  [warnMessage] | string | warning text
  [errorMessage] | string | error text
  [hideLabelOnFocus] | boolean | if true: there will be no label above\
   input, label text (if present) will be used as placeholder
  [enableBrowserAutoComplete] | InputAutoCompleteOptions | shows browser autocomplete options
  (inputEvents) | EventEmitter<wbr>&lt;InputEvent&gt; | input events emitter
  ~~~
  ${template}
  ~~~
`;

story.add(
  'Password Input',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: text('value', ''),
        label: text('label', 'Password input'),
        placeholder: text('placeholder', 'Enter password'),
        minChars: number('minChars', 8),
        maxChars: number('maxChars', 30),
        readonly: boolean('readonly', false),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text(
          'hintMessage',
          'Should be at least 8 characters long'
        ),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        enableBrowserAutoComplete: boolean('enableBrowserAutoComplete', false),
        onChange: action('Input changed'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          PasswordInputModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
