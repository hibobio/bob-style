import { storiesOf } from '@storybook/angular';
import { text, withKnobs, boolean } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ActionBarModule } from './action-bar.module';
import { ButtonsModule } from '../../buttons/buttons.module';

const story = storiesOf(ComponentGroupType.Navigation, module).addDecorator(
  withKnobs
);

const componentTemplate = `
<b-action-bar [label]="label"
              [showLabel]="showLabel">
    <b-button label-toggle-content>Actions</b-button>
    <b-button>Test</b-button>
</b-action-bar>
`;

const template = `
<b-story-book-layout [title]="'action bar'">
  <div style="max-width: 400px;">
  ${componentTemplate}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Action Bar Element

  #### Module
  *ActionBarModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | ---
  [label] | string | The label that on the left side. | &nbsp;
  [showLabel] | boolean | Show label or label-toggle-content | true
  label-toggle-content | ng-content | The content to show when label is hidden | &nbsp;
  - | ng-content | The content to the right of the label | &nbsp;
  ~~~
  ${componentTemplate}
  ~~~
`;

story.add(
  'Action Bar',
  () => {
    return {
      template,
      props: {
        label: text('label', 'Test label'),
        showLabel: boolean('showLabel', true),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          ActionBarModule,
          StoryBookLayoutModule,
          ButtonsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
