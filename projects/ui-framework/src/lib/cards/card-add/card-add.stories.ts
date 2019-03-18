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
import { CardAddModule } from './card-add.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';



const menuStories = storiesOf(ComponentGroupType.Cards, module).addDecorator(
  withKnobs
);

const template = `
  <b-card-add title="Add a new flow"
              subtitle="Create a new pay schedule"
              (clicked)="onClick($event)">
  </b-card-add>
`;

const storyTemplate = `
<b-story-book-layout title="Add new Card">
  <div style="display: flex; width:280px; height: 280px; margin: 100px auto;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Add new Card

  #### Module
  *CardAddModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  title | string | main text | ''
  subtitle | string | sub title | none
  clicked | Function | callback for clicking on the  card |

  ~~~
  ${template}
  ~~~
`;

menuStories.add(
  'Add Card',
  () => {
    return {
      template: storyTemplate,
      props: {
        onClick: action('Card clicked'),
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CardAddModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
