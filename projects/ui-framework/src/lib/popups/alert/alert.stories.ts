import { storiesOf } from '@storybook/angular';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { AlertModule } from './alert.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { values } from 'lodash';
import { AlertType } from './alert.enum';
import { AlertExampleModule } from './alert-example.module';

const story = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);
const alertTypes = values(AlertType);

const template = `<b-alert-example
  [title]="title"
  [alertType]="alertType"
  [text]="text"></b-alert-example>`;

const storyTemplate = `<b-story-book-layout [title]="'Alert'">
    ${template}
</b-story-book-layout>`;

const note = `
  ## Alert Element

  ## How to use
  open the alert from alertService:

  ~~~
  constructor(private alertService: AlertService) {

    openAlert() {
      const alertRef: ComponentRef<AlertComponent> = this.alertService
        .showAlert({
          alertType: this.alertType,
          title: this.title,
          text: this.text
      });
    }
  }
  ~~~

  #### Module
  *AlertModule*

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  alertType | AlertType | types - success, error, information, warning
  title | string | alert title
  text | string | alert content
`;

story.add(
  'Alert',
  () => {
    return {
      template: storyTemplate,
      props: {
        alertType: select('alertType', alertTypes, AlertType.success),
        title: text('title', 'Alert title'),
        text: text('text', 'The alert text appear here'),
      },
      moduleMetadata: {
        imports: [AlertModule, AlertExampleModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
