import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, number, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteModule } from './auto-complete.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SelectGroupOption } from '../lists/list.interface';

const textareaStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-auto-complete style="width: 400px;"
                [options]="options"
                [label]="label"
                [value]="value"
                [disabled]="disabled"
                [required]="required"
                [errorMessage]="errorMessage"
                [hintMessage]="hintMessage"
                (inputEvents)="inputEvents($event)">
</b-auto-complete>
`;

const storyTemplate = `
<b-story-book-layout title="Auto complete">
  ${ template }
</b-story-book-layout>
`;

const optionsMock = [
  {
    id: '1789840653568443152',
    value: 'Pablo Escobar',
    avatar: 'https://cdn.filestackcontent.com/zVtpbknNTF6pQyzdnxNM?policy=eyJoYW5kbGUiOiJ6VnRwYmtuTlRGNnBReXpkbnhOTSIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=db8ddcad4c8bcaa1f08a46f5c43a3748764e6d9c0d6cdd9aee7eaf1996c96d63'
  },
  {
    id: '1720274302193894094',
    value: 'Tia Davidson',
    avatar: 'https://cdn.filepicker.io/api/file/mSZcYn4iRomv8SZg3W8a?signature=a1c1514dd4447b2e2e0316bda9219462e8b792dd4ebdbe79e89b8e2d864cdcb0&policy=eyJoYW5kbGUiOiJtU1pjWW40aVJvbXY4U1pnM1c4YSIsImV4cGlyeSI6NDYzNTkxODcwNH0='
  },
  {
    id: '1720274301447307981',
    value: 'Sarah Gill',
    avatar: 'https://cdn.filepicker.io/api/file/MXMs1ab9TiENC3OZWBjo?signature=3668190ee11cc0e12728e7042e22a2bca055c8cf9a53030ecde4d7d46d9a2db2&policy=eyJoYW5kbGUiOiJNWE1zMWFiOVRpRU5DM09aV0JqbyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
  },
  {
    id: '1720274305876493012',
    value: 'Joy Vance',
    avatar: 'https://cdn.filepicker.io/api/file/8SBH9wxTQCeFszcPB4kz?signature=5de409f4112d5d0c255474231c15254635124fc64e0d155bbf951804f3d27179&policy=eyJoYW5kbGUiOiI4U0JIOXd4VFFDZUZzemNQQjRreiIsImV4cGlyeSI6NDYzNTkxODcwNH0='
  },
];

const note = `
  ## Auto complete Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
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
      template: storyTemplate,
      props: {
        options: object<SelectGroupOption>('options', optionsMock),
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
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
