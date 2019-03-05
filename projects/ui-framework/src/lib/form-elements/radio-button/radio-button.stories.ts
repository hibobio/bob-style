import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RadioButtonModule } from './radio-button.module';
import { RadioDirection } from './radio-button.component';
import values from 'lodash/values';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const direction = values(RadioDirection);
const radioStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-radio-button [radioConfig]="radioConfig"
                [value]="value"
                [direction]="direction"
                [disabled]="disabled"
                (radioChange)="radioChange($event)">
</b-radio-button>
`;

const stroyTemplate = `
<b-story-book-layout title="Radio Buttons">
  ${template}
</b-story-book-layout>`;

const note = `
  ## Radio Button Element
  #### Module
  *RadioButtonModule*

  #### Properties

  Name | Type | Description
  --- | --- | ---
  disabled | boolean | is field disabled
  direction | RadioDirection | column or row, default=row
  radioConfig | RadioConfig | radio select config
  value | number | the id of selected option
  radioChange | action | callback with the selected id

  ~~~
  ${template}
  ~~~
`;

radioStories.add(
  'Radio Button',
  () => {
    return {
      template: stroyTemplate,
      props: {
        value: number('value', 11),
        radioConfig: object('radioConfig', [
          { id: 11, label: 'option one' },
          { id: 12, label: 'option two' },
          { id: 13, label: 'option three' }
        ]),
        direction: select('direction', direction, direction.row),
        disabled: boolean('disabled', false),
        radioChange: action()
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, RadioButtonModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
