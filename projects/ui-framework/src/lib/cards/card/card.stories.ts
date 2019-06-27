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

import { CardsMockData } from '../cards.mock';
import { CardType } from '../cards.enum';

import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { SliderModule } from '../../buttons-indicators/slider/slider.module';
import { SliderComponent } from '../../buttons-indicators/slider/slider.component';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
<b-card [card]="cardData"
        [type]="type"
        [clickable]="clickable"
        (clicked)="cardClickHandler($event)">
</b-card>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single Card'">
  <div style="display: flex; width:280px; margin: 50px auto; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single Card

  #### Module
  *CardsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | CardType | Card theme | primary (optional)
  card | CardData | card contents data | none
  clickable | boolean | is the card clickable? | false
  clicked | Function | handler of Card Clicked event | none

  #### card: CardData - single card data properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  data | CardDataType | card data | none
  menu | MenuItem[] | array of menu items | none (optional)

  *Note:* For description of [data: CardDataType] properties, see <u>Cards Layout</u> story.

`;

story.add(
  'Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(CardType), CardType.primary),
        clickable: boolean('clickable', true),
        cardData: object('card', CardsMockData[1]),
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
