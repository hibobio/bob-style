import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../../consts';
import { thisMonth, thisYear } from '../../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../../form-elements.properties.md';
import { FormElementsCommonProps } from '../../form-elements.stories.common';
import { BDateAdapterMock, UserLocaleServiceMock } from '../dateadapter.mock';
import { DatepickerType } from '../datepicker.enum';
// @ts-ignore: md file and not a module
import datepickerInterfaceDoc from '../datepicker.interface.md';
// @ts-ignore: md file and not a module
import datepickerPropsDoc from '../datepicker.properties.md';
import { DateRangePickerModule } from './date-range-picker.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);
const template = `
<b-date-range-picker [value]="value"
              [type]="pickerType"
              [dateFormat]="dateFormat"
              [minDate]="minDate"
              [maxDate]="maxDate"
              [label]="label"
              [startDateLabel]="startDateLabel"
              [endDateLabel]="endDateLabel"
              [placeholder]="placeholder"
              [hideLabelOnFocus]="hideLabelOnFocus"
              [hintMessage]="hintMessage"
              [warnMessage]="warnMessage"
              [errorMessage]="errorMessage"
              [disabled]="disabled"
              [required]="required"
              [readonly]="readonly"
              [focusOnInit]="focusOnInit"
              (changed)="dateChange($event)">
</b-date-range-picker>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Date Range Picker'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Date Range Picker

  #### Module
  *DateRangePickerModule*

  **Note:** When importing DateRangePickerModule, you have to initialize it with <u>DateAdapter</u>:
  \`\`\`
  imports: [
    DateRangePickerModule.init(UserLocaleDateAdapter)
  ]
  \`\`\`

  ~~~
<b-date-range-picker [type]="pickerType"
              [value]="value"
              [minDate]="minDate"
              [maxDate]="maxDate"
              [startDateLabel]="startDateLabel"
              [endDateLabel]="endDateLabel"
              [hintMessage]="hintMessage"
              [disabled]="disabled"
              [required]="required"
              (changed)="dateChange($event)">
</b-date-range-picker>
  ~~~

  #### Properties

  Name | Type | Description
  --- | --- | ---
  [value] | DateRangePickerValue <br> ({from: Date / string (YYYY-MM-DD),\
     <br>to: Date / string (YYYY-MM-DD)} | start and end dates
  [startDateLabel] | string | first datepicker label
  [endDateLabel] | string | second datepicker label

  ${datepickerPropsDoc}

  ${formElemsPropsDoc}

  ${datepickerInterfaceDoc}
`;

const mockValues = [
  '',
  {
    from: `${thisYear()}-${Math.max(1, thisMonth(false, -1))}-5`,
    to: `${thisYear()}-${Math.min(thisMonth(false, 1) as number, 12)}-25`,
  },
];

story.add(
  'Date Range Picker',
  () => {
    return {
      template: storyTemplate,
      props: {
        userLocaleService: UserLocaleServiceMock,
        dateFormat: select(
          'dateFormat',
          ['', 'dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy/MM/dd', 'dd/MMM/yyyy'],
          ''
        ),
        value: select('value', mockValues as any, null),
        pickerType: select(
          'type',
          Object.values(DatepickerType),
          DatepickerType.date
        ),
        minDate: select(
          'minDate',
          [
            '',
            `${thisYear()}-${Math.max(thisMonth(false, -1) as number, 1)}-5`,
            `${thisYear()}-${thisMonth()}-7`,
          ],
          ''
        ),
        maxDate: select(
          'maxDate',
          [
            '',
            `${thisYear()}-${thisMonth()}-25`,
            `${thisYear()}-${Math.min(thisMonth(false, 1) as number, 12)}-15`,
          ],
          ''
        ),

        startDateLabel: text('startDateLabel', 'Start date'),
        endDateLabel: text('endDateLabel', 'End date'),

        ...FormElementsCommonProps('', ''),

        dateChange: action('Date Changed'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DateRangePickerModule.init(BDateAdapterMock),
          StoryBookLayoutModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
