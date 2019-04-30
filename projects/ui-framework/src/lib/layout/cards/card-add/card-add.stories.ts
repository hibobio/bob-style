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
import { ComponentGroupType } from '../../../consts';
import { CardsModule } from '../cards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { CardType } from '../cards.enum';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
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
  <div style="display: flex; width:280px; margin: 100px auto;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Add new Card

  #### Module
  *CardsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  title | string | main text | ''
  subtitle | string | sub title | none (optional)
  clicked | Function | callback for clicking on the  card |

  ~~~
  ${template}
  ~~~
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
        type: select('type', values(CardType), CardType.primary),
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
