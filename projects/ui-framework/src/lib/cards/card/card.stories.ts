import { storiesOf } from '@storybook/angular';
import { object, select, withKnobs } from '@storybook/addon-knobs/angular';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { CardsModule } from '../cards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { CardsMockData } from '../cardsMockData';
import { CardType } from '../cards.enum';

import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { SliderModule } from '../../buttons-indicators/slider/slider.module';
import { SliderComponent } from '../../buttons-indicators/slider/slider.component';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(withKnobs);

const template = `
<b-card [card]="cardData"
        [type]="type">
</b-card>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single Card'">
  <div style="width:280px; margin: 100px auto;">
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

  #### card: CardData - single card data properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  data | CardDataType | card data | none
  menu | MenuItem[] | array of menu items | none (optional)

  *Note:* For desctiption of [data: CardDataType] properties, see <u>Cards Layout</u> story.

`;

story.add(
  'Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(CardType), CardType.primary),
        cardData: object('card', CardsMockData[1])
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule, AvatarModule, SliderModule],
        entryComponents: [AvatarComponent, SliderComponent]
      }
    };
  },
  { notes: { markdown: note } }
);
