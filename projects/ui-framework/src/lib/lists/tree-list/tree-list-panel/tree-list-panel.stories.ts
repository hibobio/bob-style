import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../../consts';
import { withKnobs } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { TreeListPanelModule } from './tree-list-panel.module';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { Icons } from '../../../icons/icons.enum';
import { ButtonType } from '../../../buttons/buttons.enum';
import { TreeListStoriesCommonProps } from '../tree-list.stories.common';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate = `
<b-tree-list-panel
      [type]="type"
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
      (closed)="closed()"
      [debug]="debug">

    <b-square-button  [disabled]="disabled"
                      [type]="buttonType.secondary"
                      [icon]="icons.table">
    </b-square-button>

</b-tree-list-panel>
`;

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
  ${componentTemplate}
  ~~~

  ### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [disabled] | boolean | if panel is disabled | false
  [readonly] | boolean | if true, will not emit events and not allow selection | false
  (opened) | EventEmitter<wbr>&lt;OverlayRef&gt; | emits OverlayRef on panel open | &nbsp;
  (closed) | EventEmitter<wbr>&lt;void&gt; | emits on panel close | &nbsp;
  &nbsp; | &nbsp; | &nbsp; | &nbsp;
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
  { notes: { markdown: note } }
);
