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

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const inputTypes = values(InputTypes);
const inputAutoCompleteOptions = values(InputAutoCompleteOptions);

const template = `
<b-input    [inputType]="'number'"
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

  #### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [inputType] | InputTypes | type of input field | text
  [value] | string/number | value of input field | &nbsp;
  [label] | string | label text (above input) | &nbsp;
  [description] | string | description text (above icon) | &nbsp;
  [placeholder] | string | placeholder text (inside input) | &nbsp;
  [hideLabelOnFocus] | boolean | if true: there will be no label above\
   input, label text (if present) will be used as placeholder | false
  [minChars] | number | minimum length | &nbsp;
  [maxChars] | number | maximum length.<br> \
  *Note:* It might not make sense to provide minChars/maxChars for number-type inputs, but if you do, \
  the input will be limited by number of digits.  | &nbsp;
  [showCharCounter] | boolean | set to false to hide character counter | true
  [min] | number | (only relevant for number inputs) minimum value (value will be corrected on blur). \
  *Note*: Defaults to 0, so negative numbers are discarded. \
  Set to null, undefined or some negative value to allow negative numbers | <u>0</u>
  [max] | number | (only relevant for number inputs) maximum value (value will be corrected on blur) | &nbsp;
  [step] | number | Step value for number input step buttons.\
   Buttons will not be displayed, if step value is not provided.<br> \
   *Note:* When using the step buttons, the number value will be rounded to the decimal places \
   of the step (if step is 3, value of 5.5 + 3 will be rounded to 9). | &nbsp;
  [readonly] | boolean | disables input | false
  [disabled] | boolean | is field disabled | false
  [required] | boolean | is field required | false
  [hintMessage] | string | hint text | &nbsp;
  [warnMessage] | string | warning text | &nbsp;
  [errorMessage] | string | error text | &nbsp;
  [enableBrowserAutoComplete] | InputAutoCompleteOptions | shows browser autocomplete options | off
  (inputEvents) | EventEmitter<wbr>&lt;InputEvent&gt; | input events emitter | &nbsp;

  ~~~
  ${template}
  ~~~
`;
story.add(
  'Input',
  () => {
    return {
      template: storyTemplate,
      props: {
        inputEvents: action('Input event'),
        inputType: select('inputType', inputTypes, InputTypes.text),
        value: text('value', ''),
        label: text('label', 'Input label'),
        description: text('description', mockText(30)),
        placeholder: text('placeholder', 'Input placeholder'),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        minChars: number('minChars', ''),
        maxChars: number('maxChars', 30),
        showCharCounter: boolean('showCharCounter', true),
        min: number('min', 5),
        max: number('max', 30),
        step: number('step', 3),
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
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, InputModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
