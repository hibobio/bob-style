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
import { ComponentGroupType } from '../../consts';
import { CardModule } from './card.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconsModule } from '../../icons/icons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { MenuItem } from '../../navigation/menu/menu.interface';

const menuStories = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
<b-card [menu]="menu" [text]="text">
  <p card-top>Kyle Wilson</p>
  <p card-bottom>No approvers are required</p>
</b-card>
`;

const storyTemplate = `
<b-story-book-layout title="Single Card">
  <div style="display: flex; width:280px; height: 280px; margin: 100px auto;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single Card

  #### Module
  *CardModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  menu | MenuItem[] | array of menu items | none
  text | string | main text | ''

  ~~~
  ${template}
  ~~~
`;

const cardTextMock =
  'Compensation update with a very long text that cuts off after 4 lines of text. And here is another very long text that should not be displayed at all.';

const menuMock: MenuItem[] = [
  {
    label: 'Do this',
    action: $event => console.log('Do this', $event)
  },
  {
    label: 'Do that',
    action: $event => console.log('Do that', $event)
  },
  {
    label: 'Do something else',
    action: $event => console.log('Do something else', $event)
  }
];

menuStories.add(
  'Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        menu: object('menu', menuMock),
        text: text('text', cardTextMock)
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardModule,
          ButtonsModule,
          IconsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
