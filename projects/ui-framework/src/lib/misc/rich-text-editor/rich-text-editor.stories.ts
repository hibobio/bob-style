import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { RichTextEditorModule } from './rich-text-editor.module';

const inputStories = storiesOf(ComponentGroupType.Misc, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-rich-text-editor></b-rich-text-editor>
`;

const storyTemplate = `
<b-story-book-layout title="Rich text editor">
  ${ template }
</b-story-book-layout>
`;

const note = `
  ## Rich text editor

  #### Properties

  Name | Type | Description
  --- | --- | ---

  ~~~
  ${ template }
  ~~~
`;

inputStories.add(
  'Rich text editor',
  () => {
    return {
      template: storyTemplate,
      props: {
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TypographyModule,
          StoryBookLayoutModule,
          RichTextEditorModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
