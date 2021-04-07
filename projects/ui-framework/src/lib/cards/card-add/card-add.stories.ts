import { values } from 'lodash';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CardType } from '../cards.enum';
import { CardsModule } from '../cards.module';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
  <b-card-add [card]="{
                title: title,
                subtitle: subtitle,
                action: onAction
              }"
              [type]="type"
              (clicked)="onClick($event)">
  </b-card-add>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Add new Card'" style=" background: rgb(247,247,247);">
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
  [card] | AddCard | data for the Add New card | &nbsp;
  (clicked) | EventEmitter | handler of card click | &nbsp;

  #### [card: AddCard]
  Name | Type | Description
  --- | --- | ---
  title | string | main text
  subtitle | string | sub title
  action | Function | handler of card click

`;

story.add(
  'Add Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select(
          'type',
          Object.values(CardType).filter(
            (t) => t === CardType.regular || t === CardType.large
          ),
          CardType.regular
        ),
        title: text('title', 'Add new'),
        subtitle: text('subtitle', ''),
        onClick: action('Card clicked'),
        onAction: action('Action called'),
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
      },
    };
  },
  { notes: { markdown: note } }
);
