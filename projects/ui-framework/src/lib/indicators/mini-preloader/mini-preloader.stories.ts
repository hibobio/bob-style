import { storiesOf } from '@storybook/angular';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MiniPreloaderModule } from './mini-preloader.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const template = `
<b-mini-preloader></b-mini-preloader>
<div style="margin: 5px auto;"><b-caption>fetching</b-caption></div>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Mini preloader'">
  <div style="display:flex; flex-direction: column; align-items: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Mini Preloader Element
  #### Module
  *MiniPreloaderModule*

  #### Properties
  *None*

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Mini preloader',
  () => {
    return {
      template: storyTemplate,
      props: {},
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          MiniPreloaderModule,
          TypographyModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
