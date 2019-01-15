import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { InputModule } from './input.module';
import { InputAutoCompleteOptions, InputTypes } from './input.enum';
import {ComponentGroupType} from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const inputStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const inputTypes = values(InputTypes);
const inputAutoCompleteOptions = values(InputAutoCompleteOptions);

const template = `
<b-input style="display:block; width: 600px;"
        [inputType]="inputType"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        [errorMessage]="errorMessage"
        [hideLabelOnFocus]="hideLabelOnFocus"
        [enableBrowserAutoComplete]="enableBrowserAutoComplete"
        [hintMessage]="hintMessage"
        (inputEvents)="inputEvents($event)">
</b-input>
`;


const note = `
  ## Input Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
  type | InputType | type of input field
  value | string/number/float | type of input field
  placeholder | string | placeholder text
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | text | hint text
  errorMessage | text | error text
  enableBrowserAutoComplete | InputAutoCompleteOptions | shows browser autocomplete options
  hideLabelOnFocus | boolean | hides label on focus
  inputEvents | InputEvents | input events emitter

  ~~~
  ${ template }
  ~~~
`;
inputStories.add(
  'Input',
  () => {
    return {
      template,
      props: {
        inputEvents: action(),
        inputType: select('inputType', inputTypes, InputTypes.text),
        value: text('value', ''),
        placeholder: text('placeholder', 'placeholder text'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        hintMessage: text('hintMessage', 'this field should contain something'),
        errorMessage: text('errorMessage', ''),
        enableBrowserAutoComplete: select('enableBrowserAutoComplete', inputAutoCompleteOptions, InputAutoCompleteOptions.off),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, InputModule]
      }
    };
  },
  { notes: { markdown: note } }
);
