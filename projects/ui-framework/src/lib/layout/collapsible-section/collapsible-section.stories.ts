import { storiesOf } from '@storybook/angular';
import { boolean, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { CollapsibleSectionModule } from './collapsible-section.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { mockText } from '../../mock.const';
import { randomNumber } from '../../services/utils/functional-utils';
import { CollapsibleSectionExampleModule } from './collapsible-section-example.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
  <b-collapsible-section
    [collapsible]="collapsible"
    [expanded]="expanded"
    [disabled]="disabled"
    [divided]="divided"
    [title]="title"
    [description]="description"
    [options]="options"
    (openedFirst)="loadData()"
    (opened)="onPanelOpened()"
    (closed)="onPanelClosed()">

      <b-button header [text]="buttonText" (clicked)="onClick()"></b-button>

      <p>{{ content[1] }}</p>
      <p>{{ content[2] }}</p>

      <div footer>
        Something to put in the footer
      </div>

  </b-collapsible-section>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Collapsible Section'" style="background-color: rgb(245,245,245);">

  <style>
    .exmpls-wrap > * {
      margin-bottom: 32px;
    }
  </style>

  <div class="exmpls-wrap" style="max-width: 1000px; width: 100%;">

   <b-collapsible-section-example-1
      [collapsible]="collapsible"
      [expanded]="expanded"
      [disabled]="disabled"
      [divided]="divided"
      [disableAnimation]="disableAnimation"
      (openedFirst)="loadData()"
      (closed)="onPanelClosed()"
      (opened)="onPanelOpened()">
   </b-collapsible-section-example-1>

   <b-collapsible-section-example-2
      [title]="title"
      [description]="description"
      [collapsible]="collapsible"
      [expanded]="expanded"
      [disabled]="disabled"
      [divided]="divided"
      [disableAnimation]="disableAnimation"
      (openedFirst)="loadData()"
      (closed)="onPanelClosed()"
      (opened)="onPanelOpened()">
   </b-collapsible-section-example-2>

</div>

</b-story-book-layout>
`;

const note = `
  ## Collapsible Section

  #### Module
  *CollapsibleSectionModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [collapsible] | boolean | if the section is collapsible | false
  [expanded] | boolean | if the panel is expanded (open) | false
  [disabled] | boolean | if the panel is disabled (can't be opened) | false
  [divided] | boolean | if the panel has a divider between the header and the content | true
  [title] | string | section title | &nbsp;
  [description] | string | section description (subtitle) | &nbsp;
  [options] | CollapsibleOptions | additional options, among which: <br> **options.headerTranscludeStopPropagation** \
  - set to true to prevent click event propagation from content transcluded in header (for example, to prevent buttons\
     opening/closing the panel)<br>**options.indicatorColor** - add border on the left of the section with this color
     | COLLAPSIBLE<sub>-</sub>OPTIONS<sub>-</sub>DEF
  **(openedFirst)** |  EventEmitter<wbr>&lt;void&gt; | emits when collapsible panel is *opened first time*. <br> Bind to this to fetch or init data. | &nbsp;
  (opened) |  EventEmitter<wbr>&lt;void&gt; | emits when collapsible panel is opened | &nbsp;
  (closed) |  EventEmitter<wbr>&lt;void&gt; | emits when collapsible panel is closed | &nbsp;

  <u>Content marked with [header] attribute</u> will be projected into the  header (if Title text \
    is present, the [header] content will be placed to the right of the Title, if no Title \
    is present, [header] content will take the full width of header).

  <u>Content marked with [footer] attribute</u> will be projected into the panel footer.

  <u>Other content</u> will be transcluded in the section body (panel).

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Collapsible Section',
  () => {
    return {
      template: storyTemplate,
      props: {
        collapsible: boolean('collapsible', false),
        expanded: boolean('expanded', false),
        disabled: boolean('disabled', false),
        divided: boolean('divided', true),
        disableAnimation: boolean('disableAnimation', false),
        title: text('title', mockText(randomNumber(2, 5))),
        description: text('description', mockText(randomNumber(3, 6))),
        loadData: action('Panel opened FIRST'),
        onPanelOpened: action('Panel opened'),
        onPanelClosed: action('Panel closed'),
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CollapsibleSectionModule,
          CollapsibleSectionExampleModule,
        ],
        entryComponents: [],
      },
    };
  },
  { notes: { markdown: note } }
);
