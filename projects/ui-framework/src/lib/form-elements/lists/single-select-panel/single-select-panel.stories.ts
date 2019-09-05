import { storiesOf } from '@storybook/angular';
import { text, object, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { Icons } from '../../../icons/icons.enum';
import { SelectGroupOption } from '../list.interface';
import { SingleSelectPanelModule } from './single-select-panel.module';
import { ButtonType } from '../../../buttons/buttons.enum';
import { action } from '@storybook/addon-actions';

const inputStories = storiesOf(
  ComponentGroupType.Lists,
  module
).addDecorator(withKnobs);

const componentTemplate1 = `
<b-single-select-panel [chevronButtonText]="chevronButtonText"
                       [options]="options"
                       (selectChange)="selectChange($event)">
</b-single-select-panel>
`;

const componentTemplate2 = `
<b-single-select-panel [options]="options"
                       (selectChange)="selectChange($event)">
  <b-square-button type="${ ButtonType.secondary }"
                   icon="${ Icons.table }">
  </b-square-button>
</b-single-select-panel>
`;

const template = `
<b-story-book-layout [title]="'Single select panel'">
  <div style="max-width: 400px;">
  ${ componentTemplate1 }
  &nbsp;&nbsp;
  ${ componentTemplate2 }
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single list panel

  #### Module
  *SingleSelectPanelModule*

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

const categories = [
  'Basic info',
  'Personal',
  'Personal contact details',
  'Identification',
  'Work',
  'About',
  'Address',
  'Financial',
  'Payroll',
  'Employment',
  'Equity',
];

const optionsMock: SelectGroupOption[] = [
  {
    groupName: 'Categories',
    options: categories.map(category => {
      return {
        value: category,
        id: category,
        selected: false,
      };
    }),
  }
];

optionsMock[0].options[1].selected = true;

inputStories.add(
  'Single list panel',
  () => {
    return {
      template,
      props: {
        chevronButtonText: text('chevronButtonText', 'Jump to section'),
        options: object('options', optionsMock),
        selectChange: action('Single select panel change'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          ButtonsModule,
          SingleSelectPanelModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
