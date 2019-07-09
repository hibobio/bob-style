import { storiesOf } from '@storybook/angular';
import {
  object,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { CardsModule } from '../cards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {MiniEmployeeCard} from './mini-card-employee.component';
import {mockAvatar} from '../../mock.const';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
<b-mini-employee-card [card]="cardData"
></b-mini-employee-card>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Mini Employee card'">
  <div style="display: flex; width:280px; margin: 50px auto; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Mini Employee card
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

const mockMiniProfileCardData: MiniEmployeeCard = {
  name: 'Larry Murfiray',
  title: 'Product design',
  imageSource: mockAvatar(),
  dates: '11/07 - 20/07'
};

story.add(
  'Mini Employee Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        cardData: object('cardData', mockMiniProfileCardData)
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
