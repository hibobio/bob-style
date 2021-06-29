import { cloneDeep } from 'lodash';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { optionsMock } from './select-and-view.mock';
import { SelectAndViewModule } from './select-and-view.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-select-and-view [options]="options"
                   [value]="value"
                   [valueDefault]="valueDefault"
                   (changed)="onChanged($event)">
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
  options[1].options[1].id,
];

const valueDefault = [options[2].options[2].id];

story.add(
  'Select and view',
  () => ({
    template: storyTemplate,
    props: {
      options: options,
      value: value,
      valueDefault: valueDefault,
      onChanged: action('onChanged'),
    },
    moduleMetadata: {
      imports: [
        StoryBookLayoutModule,
        SelectAndViewModule,
        BrowserAnimationsModule,
      ],
    },
  }),
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
