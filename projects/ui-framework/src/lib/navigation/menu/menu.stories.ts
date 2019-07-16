import { storiesOf } from '@storybook/angular';
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
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { MenuModule } from './menu.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { Icons } from '../../icons/icons.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { MenuItem } from './menu.interface';

const menuStories = storiesOf(
  ComponentGroupType.Navigation,
  module
).addDecorator(withKnobs);

const template = `
<b-menu [menu]="menu"
        [openLeft]="openLeft"
        [disabled]="disabled"
        (actionClick)="actionClick()"
        (openMenu)="openMenu()"
        (closeMenu)="closeMenu()">
  <b-square-button menu-trigger
                   type="${ButtonType.secondary}"
                   icon="${Icons.three_dots}">
  </b-square-button>
</b-menu>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Actions menu'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Panel Element

  #### Module
  *MenuModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  menu | MenuItem[] | array of menu items | none
  openLeft | boolean | open left by default | false
  disabled | boolean | disables menu
  actionClick | action | notifies on action click
  openMenu | action | notifies on menu open
  closeMenu | action | notifies on menu close

  ~~~
  ${template}
  ~~~
`;

const menuMock: MenuItem[] = [
  {
    label: 'Employee',
    children: [
      {
        label: 'Update work details',
        key: 'update.work.details',
        children: [
          {
            label: 'Update site',
            action: $event => console.log('update site', $event),
            key: 'update.site'
          },
          {
            label: 'Update email',
            action: $event => console.log('update email', $event)
          },
          {
            label: 'Update reports to',
            disabled: true,
            action: $event => console.log('update reports to', $event)
          }
        ]
      },
      {
        label: 'Update internal details',
        children: [
          {
            label: 'Terminate',
            action: $event => console.log('terminate', $event)
          },
          {
            label: 'Rehire',
            action: $event => console.log('rehire', $event)
          }
        ]
      },
      {
        label: 'Delete file',
        action: $event => console.log('delete file', $event)
      }
    ]
  },
  {
    label: 'View profile',
    action: $event => console.log('view profile', $event)
  },
  {
    label: 'Request time-off',
    disabled: true,
    action: $event => console.log('request time off', $event)
  }
];

menuStories.add(
  'Menu',
  () => {
    return {
      template: storyTemplate,
      props: {
        openLeft: boolean('openLeft', false),
        disabled: boolean('disabled', false),
        menu: object('menu', menuMock),
        actionClick: action('action click'),
        openMenu: action('menu open'),
        closeMenu: action('menu close')
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          MenuModule,
          ButtonsModule,
          IconsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
