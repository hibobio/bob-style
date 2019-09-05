import { storiesOf } from '@storybook/angular';
import { text, object, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { Icons } from '../../../icons/icons.enum';
import { SelectGroupOption } from '../list.interface';
import { MultiSelectPanelModule } from './multi-select-panel.module';
import { ButtonType } from '../../../buttons/buttons.enum';
import { action } from '@storybook/addon-actions';

const inputStories = storiesOf(
  ComponentGroupType.Lists,
  module
).addDecorator(withKnobs);

const componentTemplate1 = `
<b-multi-select-panel [chevronButtonText]="chevronButtonText"
                      [options]="options">
</b-multi-select-panel>
`;

const componentTemplate2 = `
<b-multi-select-panel [options]="options">
  <b-square-button type="${ ButtonType.secondary }"
                   icon="${ Icons.table }">
  </b-square-button>
</b-multi-select-panel>
`;

const template = `
<b-story-book-layout [title]="'Multi select panel'">
  <div style="max-width: 400px;">
  ${ componentTemplate1 }
  &nbsp;&nbsp;
  ${ componentTemplate2 }
  </div>
</b-story-book-layout>
`;

const note = `
  ## Multi list panel

  #### Module
  *MultiListMenuModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | ---
  chevronButtonText | string | text to be displayed in chevron-button | null - can use transclude instead
  options | SelectGroupOptions[] | select option | null
  selectChange | ListChange | output on select change

  ~~~
  ${ componentTemplate1 }
  ~~~

  ~~~
  ${ componentTemplate2 }
  ~~~
`;

const optionsMock: SelectGroupOption[] = [
  {
    groupName: 'Basic info',
    options: [
      {
        value: 'First name',
        id: '/root/firstName',
        selected: false,
      },
      {
        value: 'Last name',
        id: '/root/latName',
        selected: false,
      },
      {
        value: 'Display name',
        id: '/root/displayName',
        selected: false,
      },
    ],
  },
  {
    groupName: 'Personal',
    options: [
      {
        value: 'Personal email',
        id: '/personal/personalEmail',
        selected: false,
      },
      {
        value: 'personal phone',
        id: '/personal/personalPhone',
        selected: false,
      },
      {
        value: 'Personal mobile',
        id: '/personal/personalMobile',
        selected: false,
      },
    ],
  },
  {
    groupName: 'Work',
    options: [
      {
        value: 'Reports to',
        id: '/work/reportsTo',
        selected: false,
      },
      {
        value: 'Start date',
        id: '/work/startDate',
        selected: false,
      },
      {
        value: 'Site',
        id: '/work/siteId',
        selected: false,
      },
    ],
  },
  {
    groupName: 'Address',
    options: [
      {
        value: 'City',
        id: '/address/city',
        selected: false,
      },
      {
        value: 'Country',
        id: '/address/country',
        selected: false,
      },
      {
        value: 'State',
        id: '/address/state',
        selected: false,
      },
    ],
  },
];

optionsMock[0].options[1].selected = true;

inputStories.add(
  'Multi list panel',
  () => {
    return {
      template,
      props: {
        chevronButtonText: text('chevronButtonText', 'Select field'),
        options: object('options', optionsMock),
        selectChange: action('Multi select panel change'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          ButtonsModule,
          MultiSelectPanelModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
