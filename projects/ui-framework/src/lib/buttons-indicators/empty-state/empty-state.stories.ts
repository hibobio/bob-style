import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  select,
  text,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {EmptyStateModule} from './empty-state.module';
import {Icons} from '../../icons/icons.enum';
import { values } from 'lodash';

const iconTypes = values(Icons);

const EmptyStateStories = storiesOf(
  ComponentGroupType.ButtonsAndIndicators,
  module
).addDecorator(withKnobs);

const template =
  `<b-empty-state [icon]="icon"
                  [text]="text"
                  [buttonLabel]="buttonLabel"
                  (buttonClick)="buttonClicked($event)"></b-empty-state>`;

const storyTemplate = `<b-story-book-layout [title]="'Empty State'">${template}</b-story-book-layout>`;

const note = `
  ## Empty State Element
  #### Module
  *EmptyStateModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  icon | IconTypes
  text | string | empty state text
  buttonLabel | string | button text
  ~~~
  ${template}
  ~~~
`;

EmptyStateStories.add(
  'Empty State',
  () => {
    return {
      template: storyTemplate,
      props: {
        icon: select('icon', iconTypes, Icons.feedback_icon),
        text: text('text', 'Place your info text here'),
        buttonLabel: text('text', 'CLICK HERE'),
        buttonClicked: action('button clicked')
      },
      moduleMetadata: {
        imports: [EmptyStateModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
