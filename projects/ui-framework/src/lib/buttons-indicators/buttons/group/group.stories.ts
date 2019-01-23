import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { ButtonsModule } from '../buttons.module';
import { IconsModule } from '../../../icons/icons.module';
import { ButtonType } from '../buttons.enum';
import { Icons, IconSize } from '../../../icons/icons.enum';
import { values } from 'lodash';
import {ComponentGroupType} from '../../../consts';

const buttonStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const typeOptions = values(ButtonType);
const template = `
  <b-group>
    <b-square-button type="${ButtonType.secondary}">
      <b-icon icon="${Icons.skype_link}" size="${IconSize.mini}"></b-icon>
    </b-square-button>
    <b-square-button type="${ButtonType.secondary}">
      <b-icon icon="${Icons.phone_link}" size="${IconSize.mini}"></b-icon>
    </b-square-button>
    <b-square-button type="${ButtonType.secondary}">
      <b-icon icon="${Icons.slack_link}" size="${IconSize.mini}"></b-icon>
    </b-square-button>
  </b-group>
`;
const note = `
  ## Group Element

  component for grouping the child components, mainly use for buttons group
  ~~~
  ${template}
  ~~~
`;
buttonStories.add(
    'Group', () => ({
      template,
      props: {
      },
      moduleMetadata: {
        imports: [ButtonsModule, IconsModule]
      }
    }),
    { notes: { markdown: note }  }
  );

