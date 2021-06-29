import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../../consts';
import { thisMonth, thisYear } from '../../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { BDateAdapterMock, UserLocaleServiceMock } from '../dateadapter.mock';
import { DatepickerType } from '../datepicker.enum';
// @ts-ignore: md file and not a module
import datepickerPropsDoc from '../datepicker.properties.md';
import { DatepickerInlineModule } from './datepicker-inline.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);
const template = `
<b-datepicker-inline [value]="value"
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
</b-datepicker-inline>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Datepicker Inline'">
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
  ${template}
  ~~~

  #### Properties

  Name | Type | Description
  --- | --- | ---
  [value] | Date / string (YYYY-MM-DD) | date

  ${datepickerPropsDoc}

  `;
// ${formElemsPropsDoc}

story.add(
  'Datepicker Inline',
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

        // ...FormElementsCommonProps('Date picker', ''),

        dateChange: action('Date Changed'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DatepickerInlineModule.init(BDateAdapterMock),
          StoryBookLayoutModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: {
      timestamps: true,
      escapeHTML: false,
    },
  }
);
