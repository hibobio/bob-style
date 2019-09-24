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
import { thisYear, thisMonth } from '../../services/utils/functional-utils';
import { DatepickerType } from './datepicker.enum';
import { mockText } from '../../mock.const';

const datepickerStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);
const template = `
<b-datepicker [value]="value"
              [type]="pickerType"
              [minDate]="minDate"
              [maxDate]="maxDate"
              [label]="label"
              [description]="description"
              [placeholder]="placeholder"
              [hideLabelOnFocus]="hideLabelOnFocus"
              [hintMessage]="hintMessage"
              [warnMessage]="warnMessage"
              [errorMessage]="errorMessage"
              [disabled]="disabled"
              [required]="required"
              (dateChange)="dateChange($event)">
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
  ## Datepicker

  #### Module
  *DatepickerModule*

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | DatepickerType | date or month picker | date
  [value] | Date / string (YYYY-MM-DD) | date | none
  [minDate] | Date / string (YYYY-MM-DD) | minimum date | none
  [maxDate] | Date / string (YYYY-MM-DD) | maximum date | none
  [label] | string | label text (above input) | none
  [description] | string | description text (above icon)
  [placeholder] | string | placeholder text (inside input) | none
  [hideLabelOnFocus] | boolean | places label in placeholder position | false
  [disabled] | boolean | is field disabled | false
  [required] | boolean | is field required | false
  [hintMessage] | string | hint text | none
  [warnMessage] | string | warning text | none
  [errorMessage] | string | error text | none
  (dateChange) | EventEmitter&lt;InputEvent&gt; |  Emited on date change | none

  #### Notes

  - In \`[type]="'month'"\` mode, the output date will be 1st of month.
  - the output event object also contains \`.date\` property that contains value as Date object.

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
        value: select(
          'value',
          [
            '',
            `${thisYear()}-${thisMonth()}-12`,
            `${thisYear()}-${thisMonth()}-23`
          ],
          ''
        ),
        pickerType: select(
          'type',
          Object.values(DatepickerType),
          DatepickerType.date
        ),
        minDate: select('minDate', ['', `${thisYear()}-${thisMonth()}-10`], ''),
        maxDate: select('maxDate', ['', `${thisYear()}-${thisMonth()}-25`], ''),
        label: text('label', 'Date picker'),
        description: text('description', mockText(30)),
        placeholder: text('placeholder', ''),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
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
