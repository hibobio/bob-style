import { storiesOf } from '@storybook/angular';
import { boolean, select, text, withKnobs, } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { DatepickerModule } from './datepicker.module';
import { ComponentGroupType } from '../../consts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { thisMonth, thisYear } from '../../services/utils/functional-utils';
import { DatepickerType } from './datepicker.enum';
import { mockText } from '../../mock.const';
import { BDateAdapter } from './date.adapter';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);
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
  [value] | Date / string (YYYY-MM-DD) | date | &nbsp;
  [minDate] | Date / string (YYYY-MM-DD) | minimum date | &nbsp;
  [maxDate] | Date / string (YYYY-MM-DD) | maximum date | &nbsp;
  [label] | string | label text (above input) | &nbsp;
  [description] | string | description text (above icon) | &nbsp;
  [placeholder] | string | placeholder text (inside input) | &nbsp;
  [hideLabelOnFocus] | boolean | places label in placeholder position | false
  [disabled] | boolean | is field disabled | false
  [required] | boolean | is field required | false
  [hintMessage] | string | hint text | &nbsp;
  [warnMessage] | string | warning text | &nbsp;
  [errorMessage] | string | error text | &nbsp;
  (dateChange) | EventEmitter<wbr>&lt;InputEvent&gt; |  Emited on date change | &nbsp;

  #### Notes

  - In \`[type]="'month'"\` mode, the output date will be 1st of month.
  - the output event object also contains \`.date\` property that contains value as Date object.

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Datepicker',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: select(
          'value',
          [
            '',
            `${thisYear()}-${thisMonth(false, -1)}-9`,
            `${thisYear()}-${thisMonth()}-23`,
            `${thisYear()}-${thisMonth(false, 1)}-19`,
          ],
          ''
        ),
        pickerType: select(
          'type',
          Object.values(DatepickerType),
          DatepickerType.date
        ),
        minDate: select(
          'minDate',
          [
            '',
            `${thisYear()}-${thisMonth(false, -1)}-5`,
            `${thisYear()}-${thisMonth()}-7`,
          ],
          ''
        ),
        maxDate: select(
          'maxDate',
          [
            '',
            `${thisYear()}-${thisMonth()}-25`,
            `${thisYear()}-${thisMonth(false, 1)}-15`,
          ],
          ''
        ),
        label: text('label', 'Date picker'),
        description: text('description', mockText(30)),
        placeholder: text('placeholder', ''),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
        dateChange: action('Date Changed'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DatepickerModule.init(BDateAdapter),
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
