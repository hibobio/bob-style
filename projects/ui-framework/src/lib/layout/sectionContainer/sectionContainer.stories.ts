import { storiesOf } from '@storybook/angular';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SectionContainerModule } from './sectionContainer.module';

const inputStories = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `<b-section-container [title]="'titleHere'">
<div section-action>
<p>Action here</p>
</div>
<div section-content>
<p>Content Here</p>
</div>
</b-section-container>`;

const storyTemplate = `
<b-story-book-layout [title]="'Section Container'">
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
