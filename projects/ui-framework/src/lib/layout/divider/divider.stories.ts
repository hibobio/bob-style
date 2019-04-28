import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DividerModule } from './divider.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const inputStories = storiesOf(ComponentGroupType.Misc, module).addDecorator(
  withKnobs
);

const template = `
  <b-divider></b-divider>
`;

const template2 = `
  <hr b-divider>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Divider'">
  ${template}
  <div style="margin: 5px auto;"><b-caption>Simple Divider line</b-caption></div>
</b-story-book-layout>
`;

const note = `
  ## Divider Element
  #### Module
  *DividerModule*

  #### Properties
  *None*

  ~~~
  ${template}
  ${template2}
  ~~~
`;

inputStories.add(
  'Divider',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DividerModule,
          TypographyModule,
          StoryBookLayoutModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
