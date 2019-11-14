import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  array,
  object,
  withKnobs
} from '@storybook/addon-knobs/angular';
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
    [leftBorderColor]="leftBorderColor"
    [description]="description"
    [options]="options"
    (closed)="onPanelClosed($event)"
    (opened)="onPanelOpened($event)">

      <b-button header [text]="buttonText" (clicked)="onClick()"></b-button>

      <p>{{ content[1] }}</p>
      <p>{{ content[2] }}</p>

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
      (closed)="onPanelClosed($event)"
      (opened)="onPanelOpened($event)">
   </b-collapsible-section-example-1>

   <b-collapsible-section-example-2
      [title]="title"
      [leftBorderColor]="leftBorderColor"
      [description]="description"
      [collapsible]="collapsible"
      [expanded]="expanded"
      [disabled]="disabled"
      [divided]="divided"
      (closed)="onPanelClosed($event)"
      (opened)="onPanelOpened($event)">
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
  [title] | string | section title | none
  [leftBorderColor] | string | color for the left border of the header and content panel | none
  [description] | string | section description (subtitle) | none
  [options] | CollapsibleOptions | additional options, among which: <br> **options.headerTranscludeStopPropagation** - set to true to prevent click event propagation from content transcluded in header (for example, to prevent buttons opening/closing the panel) | false
  (opened) |  EventEmitter | emits when collapsible panel was opened | none
  (closed) |  EventEmitter | emits when collapsible panel was closed | none

  Content marked with [header] attribute will be projected into the  header (if Title text is present, the [header] content will be placed to the right of the Title, if no Title is present, [header] content will take the full width of header).

  Other content will be transcluded in the section body (panel).

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
        title: text('title', mockText(randomNumber(2, 5))),
        leftBorderColor: text('leftBorderColor', '#5555ff'),
        description: text('description', mockText(randomNumber(3, 6))),
        onPanelOpened: action('Panel opened'),
        onPanelClosed: action('Panel closed')
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CollapsibleSectionModule,
          CollapsibleSectionExampleModule
        ],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
