import { storiesOf } from '@storybook/angular';
import {
  boolean,
  object,
  select,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';
import { Card } from './card.interface';
import { CardExampleModule } from './card-example.module';

const story = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
<b-card [card]="cardData"
        [type]="type"
        (clicked)="cardClickHandler($event)">
  <div card-top>
     ...card top - ng-content
  </div>
  <div card-content>
    ...card content - ng-content
  </div>
</b-card>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single Card'">
  <div style="max-width:320px; display: flex; flex-direction: column; align-items: center;">
    <b-card-example-1-component></b-card-example-1-component>
    <br/>
    <b-card-example-2-component></b-card-example-2-component>
    <br/>
    <b-card-example-3-component></b-card-example-3-component>
    <br/>
    <b-card-example-4-component></b-card-example-4-component>
  </div>

</b-story-book-layout>
`;

const note = `
  ## Card

  #### Module
  *CardsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | CardType | Card theme | primary (optional)
  card | Card | card contents data | none

  #### Card interface
  ~~~
  interface Card {
    title: string;
    titleEditable?: boolean;
    actionConfig?: CardActionButton;
    menuConfig?: MenuItem[];
    id?: string | number;
    footerCtaLabel?: string;
    imageUrl?: string;
  }

  interface CardActionButton {
    icon: Icons;
    tooltip?: string;
    action?($event): void;
  }
  ~~~
`;

story.add(
  'Card',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardExampleModule,
          UtilComponentsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
