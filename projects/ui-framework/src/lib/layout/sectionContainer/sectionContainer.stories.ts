import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SectionContainerModule } from './sectionContainer.module';

const inputStories = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `<b-section-container [title]="'Title here'">
  <div section-action>
    Action here
  </div>
  <div section-content>
    Content Here
  </div>
</b-section-container>`;

const storyTemplate = `
<b-story-book-layout [title]="'Section Container'" style="background-color: rgb(247,247,247);">
<style>
  p { margin: 0; }
</style>
  <div>
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Section Element

  #### Module
  *SectionContainerModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  title | string | title of section container | none
  ~~~
  ${template}
  ~~~
`;

inputStories.add(
  'SectionContainer',
  () => {
    return {
      template: storyTemplate,
      props: {
        title: text('title', '')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          SectionContainerModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
