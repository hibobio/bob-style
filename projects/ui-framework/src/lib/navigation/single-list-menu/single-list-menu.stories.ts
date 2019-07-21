import { storiesOf } from '@storybook/angular';
import { text, object, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { SingleListMenuModule } from './single-list-menu.module';
import { SingleListMenuItem } from './single-list-menu.interface';
import { Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';

const inputStories = storiesOf(
  ComponentGroupType.Navigation,
  module
).addDecorator(withKnobs);

const componentTemplate1 = `
<b-single-list-menu [chevronText]="chevronText"
                    [menu]="menu">
</b-single-list-menu>
`;

const componentTemplate2 = `
<b-single-list-menu [menu]="menu">
  <b-square-button type="${ButtonType.secondary}"
                   icon="${Icons.sidebar_settings}">
</b-square-button>
</b-single-list-menu>
`;

const template = `
<b-story-book-layout [title]="'Single list menu'">
  <div style="max-width: 400px;">
  ${ componentTemplate1 }
  &nbsp;&nbsp;
  ${ componentTemplate2 }
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single list menu

  #### Module
  *SingleListMenuModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | ---
  chevronText | string | text to be displayed in chevron-button | null - can use transclude instead

  ~~~
  ${ componentTemplate1 }
  ~~~

  ~~~
  ${ componentTemplate2 }
  ~~~
`;

const menuMock: SingleListMenuItem[] = [
  {
    label: 'Basic info',
    action: () => console.log('scroll to Basic info'),
  },
  {
    label: 'Personal',
    action: () => console.log('scroll to Personal'),
  },
  {
    label: 'Personal contact details',
    action: () => console.log('scroll to Personal contact details'),
  },
  {
    label: 'Identification',
    action: () => console.log('scroll to Identification'),
  },
  {
    label: 'Work',
    action: () => console.log('scroll to Work'),
  },
  {
    label: 'About',
    action: () => console.log('scroll to About'),
  },
  {
    label: 'Address',
    action: () => console.log('scroll to Address'),
  },
  {
    label: 'Financial',
    action: () => console.log('scroll to Financial'),
  },
  {
    label: 'Payroll',
    action: () => console.log('scroll to Payroll'),
  },
  {
    label: 'Employment',
    action: () => console.log('scroll to Employment'),
  },
  {
    label: 'Equity',
    action: () => console.log('scroll to Equity'),
  },
];

inputStories.add(
  'Single list menu',
  () => {
    return {
      template,
      props: {
        chevronText: text('chevronText', 'Jump to section'),
        menu: object('menu', menuMock),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          ButtonsModule,
          SingleListMenuModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
