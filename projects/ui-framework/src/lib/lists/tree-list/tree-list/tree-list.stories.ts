import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import treeListPropsDoc from '../tree-list.properties.md';
import { TreeListStoriesCommonProps } from '../tree-list.stories.common';
import { TreeListModule } from './tree-list.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `<b-tree-list
      [type]="type"
      [mode]="mode"
      [keyMap]="options === 'simple' ? serverKeyMap : null"
      [list]="options === 'simple' ? listSimple : options === 'single group' ? listSingleGroup : options === 'big' ? listHuge : listRandom"
      [value]="options === 'simple' ? valueSimple : valueRandom"
      [viewFilter]="hideSelected ? {
        hide: {
          prop: { selected: true }
        }
      } : externalSearch ? {
        show: {
          search: externalSearch
        }
      } : undefined"
      [listActions]="footerActions"
      [maxHeightItems]="maxHeightItems"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [readonly]="readonly"
      [disabled]="disabled"
      (changed)="changed($event)"
      (apply)="apply()"
      (cancel)="cancel()">

</b-tree-list>`;

const templateForNotes = `<b-tree-list
      [type]="type"
      [mode]="mode"
      [keyMap]="keyMap"
      [list]="list"
      [value]="value"
      [listActions]="footerActions"
      [maxHeightItems]="maxHeightItems"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [readonly]="readonly"
      [disabled]="disabled"
      (changed)="changed($event)"
      (apply)="onApply()"
      (cancel)="onCancel()">
</b-tree-list>`;

const storyTemplate = `
<b-story-book-layout [title]="'Tree List'">
  <div style="max-width: 500px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Tree List

  #### Module
  *TreeListModule*

  ~~~
  ${templateForNotes}
  ~~~

  ${treeListPropsDoc}

`;

story.add(
  'Tree List',
  () => ({
    template: storyTemplate,
    props: {
      ...TreeListStoriesCommonProps(),
    },
    moduleMetadata: {
      imports: [BrowserAnimationsModule, StoryBookLayoutModule, TreeListModule],
      entryComponents: [],
    },
  }),
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
