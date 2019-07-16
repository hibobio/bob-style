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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CardType } from '../cards.enum';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
  <b-card-add [card]="addCard"
              [type]="type"
              (clicked)="onClick($event)">
  </b-card-add>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Add new Card'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Add new Card

  #### Module
  *CardsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | CardType | Card theme | primary (optional)
  card | AddCardData | data for the Add New card | none
  clicked | Function | handler of card click

  #### [card: AddCardData]
  Name | Type | Description | Default value
  --- | --- | --- | ---
  title | string | main text | none
  subtitle | string | sub title | none (optional)
  action | Function | handler of card click

`;

const AddCardMockData = {
  title: 'Add a new flow',
  subtitle: 'Right now',
  action: action('Add Card was clicked')
};

story.add(
  'Add Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(CardType), CardType.regular),
        addCard: object('addCard', AddCardMockData),
        onClick: action('Card clicked')
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule]
      }
    };
  },
  { notes: { markdown: note } }
);
