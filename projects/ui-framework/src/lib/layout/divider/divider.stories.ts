import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DividerModule } from './divider.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template1 = `
  <b-divider [text]="text"></b-divider>
`;

const template2 = `
  <b-divider></b-divider>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Divider'">
<div>
    <b-caption>Simple Divider line:</b-caption>
    ${template2}

    <br /><br /><br />

    <b-caption>Simple Text Divider:</b-caption>
    ${template1}
</div>
</b-story-book-layout>
`;

const note = `
  ## Divider Element
  #### Module
  *DividerModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  text | string | text to be displayed in divider | null

  ~~~
  ${template1}
  ~~~
`;

story.add(
  'Divider',
  () => {
    return {
      template: storyTemplate,
      props: {
        text: text('text', 'Some text'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          DividerModule,
          TypographyModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
