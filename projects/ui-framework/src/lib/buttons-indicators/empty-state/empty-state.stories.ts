import {storiesOf} from '@storybook/angular';
import {withKnobs, object} from '@storybook/addon-knobs/angular';
import {action} from '@storybook/addon-actions';
import {ComponentGroupType} from '../../consts';
import {StoryBookLayoutModule} from '../../story-book-layout/story-book-layout.module';
import {EmptyStateModule} from './empty-state.module';
import {Icons} from '../../icons/icons.enum';
import {values} from 'lodash';
import {EmptyStateConfig} from './empty-state.types';

const iconTypes = values(Icons);

const emptyStateConfig: EmptyStateConfig = { text: 'Place your empty state text here',
  icon: Icons.feedback_icon, buttonLabel: 'CLICK HERE' };
const EmptyStateStories = storiesOf(
  ComponentGroupType.ButtonsAndIndicators,
  module
).addDecorator(withKnobs);

const template =
  `<b-empty-state [config]="config"
                  (buttonClick)="buttonClicked($event)"></b-empty-state>`;

const storyTemplate = `<b-story-book-layout [title]="'Empty State'">${template}</b-story-book-layout>`;

const note = `
  ## Empty State Element
  #### Module
  *EmptyStateModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  config | EmptyStateConfig | text, buttonLabel - string, icon - Icon
  buttonClicked | Function
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
        config: object('config', emptyStateConfig),
        buttonClicked: action('button clicked')
      },
      moduleMetadata: {
        imports: [EmptyStateModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
