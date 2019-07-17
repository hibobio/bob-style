import { storiesOf } from '@storybook/angular';
import {
  boolean,
  object,
  select,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { CardsModule } from '../cards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CardsMockData } from '../cards.mock';
import { CardType } from '../cards.enum';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { SliderModule } from '../../buttons-indicators/slider/slider.module';
import { mockAvatar } from '../../mock.const';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const avatarMock = mockAvatar();

const template = `
<b-card [card]="cardData"
        [type]="type"
        [clickable]="clickable"
        (clicked)="cardClickHandler($event)">
  <b-avatar card-top
            [imageSource]="'${avatarMock}'"
            [title]="'Nada Gish'">
  </b-avatar>
  <b-slider card-bottom
            [value]="50"
            [readOnly]="true">
  </b-slider>
</b-card>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single Card'">
  <div style="max-width:280px;">
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
`;

story.add(
  'Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select(
          'type',
          Object.values(CardType).filter(
            t => t === CardType.regular || t === CardType.large
          ),
          CardType.regular
        ),
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
          SliderModule,
          UtilComponentsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
