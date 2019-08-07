import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { TypographyModule } from './typography.module';
import { ComponentGroupType } from '../consts';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';

const typographyStories = storiesOf(
  ComponentGroupType.Typography,
  module
).addDecorator(withKnobs);

const displayTemplate = `
<style>
  .item {
    border-bottom: 1px solid #c4cdd5;
    text-align: left;
    padding: 30px;
  }
  .item:first-child {
    padding-top: 0;
  }
  .item:last-child {
    padding-bottom: 0;
    border: 0;
  }
  span, strong {
    display: inline-block;

  }
  .code-sample,  .details {
    margin-bottom: 10px;
    vertical-align: middle;
    white-space: nowrap;
  }
  .code-sample {
    padding: 4px 8px;
    min-height: 26px;
    background-color: #d4dde6;
    font-weight: 500;
    margin-right: 15px;
  }
  .code-sample:empty {
    padding: 0;
    margin: 0;
  }
  strong {
    margin-right: 5px;
    vertical-align: baseline;
  }
</style>
<div class="item">
  <span class="code-sample">&#60;b-display-1&#62;</span>
  <span class="details">
    <strong>Sentinel SSm A</strong>
    42px / 1.3 / 900
  </span>
  <b-display-1>Display XLarge</b-display-1>
</div>
<div class="item">
  <span class="code-sample">&#60;b-display-2&#62;</span>
  <span class="details">
    <strong>Sentinel SSm A</strong>
    28px / 1.3 / 900
  </span>
  <b-display-2>Display Large</b-display-2>
</div>
<div class="item">
  <span class="code-sample">&#60;b-display-3&#62;</span>
  <span class="details">
    <strong>Sentinel SSm A</strong>
    22px / 1.3 / 900
  </span>
  <b-display-3>Display Medium</b-display-3>
</div>
<div class="item">
  <span class="code-sample">&#60;b-display-4&#62;</span>
  <span class="details">
    <strong>Sentinel SSm A</strong>
    18px / 1.3 / 900
  </span>
  <b-display-4>Display Small</b-display-4>
</div>
<div class="item">
  <span class="code-sample">&#60;b-heading&#62;</span>
  <span class="details">
    <strong>Gotham SSm A</strong>
    14px / 1.3 / 600
  </span>
  <b-heading>Heading</b-heading>
</div>
<div class="item">
  <span class="code-sample">&#60;b-subheading&#62;</span>
  <span class="details">
    <strong>Gotham SSm A</strong>
    12px / 1.3 / 600
  </span>
  <b-subheading>Sub heading</b-subheading>
</div>
 <div class="item">
  <span class="code-sample">&#60;b-big-body&#62;</span>
  <span class="details">
    <strong>Gotham SSm A</strong>
    14px / 1.5 / 400
  </span>
  <div><b-big-body>Big body</b-big-body></div>
</div>
 <div class="item">
  <span class="code-sample">&#60;b-bold-body&#62;</span>
  <span class="details">
    <strong>Gotham SSm A</strong>
    12px / 1.5 / 600
  </span>
  <div><b-bold-body>Bold body</b-bold-body></div>
</div>
<div class="item">
  <span class="code-sample"></span>
  <span class="details">
    <strong>Gotham SSm A</strong>
    12px / 1.5 / 400
  </span>
  <div>Default body font</div>
</div>
<div class="item">
  <span class="code-sample">&#60;b-caption&#62;</span>
  <span class="details">
    <strong>Gotham SSm A</strong>
    11px / 1.5 / 400
  </span>
  <div><b-caption>Caption</b-caption></div>
</div>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Typography'" style="background-color: rgb(247,247,247);">
  <div style="max-width: none;">
    ${displayTemplate}
  </div>
</b-story-book-layout>
`;

const note = `
## Typography
Typography is arranged in multiple levels:<br>
- display: large titles (usually top of page)<br>
- heading: section headings<br>
- body: regular text<br>
- caption: small text

#### Module: *TypographyModule*

-------------

#### Main syntax

~~~
<b-display-1>Display XLarge</b-display-1>
<b-display-2>Display Large</b-display-2>
<b-display-3>Display Medium</b-display-3>
<b-display-4>Display Small</b-display-4>
<b-heading>Heading</b-heading>
<b-subheading>Sub heading</b-subheading>
<b-big-body>Big Body</b-big-body>
<b-bold-body>Bold Body</b-bold-body>
<b-body>Regular text</b-body>
<b-caption>Caption</b-caption>
~~~

#### Alternative syntax

~~~
<h1 b-display-1>Display XLarge</h1>
<h2 b-display-2>Display Large</h2>
<h3 b-display-3>Display Medium</h3>
<h4 b-display-4>Display Small</h4>
<h5 b-heading>Heading</h5>
<h6 b-subheading>Sub heading</h6>
<p b-big-body>Big Body</p>
<p b-bold-body>Bold Body</p>
<p b-body>Regular text</p>
<p b-caption>Caption</p>
~~~

#### "Why not classes?" syntax

~~~
<h1 class="b-display-1">Display XLarge</h1>
<h2 class="b-display-2">Display Large</h2>
<h3 class="b-display-3">Display Medium</h3>
<h4 class="b-display-4">Display Small</h4>
<h5 class="b-heading">Heading</h5>
<h6 class="b-subheading">Sub heading</h6>
<p class="b-big-body">Big Body</p>
<p class="b-bold-body">Bold Body</p>
<p class="b-body">Regular text</p>
<p class="b-caption">Caption</p>
~~~


`;
typographyStories.add(
  'Text',
  () => ({
    template: storyTemplate,
    props: {},
    moduleMetadata: {
      imports: [TypographyModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
