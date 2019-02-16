import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, number, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { DatepickerModule } from './datepicker.module';
import { ComponentGroupType } from '../../consts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const datepickerStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);
const template = `
<b-datepicker style="width: 400px;"
              (dateChange)="dateChange($event)"
              [inputLabel]="inputLabel"
              [dateFormat]="dateFormat">
</b-datepicker>
`;

const storyTemplate = `
<b-story-book-layout title="Datepicker">
  ${ template }
</b-story-book-layout>
`;

const note = `
  ## Slider Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  inputLabel | string | Input label | mandatory |
  dateFormat | string | Input date format | DD/MM/YYYY (optional) |
  dateChange | EventEmitter | Date change callback |

  ~~~
  ${template}
  ~~~
`;

datepickerStories.add(
  'Datepicker',
  () => {
    return {
      template: storyTemplate,
      props: {
        inputLabel: text('inputLabel', 'Choose a date'),
        dateFormat: text('dateFormat', 'DD/MM/YYYY'),
        dateChange: action(),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DatepickerModule,
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note }  }
);
