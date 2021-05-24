import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../consts';
import { withKnobs } from '@storybook/addon-knobs';

import { SelectAndViewModule } from './select-and-view.module';
import { optionsMock } from './select-and-view.mock';
import { cloneDeep } from 'lodash';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-select-and-view [options]="options"
                   [value]="value">
</b-select-and-view>
`;

// TODO: need to be filled
const note = ``;

const storyTemplate = `
<b-story-book-layout [title]="'Select and view'">
  <div style="display: flex; flex-direction: column; max-width: 100%">
    <div style="margin-bottom: 30px">this component is in progress</div>
    ${template}
  </div>
</b-story-book-layout>
`;

const options = cloneDeep(optionsMock);
const value = [
  options[0].options[0].id,
  options[1].options[0].id,
  options[1].options[1].id
];

story.add(
  'Select and view',
  () => ({
    template: storyTemplate,
    props: {
      options: options,
      value: value,
    },
    moduleMetadata: {
      imports: [
        StoryBookLayoutModule,
        SelectAndViewModule,
      ]
    }
  }),
  { notes: { markdown: note } }
);
