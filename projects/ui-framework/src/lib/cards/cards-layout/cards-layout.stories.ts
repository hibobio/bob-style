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
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { CardsModule } from '../cards.module';

import {
  CardsMockData,
  AddCardMockData,
  EmployeeCardsMockData
} from '../cards.mock';
import { CardType } from '../cards.enum';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { SliderModule } from '../../buttons-indicators/slider/slider.module';
import { SliderComponent } from '../../buttons-indicators/slider/slider.component';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
<b-cards
    [type]="type"
    [cards]="cardsData"
    [addCard]="addCard"
    (cardClicked)="cardClickHandler($event)">
</b-cards>
`;

const template2 = `
<b-cards
    [type]="type"
    [cards]="employeeCardsData"
    (cardClicked)="cardClickHandler($event)">
</b-cards>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Cards Layout'">
  <div style="min-width:100%; min-height: 100%; padding: 30px; background: rgb(247,247,247);">
  <h3>Cards</h3>
    ${template}
    <br><br>
    <h3>Employee Cards</h3>
    ${template2}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Cards Layout

  #### Module
  *CardsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | CardType | Card theme | primary (optional)
  addCard | AddCardData | data for the Add New card | none (optional)
  cards | CardData[] | Array with card data | none
  cardClicked | Function | card click handler (event transmits {card: CardData, cardIndex: number}) | none

  #### cards[0]: CardData - single card data properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  data | CardDataType | card data | none
  menu | MenuItem[] | array of menu items | none (optional)

  #### data: CardDataType - card contents properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  text | string | main card text | none
  header | string  | text to put in card header | none
  - | RenderedComponent  | object describing a Component to be displayed in the card header | none
  footer | string  | text to put in card footer | none
  - | RenderedComponent  | object describing a Component to be displayed in the card footer | none
  avatar | Avatar | <u>for employee-card</u> - object describing user avatar: {imageSource, title, subtitle} | none

  *Note:* If using RenderedComponent for footer/header, consumer must
   declare the component to be used in entryComponents section of the module

  *Note 2:*  for RenderedComponent properties please see <u>Services / Component Renderer</u> story

  ##### CardData example

\`\`\`
  {
    data: {
      text: 'Compensation update',
      header: {
        component: AvatarComponent,
        attributes: {
          imageSource: 'http://....',
          size: AvatarSize.mini,
          title: 'Dylan Herrera'
        }
      },
      footer: {
        component: SliderComponent,
        attributes: {
          value: 78,
          showLabel: false,
          readOnly: true
        }
      }
    },
    menu: [
      {
        label: 'Do this',
        action: handler()
      }, ...
    ]
  }
\`\`\`

  ##### Employee-card CardData example

\`\`\`
  {
    data: {
      avatar: {
        imageSource: 'http://i.pravatar.cc/200?img=5',
        title: 'Chioke Okonkwo',
        subtitle: 'Business developer'
      }
    }
  }
\`\`\`

`;

const addCardMockData = AddCardMockData;
addCardMockData.action = action('Add Card was clicked');

story.add(
  'Cards Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(CardType), CardType.primary),
        addCard: object('addCard', addCardMockData),
        cardsData: object('cardsData', CardsMockData),
        employeeCardsData: object('employeeCardsData', EmployeeCardsMockData),
        cardClickHandler: action('Card clicked')
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardsModule,
          AvatarModule,
          SliderModule
        ],
        entryComponents: [AvatarComponent, SliderComponent]
      }
    };
  },
  { notes: { markdown: note } }
);
