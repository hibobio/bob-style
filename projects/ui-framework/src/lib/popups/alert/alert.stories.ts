import { storiesOf } from '@storybook/angular';
import { select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { AlertModule } from './alert.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { values } from 'lodash';
import { AlertType } from './alert.enum';
import { AlertExampleModule } from './alert-example.module';

const alertStories = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);
const alertTypes = values(AlertType);

const template = `<b-alert-example
  [title]="title"
  [alertType]="alertType"
  [text]="text"></b-alert-example>`;

const storyTemplate = `<b-story-book-layout [title]="'Alert'">
  <div style="max-width: 400px; margin: 30px auto; display:flex; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>`;

const note = `
  ## Alert Element
  #### Module
  *AlertModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  alertSize | AlertSize | sizes - small, medium, large
  alertType | AlertType | types - success, error, information, warning
  text | string | The text inside the alert
  ~~~
`;

alertStories.add(
  'Alert',
  () => {
    return {
      template: storyTemplate,
      props: {
        alertType: select('alertType', alertTypes, AlertType.success),
        title: text('title', 'Alert title'),
        text: text('text', 'The alert text appear here')
      },
      moduleMetadata: {
        imports: [AlertModule, AlertExampleModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
