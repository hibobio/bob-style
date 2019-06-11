import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DividerModule } from './divider.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const inputStories = storiesOf(ComponentGroupType.Layout, module).addDecorator(withKnobs);

const template1 = `
  <b-divider [text]="text"></b-divider>
`;

const template2 = `
  <b-divider></b-divider>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Divider'">

  <div style="margin: 5px auto;"><b-caption>Simple Divider line:</b-caption></div>
  ${ template2 }

  <br /><br /><br />

  <div style="margin: 5px auto;"><b-caption>Simple Text Divider:</b-caption></div>
  ${ template1 }

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
  ${ template1 }
  ~~~
`;

inputStories.add(
  'Divider',
  () => {
    return {
      template: storyTemplate,
      props: {
        text: text('text', 'Some text'),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, DividerModule, TypographyModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
