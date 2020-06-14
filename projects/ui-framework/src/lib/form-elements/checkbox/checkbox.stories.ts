import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from './checkbox.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import formElemsPropsDoc from '../form-elements.properties.md';
import { mockText } from '../../mock.const';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-checkbox (checkboxChange)="checkboxChange($event)"
            [value]="value"
            [label]="label"
            [placeholder]="placeholder"
            [indeterminate]="indeterminate"
            [disabled]="disabled"
            [required]="required"
            [readonly]="readonly"
            [description]="description"
            [hintMessage]="hintMessage"
            [warnMessage]="warnMessage"
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

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [value] | boolean | start checkbox state
  [indeterminate] | boolean | indeterminate state
  (checkboxChange) | EventEmitter<wbr>&lt;InputEvent&gt; | checkboxChange emitter

  ${formElemsPropsDoc}

`;
story.add(
  'Checkbox',
  () => {
    return {
      template: storyTemplate,
      props: {
        checkboxChange: action('checkboxChange'),
        value: boolean('value', true),
        label: text('label', 'Form element label'),
        placeholder: text('placeholder', 'Check this'),
        indeterminate: boolean('indeterminate', false),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        readonly: boolean('readonly', false),
        hintMessage: text('hintMessage', 'Usefull hint'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
        description: text('description', mockText(15)),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          CheckboxModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
