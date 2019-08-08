import { storiesOf } from '@storybook/angular';
import {
  object,
  select,
  withKnobs,
  boolean
} from '@storybook/addon-knobs/angular';
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
                 [avatarIsClickable]="avatarIsClickable"
                 (clicked)="clicked($event)">
  <div card-bottom><b>Likes:</b> cycling, hiking, code, food & drinks, music, design</div>
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
  type | CardType | Card theme | primary (optional)
  card | EmployeeCard | card contents data | none
  avatarIsClickable | boolean | avatar is clickable | false
  clicked | Function | handler of Card Clicked event | none

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
    color2: string;
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
        avatarIsClickable: boolean('avatarIsClickable', true),
        clicked: action('Employee avatar clicked')
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
