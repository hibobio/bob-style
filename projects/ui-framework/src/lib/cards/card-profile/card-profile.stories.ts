import { storiesOf } from '@storybook/angular';
import {
  object,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { CardsModule } from '../cards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { EmployeeCardsMockData } from '../cards.mock';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
<b-card-profile [card]="{
        name: 'Larry Murfiray askdf alskdjf asdf asldf asdfasd fasdf a',
        title: 'Product design',
        avatar: 'http://i.pravatar.cc/200?img=5',
        dates: '11/07 - 20/07'
      }"
></b-card-profile>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Profile Card'">
  <div style="display: flex; width:280px; margin: 50px auto; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Profile Card

  #### Module
  *CardsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  #### card: CardData - single card data properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  data | MiniProfileCardData | card data | none



  *Note:* For more info on [data: CardDataType] properties, see <u>Cards Layout</u> story.

`;

story.add(
  'Profile Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        card: object('card', EmployeeCardsMockData[0]),
        cardClickHandler: action('Card clicked')
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
