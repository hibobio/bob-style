import { storiesOf } from '@storybook/angular';
import { boolean, select, withKnobs } from '@storybook/addon-knobs/angular';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { CardType } from '../cards.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CardLayoutExampleModule } from './card-layout-example.module';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
  <b-card-layout-example-1 [type]="type" [alignCenter]="alignCenter"></b-card-layout-example-1>
`;

const template2 = `
  <b-card-layout-example-2 [type]="type" [alignCenter]="alignCenter"></b-card-layout-example-2>
`;
const template3 = `
  <b-card-layout-example-3 [alignCenter]="alignCenter"></b-card-layout-example-3>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Cards Layout'" style=" background: rgb(247,247,247);">
  <div style="max-width: none;">
  <h3>Cards</h3>
    ${template}
    <br><br>
    <h3>Employee Cards</h3>
    ${template2}
    <br><br>
    <h3>Employee Cards</h3>
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
  type | CardType | Card theme | primary (optional)
  alignCenter | boolean | put cards in the center | false

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
        alignCenter: boolean('alignCenter', false)
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardLayoutExampleModule,
          UtilComponentsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
