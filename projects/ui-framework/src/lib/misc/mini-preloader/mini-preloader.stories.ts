import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MiniPreloaderModule } from './mini-preloader.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const inputStories = storiesOf(ComponentGroupType.Misc, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Mini preloader">
  <b-mini-preloader></b-mini-preloader>
  <div style="margin: 5px auto;"><b-caption>fetching</b-caption></div>
</b-story-book-layout>
`;

const note = `
  ## Mini Preloader Element

  #### Properties

  Name | Type | Description
  --- | --- | ---

  ~~~
  ${ template }
  ~~~
`;
inputStories.add(
  'Mini preloader',
  () => {
    return {
      template,
      props: {
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          MiniPreloaderModule,
          TypographyModule,
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
