import { storiesOf } from '@storybook/angular';
import { object, select, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { CardsModule } from '../cards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CardType } from '../cards.enum';
import { EmployeeCardsMockData } from '../cards.mock';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
<b-card-employee [card]="card"
                 [type]="type"
                 (clicked)="clicked($event)">
  <div card-bottom data-min-lines="2"><b>Likes:</b> cycling, hiking, code, food & drinks, music, design</div>
</b-card-employee>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Employee Card'">
  <div style="max-width:240px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Employee Card

  #### Module
  *CardsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | CardType | Card theme | primary
  [card] | EmployeeCard | card contents data | &nbsp;
  (clicked) | EventEmitter | handler of Card Clicked event | &nbsp;

  #### interface
  ~~~
  export interface CardEmployee {
    imageSource: string;
    title: string;
    subtitle?: string;
    id?: string;
    social?: CardEmployeeSocial;
    coverColors?: CardEmployeeCoverColors;
  }

  export interface CardEmployeeSocial {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  }

  export interface CardEmployeeCoverColors {
    color1: string;
    color2: string;  // provide same as color1 for solid color, otherwise it will be gradient
  }
  ~~~
`;

story.add(
  'Employee Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(CardType), CardType.large),
        card: object('card', EmployeeCardsMockData[0]),
        clicked: action('Employee avatar clicked'),
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
        entryComponents: [],
      },
    };
  },
  { notes: { markdown: note } }
);
