import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.HtmlCss, module);

// @ts-ignore: md file and not a module
import varMiscTable from './variables-misc.md';
// @ts-ignore: md file and not a module
import varTypeTable from './variables-typography.md';
// @ts-ignore: md file and not a module
import varColorsTable from './variables-colors.md';
// @ts-ignore: md file and not a module
import varCSSTable from './variables-css.md';

const storyTemplate = `
<b-story-book-layout [title]="'SCSS Variables'"><div class="doc-page">

  <b-heading>
    Guidelines
  </b-heading>

  <p>To use bob-style variables (and other useful things like mixins), put this on top of your component's .scss file:</p>

  <pre><code>@import '~bob-style/style/common-imports';</code></pre>

  <p>In 99% cases color and font-related properties should be set with existing variables, not values.</p>

  <p> If design has color or font-size that does not have a variable, the variable with closest value should be used.</p>

  <p>For colors, its easiest to compare rgb values (find variable with the closest numbers). This <a href="https://www.webfx.com/web-design/hex-to-rgb/">hex to rgb converter</a> might be useful.</p>

  <b-heading>
    Misc
  </b-heading>

  ${varMiscTable}

  <b-heading>
    Colors
  </b-heading>

  ${varColorsTable}

  <b-heading>
    Typography
  </b-heading>

  ${varTypeTable}

  <b-heading>
    CSS variables (custom properties)
  </b-heading>

  ${varCSSTable}

</div></b-story-book-layout>
`;

story.add(
  'SCSS Variables',
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
