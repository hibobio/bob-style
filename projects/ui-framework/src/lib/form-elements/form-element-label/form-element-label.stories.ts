import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs,
  number
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { FormElementLabelModule } from './form-element-label.module';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-form-element-label [label]="label"
                      [description]="description">
</b-form-element-label>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Form element label'">
  <div style="max-width: 300px;">
    ${ template }
  </div>
</b-story-book-layout>
`;

const note = `
  ## Form Element label
  #### Module
  *FormElementLabel* or *FormElementsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  label | string | label value
  description | string | description value

  ~~~
  ${ template }
  ~~~
`;
inputStories.add(
  'Form element label',
  () => {
    return {
      template: storyTemplate,
      props: {
        label: text('label', 'Form field label'),
        description: text('description', 'What would you ask for, if you knew the answer was Yes'),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, FormElementLabelModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
