import { action } from '@storybook/addon-actions';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { CheckboxModule } from '../../form-elements/checkbox/checkbox.module';
import { mockBadJobs } from '../../mock.const';
import { simpleUID } from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TopActionBarTypesEnum } from './top-action-bar.consts';
import { TopActionBarModule } from './top-action-bar.module';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const template = `<b-top-action-bar
        [actionType]="actionType"
        [readOnly]="readOnly"
        [actionText]="actionText"
        [text]="text"
        (action)="action()">
</b-top-action-bar>`;

const template2 = `<b-top-action-bar
        [actionType]="actionType"
        [readOnly]="readOnly"
        [actionText]="'CTA Action'"
        [text]="'This is a message with content'"
        (action)="action()">
</b-top-action-bar>`;

const template3 = `<b-top-action-bar
        [actionType]="actionType"
        [readOnly]="readOnly"
        [actionText]="'CTA Action'"
        [text]="'This is a message with content'"
        (action)="action()">
    <b-checkbox [label]="'I agree with everything you say'" [ngClass]="'mrg-l-8'"></b-checkbox>
</b-top-action-bar>`;

const template4 = `<b-top-action-bar
        [actionType]="actionType"
        [readOnly]="readOnly"
        [actionText]="'CTA Action'"
        [options]="options"
        [text]="'This is a message with content'"
        (action)="action()">
</b-top-action-bar>`;

const storyTemplate = `<b-story-book-layout [title]="'Top Action Bar'">
  <div>
    ${template}
    <br>
    ${template2}
    <br>
    ${template3}
    <br>
    ${template4}
  </div>
</b-story-book-layout>`;

const note = `
  ## Top Action Bar
  #### Module
  *TopActionBarModule*

  ~~~
  ${template}

  ${template2}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [actionType] | TopActionBarTypesEnum | alert type - information, error, warning, success
  [text] | string | The text inside the alert
  [actionText] | string | The text on the button
  [link] | Link | link definition - text, url, color, target
  (action) | EventEmitter<wbr>&lt;void&gt; | emitted on button click (use to attach methods to links - vs. urls)

  *Note:* You can also pass content to the alert - it will appear after the Action Bar (if they are present):
  \`<b-top-action-bar> My content </b-top-action-bar>\`
`;

const options = mockBadJobs(5 ).map((option) => ({
  value: option,
  id: simpleUID(option + '-'),
  key: simpleUID(option + '-'),
  selected: false,
}));

story.add(
  'Top Action Bar',
  () => {
    return {
      template: storyTemplate,
      props: {
        actionType: select(
          'actionType',
          Object.values(TopActionBarTypesEnum),
          TopActionBarTypesEnum.information
        ),
        text: text('text', 'Place your info text here'),
        actionText: text('actionText', 'Click'),
        readOnly: boolean('readOnly', false),
        action: action('Link clicked'),
        options
      },
      moduleMetadata: {
        imports: [TopActionBarModule, StoryBookLayoutModule, CheckboxModule],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
