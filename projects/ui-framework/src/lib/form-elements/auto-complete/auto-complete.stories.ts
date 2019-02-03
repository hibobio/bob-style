import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs, number } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteModule } from './auto-complete.module';

const textareaStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-auto-complete style="display:block; width: 400px;"
                [label]="label"
                [value]="value"
                [disabled]="disabled"
                [required]="required"
                [errorMessage]="errorMessage"
                [hintMessage]="hintMessage"
                (inputEvents)="inputEvents($event)">
</b-auto-complete>
`;


const note = `
  ## Auto complete Element

  #### Properties

  Name | Type | Description
  label | string | label text
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | text | hint text
  errorMessage | text | error text
  onSelect | id | input events emitter

  ~~~
  ${ template }
  ~~~
`;
textareaStories.add(
  'Auto Complete',
  () => {
    return {
      template,
      props: {
        onSelect: action(),
        value: text('value', ''),
        label: text('label', 'label text'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'this field should contain something'),
        errorMessage: text('errorMessage', ''),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          AutoCompleteModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
