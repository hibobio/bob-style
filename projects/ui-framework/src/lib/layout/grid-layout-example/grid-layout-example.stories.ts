import { storiesOf } from '@storybook/angular';
import {
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { GridLayoutExampleModule } from './grid-layout-example.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
<b-grid-layout-example></b-grid-layout-example>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Grid layout example'">
  <div style="max-width: none;">${template}</div>
</b-story-book-layout>
`;

const note = `
  ## Grid layout example

  #### Properties
  Name | Type | Description
  --- | --- | ---

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Grid layout example',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TypographyModule,
          StoryBookLayoutModule,
          GridLayoutExampleModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
