import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from './checkbox.module';

const inputStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-checkbox (checkboxChange)="checkboxChange($event)"
            [value]="value"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [required]="required">
</b-checkbox>
`;

const note = `
  ## Checkbox Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
  value | boolean | start checkbox state
  placeholder | string | placeholder text
  disabled | boolean | is field disabled
  required | boolean | is field required
  checkboxChange | checkboxChange | checkboxChange emitter

  ~~~
  ${ template }
  ~~~
`;
inputStories.add(
  'Checkbox',
  () => {
    return {
      template,
      props: {
        checkboxChange: action(),
        value: boolean('value', true),
        placeholder: text('placeholder', 'Check this'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          CheckboxModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
