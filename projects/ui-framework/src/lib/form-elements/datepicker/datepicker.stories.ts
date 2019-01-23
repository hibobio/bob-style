import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, withKnobs, number, boolean} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { DatepickerModule } from './datepicker.module';
import {ComponentGroupType} from '../../consts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

  const datepickerStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);
const template = `
<b-datepicker style="display:block; width: 400px;"
              (dateChange)="dateChange($event)"
              [inputLabel]="inputLabel"
              [dateFormat]="dateFormat">
</b-datepicker>
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
      template,
      props: {
        inputLabel: text('inputLabel', 'Choose a date'),
        dateFormat: text('dateFormat', 'DD/MM/YYYY'),
        dateChange: action(),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DatepickerModule
        ]
      }
    };
  },
  { notes: { markdown: note }  }
);
