import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.HtmlCss, module);
// @ts-ignore: md file and not a module
import styleguideCssTable from './styleguide-scss.md';
// @ts-ignore: md file and not a module
import styleguideHtmlTable from './styleguide-html.md';

const storyTemplate = `
<b-story-book-layout [title]="'Guidelines'"><div class="doc-page">


<b-heading>
  Main objectives
</b-heading>

<ul>
<li>separate Content from Presentation</li>
<li>use minimalistic approach</li>
<li>make code consistent</li>
<li>minimize code repeat</li>
</ul>

  <b-heading>
    HTML Style guide
  </b-heading>

  ${styleguideHtmlTable}

  <b-heading>
    SCSS Style guide
  </b-heading>

  ${styleguideCssTable}



</div></b-story-book-layout>
`;

story.add(
  'Guidelines',
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
