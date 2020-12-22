import { storiesOf } from '@storybook/angular';
import { boolean, select, withKnobs, number } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { CardType } from '../cards.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CardLayoutExampleModule } from './card-layout-example.module';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template1 = `
  <b-card-layout-example-1 [type]="type || 'regular'"
                           [alignCenter]="alignCenter"
                           [mobileSwiper]="mobileSwiper"
                           [maxCards]="maxCards">
  </b-card-layout-example-1>
`;
const template2 = `
  <b-card-layout-example-2 [type]="type || 'regular'"
                           [alignCenter]="alignCenter"
                           [mobileSwiper]="mobileSwiper"
                           [maxCards]="maxCards">
  </b-card-layout-example-2>
`;
const template3 = `
  <b-card-layout-example-3 [type]="type || 'small'"
                           [alignCenter]="alignCenter"
                           [mobileSwiper]="mobileSwiper"
                           [maxCards]="maxCards">
  </b-card-layout-example-3>
`;
const template4 = `
  <b-card-layout-example-4 [type]="type || 'large'"
                           [alignCenter]="alignCenter"
                           [mobileSwiper]="mobileSwiper"
                           [maxCards]="maxCards">
  </b-card-layout-example-4>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Cards Layout'" style=" background: rgb(247,247,247);">
  <div style="max-width: none; margin-top: -30px;">
    <h3>Text cards</h3>
    <p>(size/type 'regular')</p>
    ${template1}
    <br><br>
    <h3>Image cards</h3>
    <p>(size/type 'large')</p>
    ${template4}
    <br><br>
    <h3>Employee cards</h3>
    <p>(size/type 'regular')</p>
    ${template2}
    <br><br>
    <h3>Mini employee cards</h3>
    <p>(size/type 'small')</p>
    ${template3}
  </div>

</b-story-book-layout>
`;

const note = `
  ## Cards Layout

  #### Module
  *CardsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | CardType | Card theme | regular
  [alignCenter] | boolean | put cards in the center. by default, if there \
  is not enough cards to fill 1 row, the cards will be centered. \
  To disable this behaviour, set [alignCenter] to **null**. set to **true** to force centering. | false
  [mobileSwiper] | boolean | enable mobile swiper (1 row of scrollable cards) | false
  cardsInRow$ / getCardsInRow$() | Observable&lt;number&gt; | observable \
  that returns cards in row | initial cards in row
  (cardsAmountChanged) | EventEmitter<wbr>&lt;number&gt; | emits when cardsInRow changes | &nbsp;

#### Example
\`\`\`
<b-cards [type]="type"
         [alignCenter]="false"
         [mobileSwiper]="true">

    <b-card-add [type]="type"
                (clicked)="onAddCardClick()"
                [card]="addCard">
    </b-card-add>

    <b-card *ngFor="let card of cards; let i = index"
            [type]="type"
            [clickable]="true"
            (clicked)="onCardClick(card, i)"
            [card]="card">
      <b-avatar card-top
                [imageSource]="avatars[i].imageUrl"
                [title]="avatars[i].displayName">
      </b-avatar>
      <b-slider card-bottom
                [value]="sliders[i].value"
                [readOnly]="sliders[i].readOnly">
      </b-slider>
    </b-card>

</b-cards>
\`\`\`
`;

story.add(
  'Cards Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', Object.values(CardType), CardType.regular),
        alignCenter: boolean('alignCenter', false),
        mobileSwiper: boolean('mobileSwiper', true),
        maxCards: number('maxCards', 6),
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardLayoutExampleModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
