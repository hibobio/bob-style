import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../consts';
import { withKnobs } from '@storybook/addon-knobs';

import { SelectAndViewModule } from './select-and-view.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `<b-select-and-view></b-select-and-view>`;

// TODO: need to be filled
const note = ``;

const storyTemplate = `
<b-story-book-layout [title]="'Select and view'">
    <div>this component is in progress</div>
    ${template}
</b-story-book-layout>
`;

story.add(
  'Select and view',
  () => ({
    template: storyTemplate,
    props: {},
    moduleMetadata: {
      imports: [
        StoryBookLayoutModule,
        SelectAndViewModule,
      ]
    }
  }),
  { notes: { markdown: note } }
);
