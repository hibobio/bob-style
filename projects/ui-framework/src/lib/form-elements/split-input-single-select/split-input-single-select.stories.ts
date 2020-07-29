import { storiesOf } from '@storybook/angular';
import {
  boolean,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SplitInputSingleSelectModule } from './split-input-single-select.module';
import { SelectGroupOption } from '../../lists/list.interface';
import { InputTypes } from '../input/input.enum';
import { map } from 'lodash';
import { InputSingleSelectValue } from './split-input-single-select.interface';
import { mockText } from '../../mock.const';

import formElemsPropsDoc from '../form-elements.properties.md';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-split-input-single-select [inputType]="inputType"
                             [selectOptions]="selectOptions"
                             [value]="value"
                             [label]="label"
                             [description]="description"
                             [hintMessage]="hintMessage"
                             [errorMessage]="errorMessage"
                             [disabled]="disabled"
                             [selectDisabled]="selectDisabled"
                             [required]="required"
                             [readonly]="readonly"
                             (elementChange)="elementChange($event)">
</b-split-input-single-select>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Split input single select'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Split input single select

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [value] | SplitInputSingleSelectValue | value of the input and select
  [selectOptions] | SelectGroupOption[] | the options model for the select element
  [selectDisabled] | boolean | disables the select (but not the input)
  (elementChange) | EventEmitter<wbr>&lt;InputSingleSelectValue&gt; |  change emitter

  #### Note:

  - If options[0].options has only 1 option, its value will be put (as text) in place of the select
  - If [options] is missing (or options[0].options is empty), but [value] has .selectValue, it will be put (as text) in place of the select.

  ${formElemsPropsDoc}

`;

const currencies = [
  { value: 'AED', serverId: null },
  { value: 'ANG', serverId: null },
  { value: 'AUD', serverId: null },
  { value: 'AZN', serverId: null },
  { value: 'BAM', serverId: null },
  { value: 'BGN', serverId: null },
  { value: 'BRL', serverId: null },
  { value: 'BTC', serverId: null },
  { value: 'BWP', serverId: null },
  { value: 'CAD', serverId: null },
  { value: 'CHF', serverId: null },
  { value: 'CLP', serverId: null },
  { value: 'CNY', serverId: null },
  { value: 'COP', serverId: null },
  { value: 'CZK', serverId: null },
  { value: 'DKK', serverId: null },
  { value: 'EGP', serverId: null },
  { value: 'EUR', serverId: null },
  { value: 'GBP', serverId: null },
  { value: 'HKD', serverId: null },
  { value: 'HUF', serverId: null },
  { value: 'IDR', serverId: null },
  { value: 'ILS', serverId: null },
  { value: 'INR', serverId: null },
  { value: 'JPY', serverId: null },
  { value: 'KES', serverId: null },
  { value: 'KRW', serverId: null },
  { value: 'MAD', serverId: null },
  { value: 'MMK', serverId: null },
  { value: 'MXN', serverId: null },
  { value: 'MYR', serverId: null },
  { value: 'NGN', serverId: null },
  { value: 'NOK', serverId: null },
  { value: 'NPR', serverId: null },
  { value: 'NZD', serverId: null },
  { value: 'PEN', serverId: null },
  { value: 'PHP', serverId: null },
  { value: 'PLN', serverId: null },
  { value: 'RON', serverId: null },
  { value: 'RUB', serverId: null },
  { value: 'SEK', serverId: null },
  { value: 'SGD', serverId: null },
  { value: 'THB', serverId: null },
  { value: 'TRY', serverId: null },
  { value: 'TWD', serverId: null },
  { value: 'TZS', serverId: null },
  { value: 'UAH', serverId: null },
  { value: 'USD', serverId: null },
  { value: 'UYU', serverId: null },
  { value: 'VND', serverId: null },
  { value: 'XOF', serverId: null },
  { value: 'ZAR', serverId: null },
];

const optionsMock: SelectGroupOption[] = Array.from(Array(1), (_, i) => {
  return {
    groupName: 'all currencies',
    options: map(currencies, (currency) => ({
      value: currency.value,
      id: currency.value,
      selected: null,
    })),
  };
});

const value: InputSingleSelectValue = {
  inputValue: 100,
  selectValue: 'USD',
};

story.add(
  'Split input single select',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: object('value', value, 'Props'),
        inputType: select('type', InputTypes, InputTypes.number, 'Props'),
        label: text('label', 'Base salary', 'Props'),
        description: text('description', mockText(30), 'Props'),
        disabled: boolean('disabled', false, 'Props'),
        selectDisabled: boolean('selectDisabled', false, 'Props'),
        required: boolean('required', false, 'Props'),
        readonly: boolean('readonly', false, 'Props'),
        hintMessage: text(
          'hintMessage',
          'This field should contain something',
          'Props'
        ),
        errorMessage: text('errorMessage', '', 'Props'),
        elementChange: action('Split input single select change'),
        selectOptions: object('selectOptions', optionsMock, 'Options'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          SplitInputSingleSelectModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
