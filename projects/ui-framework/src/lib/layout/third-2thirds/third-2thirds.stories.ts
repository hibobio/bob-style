import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Third2ThirdsModule } from './third-2thirds.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template1 = `
<b-third-2thirds>
  <div main style="border: 1px solid">main content</div>
  <div side style="border: 1px solid">side content</div>
</b-third-2thirds>
`;


const storyTemplate = `
<b-story-book-layout [title]="'1-Third-2-thirds layout'">
<div>
    <b-caption>Third-2-thirds layout:</b-caption>
    ${template1}
</div>
</b-story-book-layout>
`;

const note = `
  ## Third-2-thirds Element
  #### Module
  *Third-2thirdsModule*

  ~~~
<b-third-2thirds>
    <div main>main content</div>
    <div side>side content</div>
</b-third-2thirds>
  ~~~
`;

story.add(
  'Third-2-thirds',
  () => {
    return {
      template: storyTemplate,
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          Third2ThirdsModule,
          TypographyModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
