import { storiesOf } from '@storybook/angular';
import { object, select, withKnobs } from '@storybook/addon-knobs/angular';
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
  <div style="max-width:260px;">
    ${template}
  </div>
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
  [type] | CardType | Card theme | primary
  [card] | AddCardData | data for the Add New card | &nbsp;
  (clicked) | EventEmitter | handler of card click | &nbsp;

  #### [card: AddCardData]
  Name | Type | Description
  --- | --- | ---
  title | string | main text
  subtitle | string | sub title
  action | Function | handler of card click

`;

const AddCardMockData = {
  title: 'Add a new flow',
  subtitle: 'Right now',
  action: action('Add Card was clicked'),
};

story.add(
  'Add Card',
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
        addCard: object('addCard', AddCardMockData),
        onClick: action('Card clicked'),
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
      },
    };
  },
  { notes: { markdown: note } }
);
