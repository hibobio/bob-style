import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ButtonType } from '../../../buttons/buttons.enum';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../../consts';
import { Icons } from '../../../icons/icons.enum';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import treeListPanelPropsDoc from '../tree-list-panel.properties.md';
// @ts-ignore: md file and not a module
import treeListPropsDoc from '../tree-list.properties.md';
import { TreeListStoriesCommonProps } from '../tree-list.stories.common';
import { TreeListPanelModule } from './tree-list-panel.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate = `<b-tree-list-panel
      [type]="type"
      [mode]="mode"
      [keyMap]="options === 'simple' ? serverKeyMap : null"
      [list]="options === 'simple' ? listSimple : listRandom"
      [value]="options === 'simple' ? valueSimple : valueRandom"
      [listActions]="footerActions"
      [maxHeightItems]="maxHeightItems"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [readonly]="readonly"
      [disabled]="disabled"
      (changed)="changed($event)"
      (apply)="apply()"
      (cancel)="cancel()"
      (opened)="opened()"
      (closed)="closed()">

    <b-square-button  [disabled]="disabled"
                      [type]="buttonType.secondary"
                      [icon]="icons.table">
    </b-square-button>

</b-tree-list-panel>`;

const templateForNotes = `<b-tree-list-panel
      [type]="type"
      [mode]="mode"
      [list]="list"
      [keyMap]="keyMap"
      [value]="value"
      [listActions]="footerActions"
      [maxHeightItems]="maxHeightItems"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [readonly]="readonly"
      [disabled]="disabled"
      (changed)="changed($event)"
      (apply)="onApply()"
      (cancel)="onCancel()"
      (opened)="onOpened()"
      (closed)="onClosed()">

    <b-square-button  [disabled]="disabled"
                      [type]="buttonType.secondary"
                      [icon]="icons.table">
    </b-square-button>

</b-tree-list-panel>`;

const template = `
<b-story-book-layout [title]="'Tree List Panel'">
  <div style="max-width: 400px;">
  ${componentTemplate}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Tree List Panel

  #### Module
  *TreeListPanelModule*

  ~~~
  ${templateForNotes}
  ~~~

  ${treeListPanelPropsDoc}

  ${treeListPropsDoc}
`;

story.add(
  'Tree List Panel',
  () => {
    return {
      template,
      props: {
        icons: Icons,
        buttonType: ButtonType,

        ...TreeListStoriesCommonProps({
          apply: true,
          cancel: true,
          clear: true,
          reset: false,
        }),

        opened: action('List opened'),
        closed: action('List closed'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          TreeListPanelModule,
          ButtonsModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
