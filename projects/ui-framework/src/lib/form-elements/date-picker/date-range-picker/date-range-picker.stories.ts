import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { DateRangePickerModule } from './date-range-picker.module';
import { thisMonth, thisYear } from '../../../services/utils/functional-utils';
import { DatepickerType } from '../datepicker.enum';
import { BDateAdapterMock, UserLocaleServiceMock } from '../dateadapter.mock';

// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../../form-elements.properties.md';
// @ts-ignore: md file and not a module
import datepickerPropsDoc from '../datepicker.properties.md';
// @ts-ignore: md file and not a module
import datepickerInterfaceDoc from '../datepicker.interface.md';
import { FormElementsCommonProps } from '../../form-elements.stories.common';

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
              (dateChange)="dateChange($event)">
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
  ${template}
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
        value: select('value', mockValues, ''),
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
  { notes: { markdown: note } }
);
