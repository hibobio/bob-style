import { storiesOf } from '@storybook/angular';
import { text, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { TimePickerModule } from './timepicker.module';

import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-timepicker
        [value]="value"
        [label]="label"
        [disabled]="disabled"
        [required]="required"
        [hintMessage]="hintMessage"
        [warnMessage]="warnMessage"
        [errorMessage]="errorMessage"
        (changed)="onChange($event)">
</b-timepicker>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Timepicker'">
  <div style="flex:1; max-width: 300px;">
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
  value | string | value of input field ('HH:MM')
  label | string | label text (above input)
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | string | hint text
  warnMessage | string | warning text
  errorMessage | string | error text
  (changed) | InputEvent | change emitter

  ~~~
  ${template}
  ~~~
`;
inputStories.add(
  'Timepicker',
  () => {
    return {
      template: storyTemplate,
      props: {
        onChange: action('Time changed'),

        value: text('value', undefined),
        label: text('label', 'Input label'),

        disabled: boolean('disabled', false),
        required: boolean('required', false),

        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', '')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TimePickerModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
