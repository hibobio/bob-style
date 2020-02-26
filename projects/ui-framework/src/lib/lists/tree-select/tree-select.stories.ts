import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../consts';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TreeSelectModule } from './tree-select.module';
import { mockText } from '../../mock.const';
import { TreeListStoriesCommonProps } from '../tree-list/tree-list.stories.common';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate = `
<b-tree-select
      [type]="type"
      [list]="options === 'simple' ? listSimple : listRandom"
      [keyMap]="options === 'simple' ? serverKeyMap : null"
      [value]="options === 'simple' ? valueSimple : valueRandom"
      [label]="label"
      [placeholder]="placeholder"
      [description]="description"
      [maxHeightItems]="maxHeightItems"
      [valueSeparatorChar]="valueSeparatorChar"
      [startCollapsed]="startCollapsed"
      [showSingleGroupHeader]="showSingleGroupHeader"
      [disabled]="disabled"
      [required]="required"
      [readonly]="readonly"
      [hintMessage]="hintMessage"
      [errorMessage]="errorMessage"
      [debug]="debug">

</b-tree-select>
`;

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
  ${componentTemplate}
  ~~~
`;

story.add(
  'Tree Select',
  () => {
    return {
      template,
      props: {
        ...TreeListStoriesCommonProps(),

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
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          TreeSelectModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
