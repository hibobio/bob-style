import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs, number } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { TextareaModule } from './textarea.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const textareaStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-textarea style="display:block; width: 400px;"
            [maxChars]="maxChars"
            [label]="label"
            [value]="value"
            [disabled]="disabled"
            [required]="required"
            [errorMessage]="errorMessage"
            [hintMessage]="hintMessage"
            (inputEvents)="inputEvents($event)">
</b-textarea>
`;


const note = `
  ## Textarea Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
  maxChars | number | maximum characters
  value | string/number/float | type of input field
  label | string | label text
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | text | hint text
  errorMessage | text | error text
  inputEvents | InputEvents | input events emitter

  ~~~
  ${ template }
  ~~~
`;
textareaStories.add(
  'Textarea',
  () => {
    return {
      template,
      props: {
        inputEvents: action(),
        maxChars: number('maxChars', ''),
        value: text('value', ''),
        label: text('label', 'label text'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        errorMessage: text('errorMessage', ''),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TextareaModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
