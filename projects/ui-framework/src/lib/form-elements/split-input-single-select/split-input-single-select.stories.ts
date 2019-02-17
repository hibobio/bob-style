import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, number, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SplitInputSingleSelectModule } from './split-input-single-select.module';

const textareaStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-split-input-single-select style="width: 400px;"
                             [hintMessage]="hintMessage"
                             [errorMessage]="errorMessage">
</b-split-input-single-select>
`;

const storyTemplate = `
<b-story-book-layout title="Split input single select">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Split input single select

  #### Properties

  Name | Type | Description
  --- | --- | ---
  currencyValue | CurrencyValue | currency value as CurrencyValue
  label | string | label text
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | text | hint text
  errorMessage | text | error text
  currencyChange | Action | currency change event emitter

  ~~~
  ${ template }
  ~~~
`;
textareaStories.add(
  'Split input single select',
  () => {
    return {
      template: storyTemplate,
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
          StoryBookLayoutModule,
          SplitInputSingleSelectModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
