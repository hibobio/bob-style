import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { array, boolean, number, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectGroupOption } from '../select.interface';
import { SelectModule } from '../select.module';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const selectStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Single select">
  <b-single-select style="width: 400px;"
                   [options]="options"
                   [label]="label"
                   [value]="value"
                   [hintMessage]="hintMessage"
                   [errorMessage]="errorMessage"
                   [showSingleGroupHeader]="showSingleGroupHeader"
                   [disabled]="disabled"
                   [required]="required"
                   (selectChange)="selectChange($event)">
  </b-single-select>
</b-story-book-layout>
`;

const note = `
  ## Single select Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
  options | SelectGroupOption[] | model of selection group
  value | (string or number) | selected id
  showSingleGroupHeader | boolean | shows header for single groups (default=false)
  selectChange | action | returns selected id
  label | string | label text
  disabled | boolean | is field disabled
  required | boolean | is field required
  hintMessage | text | hint text
  errorMessage | text | error text
  ~~~
  ${ template }
  ~~~
`;

const optionsMock = [
  {
    groupName: 'Basic Info',
    options: [
      { value: 'Basic Info 1', id: 1 },
      { value: 'Basic Info 2', id: 2 },
    ],
  },
  {
    groupName: 'Personal',
    options: [
      { value: 'Personal 1', id: 11 },
      { value: 'Personal 2', id: 12 },
    ],
  },
];

selectStories.add(
  'Single select',
  () => {
    return {
      template,
      props: {
        options: object<SelectGroupOption>('options', optionsMock),
        value: text('value', 2),
        showSingleGroupHeader: boolean('showSingleGroupHeader', false),
        selectChange: action(),
        label: text('label', 'select value'),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        errorMessage: text('errorMessage', ''),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          SelectModule,
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
