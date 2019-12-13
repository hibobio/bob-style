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
<b-input
        [inputType]="inputType"
        [value]="value"
        [label]="label"
        [description]="description"
        [placeholder]="placeholder"
        [hideLabelOnFocus]="hideLabelOnFocus"
        [minChars]="minChars"
        [maxChars]="maxChars"
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
  Name | Type | Description
  --- | --- | ---
  [inputType] | InputTypes | type of input field
  [value] | string/number | value of input field
  [label] | string | label text (above input)
  [description] | string | description text (above icon)
  [placeholder] | string | placeholder text (inside input)
  [hideLabelOnFocus] | boolean | if true: there will be no label above\
   input, label text (if present) will be used as placeholder
  [minChars] | number | minimum length
  [maxChars] | number | maximum length
  [min] | number | (only relevent for number inputs) minimum value (value will be corrected on blur)
  [max] | number | (only relevent for number inputs) maximum value (value will be corrected on blur)
  [readonly] | boolean | disables input
  [disabled] | boolean | is field disabled
  [required] | boolean | is field required
  [hintMessage] | string | hint text
  [warnMessage] | string | warning text
  [errorMessage] | string | error text
  [enableBrowserAutoComplete] | InputAutoCompleteOptions | shows browser autocomplete options
  (inputEvents) | EventEmitter<wbr>&lt;InputEvent&gt; | input events emitter

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
        min: number('min', 5),
        max: number('max', 30),
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
