import { storiesOf } from '@storybook/angular';
import { select, withKnobs } from '@storybook/addon-knobs/angular';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { CardType } from '../cards.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CardLayoutExampleModule } from './card-layout-example.module';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
  <b-card-layout-example-1 [type]="type"></b-card-layout-example-1>
`;

const template2 = `
  <b-card-layout-example-2 [type]="type"></b-card-layout-example-2>
`;
const template3 = `
  <b-card-layout-example-3></b-card-layout-example-3>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Cards Layout'">
  <div style="min-width:100%; min-height: 100%; padding: 30px; background: rgb(247,247,247);">
  <h3>Cards</h3>
    ${ template }
    <br><br>
    <h3>Employee Cards</h3>
    ${ template2 }
    <br><br>
    <h3>Employee Cards</h3>
    ${ template3 }
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
  type | CardType | Card theme | primary (optional)

~~~
<b-cards [type]="type">
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
~~~

~~~
<b-cards [type]="type">
  <b-card-employee *ngFor="let card of cards; let i = index"
                  [clickable]="true"
                  (clicked)="onCardClick(card, i)"
                  [card]="card">
  </b-card-employee>
</b-cards>
~~~
`;

story.add(
  'Cards Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(CardType), CardType.regular),
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardLayoutExampleModule,
        ],
      }
    };
  },
  { notes: { markdown: note } }
);
