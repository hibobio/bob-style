import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { TreeListModule } from './tree-list.module';
import { TreeListStoriesCommonProps } from '../tree-list.stories.common';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

// @ts-ignore: md file and not a module
import treeListPropsDoc from '../tree-list.properties.md';

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
  { notes: { markdown: note } }
);
