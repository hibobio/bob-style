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

// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
// @ts-ignore: md file and not a module
import inputElemsPropsDoc from '../input.properties.md';
import { FormElementSize } from '../form-elements.enum';
import { FormElementsCommonProps } from '../form-elements.stories.common';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const inputTypes = values(InputTypes);
const inputAutoCompleteOptions = values(InputAutoCompleteOptions);

const template2 = `<b-input  [value]="(inputType === inputTypes.number ? valueNum : value)"
          [spec]="{
            inputType: inputType,
            label: label,
            description: description,
            placeholder: placeholder,
            hideLabelOnFocus: hideLabelOnFocus,
            minChars: minChars,
            maxChars: maxChars,
            showCharCounter: showCharCounter,
            step: step,
            min: min,
            max: max,
            numberFormat: numberFormat,
            onlyIntegers: onlyIntegers,
            decimals: decimals,
            readonly: readonly,
            disabled: disabled,
            required: required,
            hintMessage: hintMessage,
            warnMessage: warnMessage,
            errorMessage: errorMessage,
            size: size,
            allowedChars: allowedChars,
            focusOnInit: focusOnInit
          }"
           [allowedChars]="allowedChars"
            (inputEvents)="inputEvents($event)">
</b-input>`;

const template = `<b-input    [inputType]="inputType"
            [value]="(inputType === inputTypes.number ? valueNum : value)"
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
            [decimals]="decimals"
            [readonly]="readonly"
            [disabled]="disabled"
            [required]="required"
            [hintMessage]="hintMessage"
            [warnMessage]="warnMessage"
            [errorMessage]="errorMessage"
            [size]="size"
            [allowedChars]="allowedChars"
            (inputEvents)="inputEvents($event)">
</b-input>`;

const templateForNotes = `<b-input    [inputType]="inputType"
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
            (inputEvents)="inputEvents($event)">
</b-input>`;

const storyTemplate = `
<b-story-book-layout [title]="'Input'">
  <div style="max-width: 300px;">
    ${template2}
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
  [decimals] | number | max number of decimals | 3
  [allowedChars] | string/RegExp | regex-compatible string, representing a list of allowed characters (example: \`"\\w"\` - for only letters and numbers, \`"123"\` - for only 1, 2 and 3). <br>\
  every typed character will be matched against this list and all non-matching characters will be rejected. | &nbsp;

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
        inputType: select('inputType', inputTypes, InputTypes.text),
        value: text('value (text input)', ''),
        valueNum: number('value (number input)', ''),

        ...FormElementsCommonProps('Input label', 'Input placeholder'),

        minChars: number('minChars', undefined),
        maxChars: number('maxChars', undefined),
        showCharCounter: boolean('showCharCounter', true),
        min: number('min', undefined),
        max: number('max', undefined),
        step: number('step', 1),
        numberFormat: boolean('numberFormat', false),
        onlyIntegers: boolean('onlyIntegers', false),
        decimals: number('decimals', 4),

        size: select(
          'size',
          Object.values(FormElementSize),
          FormElementSize.regular
        ),
        allowedChars: text('allowedChars', ''),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, InputModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
