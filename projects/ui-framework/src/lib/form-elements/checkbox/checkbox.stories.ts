import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from './checkbox.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-checkbox (checkboxChange)="checkboxChange($event)"
            [value]="value"
            [label]="label"
            [indeterminate]="indeterminate"
            [disabled]="disabled"
            [required]="required"
            [hintMessage]="hintMessage"
            [errorMessage]="errorMessage">
</b-checkbox>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Checkbox'">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Checkbox Element
  #### Module
  *CheckboxModule* or *FormElementsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  value | boolean | start checkbox state
  label | string | label text
  disabled | boolean | is field disabled
  required | boolean | is field required
  indeterminate | boolean | indeterminate state
  checkboxChange | checkboxChange | checkboxChange emitter

  ~~~
  ${template}
  ~~~
`;
inputStories.add(
  'Checkbox',
  () => {
    return {
      template: storyTemplate,
      props: {
        checkboxChange: action(),
        value: boolean('value', true),
        label: text('label', 'Check this'),
        indeterminate: boolean('indeterminate', false),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'Usefull hint'),
        errorMessage: text('errorMessage', '')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          CheckboxModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
