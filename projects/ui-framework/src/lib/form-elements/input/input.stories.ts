import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs,
  number,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { InputModule } from './input.module';
import { InputAutoCompleteOptions, InputTypes } from './input.enum';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { mockText } from '../../mock.const';

import formElemsPropsDoc from '../form-elements.properties.md';
import inputElemsPropsDoc from '../input.properties.md';
import { FormElementSize } from '../form-elements.enum';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const inputTypes = values(InputTypes);
const inputAutoCompleteOptions = values(InputAutoCompleteOptions);

const template = `
<b-input    [inputType]="inputType"
            [value]="(inputType === inputTypes.number ? valueNum : value) || nullValue"
            [label]="label"
            [description]="description"
            [placeholder]="placeholder"
            [hideLabelOnFocus]="hideLabelOnFocus"
            [minChars]="minChars"
            [maxChars]="maxChars"
            [showCharCounter]="showCharCounter"
            [step]="step"
            [min]="min"
            [max]="max"
            [numberFormat]="numberFormat"
            [onlyIntegers]="onlyIntegers"
            [readonly]="readonly"
            [disabled]="disabled"
            [required]="required"
            [hintMessage]="hintMessage"
            [warnMessage]="warnMessage"
            [errorMessage]="errorMessage"
            [enableBrowserAutoComplete]="enableBrowserAutoComplete"
            [size]="size"
            (inputEvents)="inputEvents($event)">
</b-input>
`;

const templateForNotes = `
<b-input    [inputType]="inputType"
            [value]="value"
            [label]="label"
            [description]="description"
            [placeholder]="placeholder"
            [hideLabelOnFocus]="hideLabelOnFocus"
            [minChars]="minChars"
            [maxChars]="maxChars"
            [showCharCounter]="showCharCounter"
            [step]="step"
            [min]="min"
            [max]="max"
            [numberFormat]="numberFormat"
            [onlyIntegers]="onlyIntegers"
            [readonly]="readonly"
            [disabled]="disabled"
            [required]="required"
            [hintMessage]="hintMessage"
            [warnMessage]="warnMessage"
            [errorMessage]="errorMessage"
            [enableBrowserAutoComplete]="enableBrowserAutoComplete"
            (inputEvents)="inputEvents($event)">
</b-input>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Input'">
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
  ${templateForNotes}
  ~~~

  #### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [inputType] | InputTypes | type of input field | text
  [min] | number | (only relevant for number inputs) minimum value (value will be corrected on blur).<br> \
  *Note:* Defaults to 0, so negative numbers are discarded. \
  Set to null, undefined or some negative value to allow negative numbers | <u>0</u>
  [max] | number | (only relevant for number inputs) maximum value (value will be corrected on blur) | &nbsp;
  [step] | number | Step value for number input step buttons.\
   Buttons will not be displayed, if step value is not provided.<br> \
   *Note:* When using the step buttons, the number value will be rounded to the decimal places \
   of the step (if step is 3, value of 5.5 + 3 will be rounded to 9). | &nbsp;
  [numberFormat] | boolean | (for input type number only) enable number formatting with commas ('1,234.05') | false
  [onlyIntegers] | boolean | (for input type number only) set to true to not allow fractions | false

  ${inputElemsPropsDoc}

  ${formElemsPropsDoc}
`;
story.add(
  'Input',
  () => {
    return {
      template: storyTemplate,
      props: {
        inputTypes: InputTypes,
        nullValue: null,
        inputEvents: action('Input event'),
        inputType: select('inputType', inputTypes, InputTypes.number),
        value: text('value (text input)', ''),
        valueNum: number('value (number input)', ''),
        label: text('label', 'Input label'),
        description: text('description', mockText(30)),
        placeholder: text('placeholder', 'Input placeholder'),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        minChars: number('minChars', ''),
        maxChars: number('maxChars', ''),
        showCharCounter: boolean('showCharCounter', true),
        min: number('min', undefined),
        max: number('max', undefined),
        step: number('step', 1),
        numberFormat: boolean('numberFormat', false),
        onlyIntegers: boolean('onlyIntegers', false),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        readonly: boolean('readonly', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
        enableBrowserAutoComplete: select(
          'enableBrowserAutoComplete',
          inputAutoCompleteOptions,
          InputAutoCompleteOptions.off
        ),
        size: select(
          'size',
          Object.values(FormElementSize),
          FormElementSize.regular
        ),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, InputModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
