import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { ButtonType } from '../buttons.types';
import { values } from 'lodash';
import { Icons, IconSize } from '../../icons/icons.enum';

const buttonStories = storiesOf('Buttons & Indicators', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const typeOptions = values(ButtonType);
const template = `
  <b-square-button
    (clicked)="onClick($event)"
    [type]="type">
    <b-icon icon="${Icons.phone_link}" size="${IconSize.mini}"></b-icon>
  </b-square-button>
`;
const note = `
  ## Square Button Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | ButtonType | enum for setting the button type | primary (optional)
  clicked | Function | callback for clicking on the button |

  #### Style customization

  property name | Description
  --- | ---
  primary-color | the color of the primary button
  primary-color-dark | the hover color of the primary button
  primary-color-darker | the pressed color of the primary button

  ~~~
  ${template}
  ~~~
`;
buttonStories.add(
    'Square Button', () => ({
      template,
      props: {
        onClick: action(),
        type: select('type', typeOptions, ButtonType.primary),
      },
      moduleMetadata: {
        imports: [ButtonsModule]
      }
    }),
    { notes: { markdown: note }  }
  );

