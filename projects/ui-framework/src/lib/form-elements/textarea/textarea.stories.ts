import { storiesOf } from '@storybook/angular';
import {
  text,
  boolean,
  withKnobs,
  number,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { TextareaModule } from './textarea.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { mockText } from '../../mock.const';

import formElemsPropsDoc from '../form-elements.properties.md';
import inputElemsPropsDoc from '../input.properties.md';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-textarea [value]="value"
            [label]="label"
            [description]="description"
            [placeholder]="placeholder"
            [maxChars]="maxChars"
            [minChars]="minChars"
            [showCharCounter]="showCharCounter"
            [readonly]="readonly"
            [disabled]="disabled"
            [required]="required"
            [hintMessage]="hintMessage"
            [warnMessage]="warnMessage"
            [errorMessage]="errorMessage"
            (inputEvents)="inputEvents($event)">
</b-textarea>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Textarea'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Textarea Element
  #### Module
  *TextareaModule* or *FormElementsModule*

  ~~~
  ${template}
  ~~~

  ${inputElemsPropsDoc}

  ${formElemsPropsDoc}
`;
story.add(
  'Textarea',
  () => {
    return {
      template: storyTemplate,
      props: {
        inputEvents: action('inputEvents'),
        value: text('value', ''),
        label: text('label', 'Input label'),
        description: text('description', mockText(30)),
        placeholder: text('placeholder', 'Input placeholder'),
        maxChars: number('maxChars', 100),
        minChars: number('minChars', 0),
        showCharCounter: boolean('showCharCounter', true),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        readonly: boolean('readonly', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TextareaModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
