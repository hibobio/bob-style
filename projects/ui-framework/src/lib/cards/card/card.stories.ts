import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CardExampleModule } from './card-example.module';
import { CardsModule } from '../cards.module';

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
<div style="max-width:850px; display: flex; flex-direction: column; align-items: center;">

  <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-column-gap: 20px; justify-content: center;">
    <b-card [card]="{
              title: text1,
              menuConfig: menu1,
              footerCtaLabel: 'Do you'
            }">
    </b-card>

    <b-card [card]="{
              title: text2,
              menuConfig: menu2,
              footerCtaLabel: 'really want to'
            }">
            <span card-top>Precious kisses, words that burn me.
Lovers never ask you why.</span>
    </b-card>

    <b-card [card]="{
              title: text3,
              menuConfig: menu3,
              footerCtaLabel: 'hurt me'
            }">
            <span card-top>If it's love you want from me, Then take it away.</span>
            <span card-content>{{text4}}</span>
    </b-card>
  </div>
  <br/>

  <div style="max-width:320px; display: flex; flex-direction: column; align-items: center;">
    <b-card-example-1-component></b-card-example-1-component>
    <br/>
    <b-card-example-2-component></b-card-example-2-component>
    <br/>
    <b-card-example-3-component></b-card-example-3-component>
    <br/>
    <b-card-example-4-component></b-card-example-4-component>
  </div>

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
  [type] | CardType | Card theme | primary
  [card] | Card | card contents data | &nbsp;

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
      props: {
        text1: `In my heart the fire is burning,
Choose my color find a star.
Precious people always tell me
That's a step a step too far.`,
        text2: `Words are few I have spoken,
I could waste a thousand years.`,
        text3: `Wrapped in sorrow, words are token.
Come inside and catch my tears.`,
        text4: `You've been talking but believe me,
If it's true you do not know.
This boy loves without a reason.
I'm prepared to let you go.`,
        menu1: [
          {
            label: 'Give me time',
          },
          {
            label: 'to realize my crime',
          },
          {
            label: 'Let me love and steal',
          },
        ],
        menu2: [
          {
            label: 'I have danced',
          },
          {
            label: 'inside your eyes',
          },
          {
            label: 'How can I be real',
          },
        ],
        menu3: [
          {
            label: "Everything's",
          },
          {
            label: 'not what you see',
          },
          {
            label: "it's over again",
          },
        ],
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardExampleModule,
          CardsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
