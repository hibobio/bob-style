import {storiesOf} from '@storybook/angular';
import {withNotes} from '@storybook/addon-notes';
import {array, boolean, number, object, select, text, withKnobs} from '@storybook/addon-knobs/angular';
import {action} from '@storybook/addon-actions';
import {ComponentGroupType} from '../../consts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RadioButtonModule} from './radio-button.module';
import {RadioDirection} from './radio-button.component';
import { values } from 'lodash';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const radioDirection = values(RadioDirection);
const radioStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Radio">
  <b-radio-button [label]="label" [disabled]="disabled" >
  </b-radio-button>
</b-story-book-layout>
`;

const noteTemplate = `
 <b-radio-button [label]="label" [disabled]="disabled" >
 </b-radio-button>`;

const note = `
  ## Radio Button Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
  label | string | label text
  disabled | boolean | is field disabled
  radioDirection | enum | column/row
  radioDataModel | RadioDataModel | model

  ~~~
  ${noteTemplate}
  ~~~
`;

radioStories.add(
  'Radio Button',
  () => {
    return {
      template,
      props: {
        label: text('label', 'radio option'),
        disabled: boolean('disabled', false),
        radioDataModel: object('radioDataModel', [{id: '1', value: 'radioOne'}, {id: '2', value: 'radioTwo'}]),
        radioDirection: select('radioDirection', radioDirection, radioDirection.row),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          RadioButtonModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  {notes: {markdown: note}}
);

