import { storiesOf } from '@storybook/angular';
import {
  boolean,
  number,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { DatepickerModule } from './datepicker.module';
import { ComponentGroupType } from '../../consts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const datepickerStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);
const template = `
<b-datepicker (dateChange)="dateChange($event)"
              [dateFormat]="dateFormat"

              [inputLabel]="label"
              [placeholder]="placeholder"

              [hintMessage]="hintMessage"
              [warnMessage]="warnMessage"
              [errorMessage]="errorMessage"

              [disabled]="disabled"
              [required]="required">
</b-datepicker>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Datepicker'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Slider Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  inputLabel | string | Input label | mandatory |
  dateFormat | string | Input date format | DD/MM/YYYY (optional) |
  dateChange | EventEmitter | Date change callback |

  ~~~
  ${template}
  ~~~
`;

datepickerStories.add(
  'Datepicker',
  () => {
    return {
      template: storyTemplate,
      props: {
        dateFormat: text('dateFormat', 'DD/MM/YYYY'),
        label: text('label', 'Date picker'),
        placeholder: text('placeholder', 'Input placeholder'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
        dateChange: action('Date Changed')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DatepickerModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
