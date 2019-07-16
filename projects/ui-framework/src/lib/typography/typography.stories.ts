import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { TypographyModule } from './typography.module';
import { ComponentGroupType } from '../consts';

const typographyStories = storiesOf(
  ComponentGroupType.Typography,
  module
).addDecorator(withKnobs);

const displayTemplate = `
<style>
  div {
    border-bottom: 1px solid #c4cdd5;

  }
  div .code-sample {
    padding: 4px 8px;
    background-color: #d4dde6;
    display: inline-block;
    margin-bottom: 10px;
    font-weight: 500;
  }
</style>
<div>
  <span class="code-sample">&#60;b-display-1&#62;</span>
  <b-display-1>Display XLarge</b-display-1>
</div>
<div>
  <span class="code-sample">&#60;b-display-2&#62;</span>
  <b-display-2>Display Large</b-display-2>
</div>
<div>
  <span class="code-sample">&#60;b-display-3&#62;</span>
  <b-display-3>Display Medium</b-display-3>
</div>
<div>
  <span class="code-sample">&#60;b-display-4&#62;</span>
  <b-display-4>Display Small</b-display-4>
</div>
<div>
  <span class="code-sample">&#60;b-heading&#62;</span>
  <b-heading>Heading</b-heading>
</div>
<div>
  <span class="code-sample">&#60;b-subheading&#62;</span>
  <b-subheading>Sub heading</b-subheading>
</div>
 <div>
  <span class="code-sample">&#60;b-big-body&#62;</span><br/>
  <b-big-body>Big body</b-big-body>
</div>
 <div>
  <span class="code-sample">&#60;b-bold-body&#62;</span><br/>
  <b-bold-body>Bold body</b-bold-body>
</div>
<div>
  <span>Default body font</span>
</div>
<div>
  <span class="code-sample">&#60;b-caption&#62;</span><br/>
  <b-caption>Caption</b-caption>
</div>
<ul>
`;
const note = `
## Typography
The typography is arranged into multiple levels:
- display: Which are large titles (usually top of page)
- heading: Which are section headings

#### Module
*TypographyModule*

#### Style customization
property name | Description
--- | ---
display-font-family | The display elements font family
heading-font-family | The heading elements font family
body-font-family | The body elements font family
text-color | The font color

~~~
<b-display-1>Display XLarge</b-display-1>
<b-display-2>Display Large</b-display-2>
<b-display-3>Display Medium</b-display-3>
<b-display-4>Display Small</b-display-4>
<b-heading>Heading</b-heading>
<b-subheading>Sub heading</b-subheading>
Body
<b-caption>Caption</b-caption>
~~~
`;
typographyStories.add(
  'Text',
  () => ({
    template: displayTemplate,
    props: {},
    moduleMetadata: {
      imports: [TypographyModule]
    }
  }),
  { notes: { markdown: note } }
);
