import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { array, boolean, number, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { MenuModule } from './menu.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { Icons } from '../../icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const menuStories = storiesOf(ComponentGroupType.Overlay, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Actions menu">
  <b-menu style="position: absolute; top: 20px; left: 20px;"
          [actionsModel]="actionsModel">
    <b-square-button menu-trigger
                    type="${ ButtonType.secondary }"
                    icon="${ Icons.three_dots }">
    </b-square-button>
 </b-menu>
</b-story-book-layout>
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

const actionsModelMock = [
  {
    displayName: 'Employee',
    children: [
      {
        displayName: 'Update work details',
        children: [
          {
            displayName: 'Update site',
            action: ($event) => console.log('update site', $event),
          },
          {
            displayName: 'Update email',
            action: ($event) => console.log('update email', $event),
          },
          {
            displayName: 'Update reports to',
            action: ($event) => console.log('update reports to', $event),
          },
        ]
      },
      {
        displayName: 'Update internal details',
        children: [
          {
            displayName: 'Terminate',
            action: ($event) => console.log('terminate', $event),
          },
          {
            displayName: 'Rehire',
            action: ($event) => console.log('rehire', $event),
          }
        ]
      },
      {
        displayName: 'Delete file',
        action: ($event) => console.log('delete file', $event),
      }
    ]
  },
  {
    displayName: 'View profile',
    action: ($event) => console.log('view profile', $event),
  },
  {
    displayName: 'Request time-off',
    action: ($event) => console.log('request time off', $event),
  }
];

menuStories.add(
  'Menu',
  () => {
    return {
      template,
      props: {
        actionsModel: object<any>('actionsModel', actionsModelMock),
      },
      moduleMetadata: {
        imports: [
          MenuModule,
          ButtonsModule,
          IconsModule,
          BrowserAnimationsModule,
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
