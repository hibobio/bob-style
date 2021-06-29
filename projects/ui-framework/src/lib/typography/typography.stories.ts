import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../consts';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';
import { TypographyModule } from './typography.module';

const story = storiesOf(ComponentGroupType.Typography, module).addDecorator(
  withKnobs
);

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

<mark class="text-left">
  <h4 class="mrg-0 uppercase">Note:</h4>
  the <b>&#60;b-display-1&#62;</b>, <b>&#60;b-body&#62;</b> notation is being <b><u>deprecated</u></b> and is no longer advisable.<br>
  It's now preferable to use <u>semantic</u> tag with an attribute or class:<br>
  <b>&#60;h1 b-display-1&#62;</b>, <b>&#60;big class="b-big-body"&#62;</b>, <b>&#60;span b-body&#62;</b>, <b>&#60;strong class="b-bold-body"&#62;</b> etc.
</mark>

<div class="item">
  <span class="code-sample">
    &#60;h1 b-display-1&#62;,
    <s>&#60;b-display-1&#62;</s>
  </span>
  <div class="details">
    <strong>Sentinel SSm A</strong>
    42px / 1.3 / 900
  </div>
  <h1 b-display-1>Display XLarge</h1>
</div>
<div class="item">
  <span class="code-sample">
    &#60;h2 b-display-2&#62;,
    <s>&#60;b-display-2&#62;</s>
  </span>
  <div class="details">
    <strong>Sentinel SSm A</strong>
    28px / 1.3 / 900
  </div>
  <h2 b-display-2>Display Large</h2>
</div>
<div class="item">
  <span class="code-sample">
    &#60;h3 b-display-3&#62;,
    <s>&#60;b-display-3&#62;</s>
  </span>
  <div class="details">
    <strong>Sentinel SSm A</strong>
    22px / 1.3 / 900
  </div>
  <h3 b-display-3>Display Medium</h3>
</div>
<div class="item">
  <span class="code-sample">
    &#60;h4 b-display-4&#62;,
    <s>&#60;b-display-4&#62;</s>
  </span>
  <div class="details">
    <strong>Sentinel SSm A</strong>
    18px / 1.3 / 500
  </div>
  <h4 b-display-4>Display Small</h4>
</div>
<div class="item">
  <span class="code-sample">
    &#60;h5 b-heading&#62;, <s>&#60;b-heading&#62;</s>
  </span>
  <div class="details">
    <strong>Gotham SSm A</strong>
    14px / 1.3 / 600
  </div>
  <h5 b-heading>Heading</h5>
</div>
<div class="item">
  <span class="code-sample">
    &#60;h6 b-subheading&#62;,
    <s>&#60;b-subheading&#62;</s>
  </span>
  <div class="details">
    <strong>Gotham SSm A</strong>
    12px / 1.3 / 600
  </div>
  <h6 b-subheading>Sub heading</h6>
</div>

 <div class="item">
  <span class="code-sample">
    &#60;big b-big-body&#62;,
    <s>&#60;b-big-body&#62;</s>
  </span>
  <div class="details">
    <strong>Gotham SSm A</strong>
    14px / 1.5 / 400
  </div>
  <div><big>Big body</big></div>
</div>
 <div class="item">
  <span class="code-sample">
    &#60;strong b-bold-body&#62;,
    <s>&#60;b-bold-body&#62;</s>
  </span>
  <div class="details">
    <strong>Gotham SSm A</strong>
    12px / 1.5 / 600
  </div>
  <div><strong>Bold body</strong></div>
</div>
<div class="item">
  <div class="details">
    <strong>Gotham SSm A</strong>
    12px / 1.5 / 400
  </div>
  <div>Default body font</div>
</div>
<div class="item">
  <span class="code-sample">
    &#60;small b-caption&#62;,
    <s>&#60;b-caption&#62;</s>
  </span>
  <div class="details">
    <strong>Gotham SSm A</strong>
    11px / 1.5 / 400
  </div>
  <div><small>Caption</small></div>
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

~~~
<b-display-1>Display XLarge</b-display-1>
<b-display-2>Display Large</b-display-2>
<b-display-3>Display Medium</b-display-3>
<b-display-4>Display Small</b-display-4>
<b-heading>Heading</b-heading>
<b-subheading>Sub heading</b-subheading>
<b-big-body>Big Body</b-big-body>
<b-bold-body>Bold Body</b-bold-body>
Regular Body text
<b-caption>Caption</b-caption>
~~~

`;
story.add(
  'Text',
  () => ({
    template: storyTemplate,
    props: {},
    moduleMetadata: {
      imports: [TypographyModule, StoryBookLayoutModule],
    },
  }),
  {
    notes: { markdown: note },
    knobs: {
      timestamps: true,
      escapeHTML: false,
    },
  }
);
