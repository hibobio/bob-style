import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { InputModule } from './input.module';
import { InputTypes } from './input.enum';
import {ComponentGroupType} from '../../consts';

const avatarStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const inputTypes = values(InputTypes);

const template = `
  <b-input
    [inputType]="inputType"
    [placeholder]="placeholder"
    [value]="value"
    [disabled]="disabled"
    [required]="required"
    [errorMessage]="errorMessage"
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
  error | text | error text
  inputEvents | InputEvents | input events emitter

  ~~~
  ${ template }
  ~~~
`;
avatarStories.add(
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
        errorMessage: text('errorMessage', ''),
      },
      moduleMetadata: {
        imports: [InputModule]
      }
    };
  },
  { notes: { markdown: note } }
);
