import { storiesOf } from '@storybook/angular';
import { array, boolean, number, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
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

const menuStories = storiesOf(ComponentGroupType.Overlay, module).addDecorator(withKnobs);

const template = `
<b-menu style="position: absolute; top: 20px; left: 20px;"
        [menu]="menu">
  <b-square-button menu-trigger
                   type="${ ButtonType.secondary }"
                   icon="${ Icons.three_dots }">
  </b-square-button>
</b-menu>
`;

const storyTemplate = `
<b-story-book-layout title="Actions menu">
  ${ template }
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

  ~~~
  ${ template }
  ~~~
`;

const menuMock: MenuItem[] = [
  {
    displayName: 'Employee',
    children: [
      {
        displayName: 'Update work details',
        children: [
          {
            displayName: 'Update site',
            action: ($event) => console.log('update site', $event)
          },
          {
            displayName: 'Update email',
            action: ($event) => console.log('update email', $event)
          },
          {
            displayName: 'Update reports to',
            action: ($event) => console.log('update reports to', $event)
          }
        ]
      },
      {
        displayName: 'Update internal details',
        children: [
          {
            displayName: 'Terminate',
            action: ($event) => console.log('terminate', $event)
          },
          {
            displayName: 'Rehire',
            action: ($event) => console.log('rehire', $event)
          }
        ]
      },
      {
        displayName: 'Delete file',
        action: ($event) => console.log('delete file', $event)
      }
    ]
  },
  {
    displayName: 'View profile',
    action: ($event) => console.log('view profile', $event)
  },
  {
    displayName: 'Request time-off',
    action: ($event) => console.log('request time off', $event)
  }
];

menuStories.add(
  'Menu',
  () => {
    return {
      template: storyTemplate,
      props: {
        menu: object('menu', menuMock),
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          MenuModule,
          ButtonsModule,
          IconsModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
