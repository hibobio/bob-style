import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { MiniPreloaderModule } from './mini-preloader.module';

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
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
