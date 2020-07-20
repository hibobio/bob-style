import { storiesOf } from '@storybook/angular';
import { text, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { TimePickerModule } from './timepicker.module';

import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import formElemsPropsDoc from '../form-elements.properties.md';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-timepicker
        [value]="value"
        [label]="label"
        [description]="description"
        [disabled]="disabled"
        [required]="required"
        [readonly]="readonly"
        [hintMessage]="hintMessage"
        [warnMessage]="warnMessage"
        [errorMessage]="errorMessage"
        (changed)="onChange($event)">
</b-timepicker>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Timepicker'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Input Element
  #### Module
  *InputModule* or *FormElementsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [value] | string | value of input field ('HH:MM')
  (changed) | InputEvent | change emitter

  ${formElemsPropsDoc}
`;
story.add(
  'Timepicker',
  () => {
    return {
      template: storyTemplate,
      props: {
        onChange: action('Time changed'),

        value: text('value', '4:20'),
        label: text('label', 'Input label'),
        description: text('description', ''),

        disabled: boolean('disabled', false),
        required: boolean('required', false),
        readonly: boolean('readonly', false),

        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TimePickerModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
