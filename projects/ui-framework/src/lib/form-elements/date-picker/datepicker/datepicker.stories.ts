import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../../consts';
import { thisMonth, thisYear } from '../../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../../form-elements.properties.md';
import { FormElementsCommonProps } from '../../form-elements.stories.common';
import { BDateAdapterMock, UserLocaleServiceMock } from '../dateadapter.mock';
import { DatepickerType } from '../datepicker.enum';
// @ts-ignore: md file and not a module
import datepickerPropsDoc from '../datepicker.properties.md';
import { DatepickerModule } from './datepicker.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);
const template = `<b-datepicker [value]="value"
              [type]="pickerType"
              [dateFormat]="dateFormat"
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
              [readonly]="readonly"
              [focusOnInit]="focusOnInit"
              (changed)="dateChange($event)">
</b-datepicker>`;

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

  **Note:** When importing DateRangePickerModule, you have to initialize it with <u>DateAdapter</u>:
  \`\`\`
  imports: [
    DatepickerModule.init(UserLocaleDateAdapter)
  ]
  \`\`\`

  ~~~
<b-datepicker [value]="value"
              [type]="pickerType"
              [minDate]="minDate"
              [maxDate]="maxDate"
              [label]="label"
              [description]="description"
              [placeholder]="placeholder"
              [errorMessage]="errorMessage"
              [disabled]="disabled"
              [required]="required"
              (changed)="dateChange($event)">
</b-datepicker>
  ~~~

  #### Properties

  Name | Type | Description
  --- | --- | ---
  [value] | Date / string (YYYY-MM-DD) | date

  ${datepickerPropsDoc}

  ${formElemsPropsDoc}
`;

story.add(
  'Datepicker',
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
        value: select(
          'value',
          [
            '',
            `${thisYear()}-${Math.max(1, thisMonth(false, -1))}-9`,
            `${thisYear()}-${thisMonth()}-23`,
            `${thisYear()}-${Math.min(12, thisMonth(false, 1))}-19`,
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
            `${thisYear()}-${Math.max(1, thisMonth(false, -1))}-5`,
            `${thisYear()}-${thisMonth()}-7`,
          ],
          ''
        ),
        maxDate: select(
          'maxDate',
          [
            '',
            `${thisYear()}-${thisMonth()}-25`,
            `${thisYear()}-${Math.min(12, thisMonth(false, 1))}-15`,
          ],
          ''
        ),

        ...FormElementsCommonProps('Date picker', ''),

        dateChange: action('Date Changed'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DatepickerModule.init(BDateAdapterMock),
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
