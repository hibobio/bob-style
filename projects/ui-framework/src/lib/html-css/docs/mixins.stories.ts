import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.HtmlCss, module);

// @ts-ignore: md file and not a module
import mixinsTable from './mixins.md';

const storyTemplate = `
<b-story-book-layout [title]="'SCSS Mixins & Functions'"><div class="doc-page">

  <b-heading>
    Guidelines
  </b-heading>

  <p>To use bob-style mixins (and other useful things like variables), put this on top of your component's .scss file:</p>

  <pre><code>@import '~bob-style/style/common-imports';</code></pre>

  ${mixinsTable}



</div></b-story-book-layout>
`;

story.add(
  'SCSS Mixins',
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
