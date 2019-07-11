import { storiesOf } from '@storybook/angular';
import {
  object,
  boolean,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { CardsModule } from '../cards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { mockAvatar } from '../../mock.const';
import { MiniEmployeeCard } from './mini-card-employee.interface';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
<b-mini-employee-card [clickable]="clickable" [card]="card"
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
  #### card: single card data properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  card | MiniProfileCardData | card data | none
  clickable | boolean | is the card clickable? | false
`;

const mockMiniProfileCardData: MiniEmployeeCard = {
  title: 'Larry Murfiray',
  subtitle: 'Product design',
  imageSource: mockAvatar(),
  footer: '11/07 - 20/07'
};

story.add(
  'Mini Employee Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        card: object('card', mockMiniProfileCardData),
        clickable: boolean('clickable', false)
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
