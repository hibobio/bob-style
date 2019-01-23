import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { BackButtonType } from '../buttons.enum';
import { values, remove } from 'lodash';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import {ComponentGroupType} from '../../../consts';

const backButtonStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const typeOptions = values(BackButtonType);

const template = `
  <b-back-button
    (clicked)="onClick($event)"
    [type]="type">
      {{label}}
  </b-back-button>
`;

const note = `
  ## Back Button Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | BackButtonType | enum for setting the button type | secondary (optional)
  clicked | Function | callback for clicking on the back button |

  ~~~
  ${template}
  ~~~
`;

backButtonStories.add(
  'Back Button', () => ({
    template,
    props: {
      onClick: action(),
      label: text('label', 'Back'),
      type: select('type', typeOptions, BackButtonType.secondary),
    },
    moduleMetadata: {
      imports: [ButtonsModule]
    },
  }),
  { notes: { markdown: note }  }
);
