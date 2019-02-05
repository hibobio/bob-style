import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from './checkbox.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const inputStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Checkbox">
  <b-checkbox (checkboxChange)="checkboxChange($event)"
              [value]="value"
              [label]="label"
              [disabled]="disabled"
              [required]="required">
  </b-checkbox>
</b-story-book-layout>
`;

const note = `
  ## Checkbox Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
  value | boolean | start checkbox state
  label | string | label text
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
        label: text('label', 'Check this'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          CheckboxModule,
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
