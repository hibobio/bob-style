import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { boolean } from '@storybook/addon-knobs';
import { EditableTreeListModule } from './editable-tree-list.module';
import { TreeListStoriesCommonProps } from '../tree-list.stories.common';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-editable-tree-list

      [keyMap]="options === 'simple' ? serverKeyMap : null"
      [list]="options === 'simple' ? listSimple : options === 'single group' ? listSingleGroup : options === 'big' ? listHuge : listRandom"
    >

</b-editable-tree-list>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Editable Tree List'">
  <div style="max-width: 500px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Editable Tree List

  #### Module
  *EditableTreeListModule*


`;

story.add(
  'Editable Tree List',
  () => ({
    template: storyTemplate,
    props: {
      ...TreeListStoriesCommonProps(),
      debug: boolean('debug', true, 'Props'),
    },
    moduleMetadata: {
      imports: [
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        EditableTreeListModule,
      ],
      entryComponents: [],
    },
  }),
  { notes: { markdown: note } }
);
