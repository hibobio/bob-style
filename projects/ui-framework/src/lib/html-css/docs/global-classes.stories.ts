import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.HtmlCss, module);

// @ts-ignore: md file and not a module
import classesTable from './global-classes.md';

const storyTemplate = `
<b-story-book-layout [title]="'Global Classes'"><div class="doc-page">

  <b-heading>
    Guidelines
  </b-heading>

  <p>These classes are always available without additional imports.</p>

  ${classesTable}



</div></b-story-book-layout>
`;

story.add(
  'Global Classes',
  () => {
    return {
      template: storyTemplate,
      moduleMetadata: {
        imports: [StoryBookLayoutModule, TypographyModule],
      },
    };
  },
  {
    notes: { markdown: '⇧ Go to **Canvas** tab' },
  }
);
