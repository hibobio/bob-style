import { storiesOf } from '@storybook/angular';
import {
  boolean,
  number,
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

import formElemsPropsDoc from '../form-elements.properties.md';
import inputElemsPropsDoc from '../input.properties.md';

const template = `
<b-password-input
              [value]="value"
              [label]="label"
              [placeholder]="placeholder"
              [description]="description"
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

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [value] | string | value of input field

  ${inputElemsPropsDoc}

  ${formElemsPropsDoc}

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
        description: text('description', ''),
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
