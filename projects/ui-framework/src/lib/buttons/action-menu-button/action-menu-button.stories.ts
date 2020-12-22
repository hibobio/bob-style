import { ComponentGroupType } from '../../consts';
import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '../../buttons/buttons.module';
import { buttonConfigMock, menuItemsMock } from './action-menu-button.mock';
import { object, boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Buttons, module).addDecorator(
  withKnobs
);

const template = `
  <b-action-menu-button
            [menuItems]="menuItems"
            [openLeft]="openLeft"
            [buttonConfig]="buttonConfig"
            (actionClick)="actionClick($event)">
  </b-action-menu-button>
`;

const note = `
  ## Action Menu Button
  #### Module
  *ButtonsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [menuItems] | MenuItem[] | menu items | []
  [openLeft] | boolean | open left | false
  [buttonConfig] | ButtonConfig | button config | { type: ButtonType.tertiary, icon: Icons.three_dots_vert,\
   color: IconColor.normal }
  (actionClick) | EventEmitter | emited on menu click | &nbsp;

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Action menu button'">
<div style="text-align: center; max-width: 100%;">
    ${template}
</div>
</b-story-book-layout>
`;

story.add(
  'Action menu button',
  () => {
    return {
      template: storyTemplate,
      props: {
        menuItems: object('menuItems', menuItemsMock),
        openLeft: boolean('openLeft', false),
        buttonConfig: object('buttonConfig', buttonConfigMock),
        actionClick: action('menu clicked'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          ButtonsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
