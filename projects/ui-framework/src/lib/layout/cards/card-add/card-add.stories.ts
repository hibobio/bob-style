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
import { ComponentGroupType } from '../../../consts';
import { CardsModule } from '../cards.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
  <b-card-add [title]="'Add a new flow'"
              [subtitle]="'Create a new pay schedule'"
              (clicked)="onClick($event)">
  </b-card-add>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Add new Card'">
  <div style="display: flex; width:280px; height: 280px; margin: 100px auto;">
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

story.add(
  'Add Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        onClick: action('Card clicked')
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, CardsModule]
      }
    };
  },
  { notes: { markdown: note } }
);
