import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../../consts';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { TreeSelectModule } from './tree-select.module';
import { mockText } from '../../../mock.const';
import { TreeListStoriesCommonProps } from '../tree-list.stories.common';
import { action } from '@storybook/addon-actions';

import formElemsPropsDoc from '../../../form-elements/form-elements.properties.md';
import treeListPropsDoc from '../tree-list.properties.md';
import treeListPanelPropsDoc from '../tree-list-panel.properties.md';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);
const story2 = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const componentTemplate = `<b-tree-select
      [type]="type"
      [mode]="mode"
      [list]="options === 'simple' ? listSimple : listRandom"
      [keyMap]="options === 'simple' ? serverKeyMap : null"
      [value]="options === 'simple' ? valueSimple : valueRandom"
      [listActions]="footerActions"
      [label]="label"
      [placeholder]="placeholder"
      [description]="description"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [disabled]="disabled"
      [required]="required"
      [readonly]="readonly"
      [hintMessage]="hintMessage"
      [errorMessage]="errorMessage"
      (changed)="changed($event)"
      (opened)="opened()"
      (closed)="closed()"
      [debug]="debug">
</b-tree-select>`;

const templateForNotes = `<b-tree-select
      [type]="type"
      [mode]="mode"
      [list]="list"
      [keyMap]="keyMap"
      [value]="value"
      [listActions]="footerActions"
      [label]="label"
      [placeholder]="placeholder"
      [description]="description"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [disabled]="disabled"
      [required]="required"
      [readonly]="readonly"
      [hintMessage]="hintMessage"
      [errorMessage]="errorMessage"
      (changed)="changed($event)"
      (opened)="onOpened()"
      (closed)="onClosed()">

</b-tree-select>`;

const template = `
<b-story-book-layout [title]="'Tree Select'">
  <div style="max-width: 350px;">
  ${componentTemplate}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Tree Select

  #### Module
  *TreeSelectModule*

  ~~~
  ${templateForNotes}
  ~~~

  ${treeListPanelPropsDoc}

  ${treeListPropsDoc}

  ${formElemsPropsDoc}
`;

const toAdd = () => ({
  template,
  props: {
    ...TreeListStoriesCommonProps(
      {
        apply: true,
        cancel: true,
        clear: true,
        reset: false,
      },
      null
    ),

    label: text('label', 'label text', 'Props'),
    description: text('description', mockText(30), 'Props'),
    placeholder: text('placeholder', 'placeholder text', 'Props'),
    required: boolean('required', false, 'Props'),
    hintMessage: text(
      'hintMessage',
      'This field should contain something',
      'Props'
    ),
    errorMessage: text('errorMessage', '', 'Props'),

    opened: action('List opened'),
    closed: action('List closed'),
  },
  moduleMetadata: {
    imports: [BrowserAnimationsModule, StoryBookLayoutModule, TreeSelectModule],
  },
});

story.add('Tree Select', toAdd, { notes: { markdown: note } });
story2.add('Tree Select', toAdd, { notes: { markdown: note } });
