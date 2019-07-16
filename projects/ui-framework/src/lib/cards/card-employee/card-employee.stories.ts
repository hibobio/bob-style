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

import { EmployeeCardsMockData } from '../cards.mock';
import { CardType } from '../cards.enum';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
<b-card-employee
        [card]="cardData"
        [type]="type"
        [clickable]="clickable"
        (clicked)="cardClickHandler($event)">
</b-card-employee>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Employee Card'">
    ${template}
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
  card | CardEmployee | card contents data | none
  clickable | boolean | is the card clickable? | false
  clicked | Function | handler of Card Clicked event | none

  #### card: CardData - single card data properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  data | CardDataType | card data | none
  data.avatar | Avatar | object describing user avatar: {imageSource, title, subtitle} | none



  *Note:* For more info on [data: CardDataType] properties, see <u>Cards Layout</u> story.

`;

story.add(
  'Employee Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(CardType), CardType.regular),
        clickable: boolean('clickable', true),
        cardData: object('card', EmployeeCardsMockData[0]),
        cardClickHandler: action('Card clicked')
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
