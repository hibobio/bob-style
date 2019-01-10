import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../consts';
import { ButtonSize, ButtonType } from '../buttons/buttons.enum';
import { MenuModule } from './menu.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { IconsModule } from '../icons/icons.module';
import { IconColor, Icons, IconSize } from '../icons';

const menuStories = storiesOf(ComponentGroupType.Menu, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
  <b-menu>
    <b-square-button menu-trigger
                    type="${ ButtonType.secondary }"
                    size="${ ButtonSize.medium }">
      <b-icon icon="${ Icons.three_dots }"
              size="${ IconSize.mini }"
              color="${ IconColor.dark }">
      </b-icon>
    </b-square-button>
 </b-menu>
`;

const note = `
  ## Panel Element

  #### Properties

  Name | Type | Description
  --- | --- | ---

  ~~~
  ${ template }
  ~~~
`;
menuStories.add(
  'Menu',
  () => {
    return {
      template,
      props: {},
      moduleMetadata: {
        imports: [
          MenuModule,
          ButtonsModule,
          IconsModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
