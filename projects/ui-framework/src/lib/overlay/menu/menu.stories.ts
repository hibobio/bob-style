import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { ButtonSize, ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { MenuModule } from './menu.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { IconColor, Icons, IconSize } from '../../icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const menuStories = storiesOf(ComponentGroupType.Overlay, module)
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
          BrowserAnimationsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
