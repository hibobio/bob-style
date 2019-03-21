import { storiesOf, moduleMetadata } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ChipsModule } from '../chips.module';
import { ChipType } from '../chips.enum';
import { values } from 'lodash';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';

const story = storiesOf(
  ComponentGroupType.ButtonsAndIndicators,
  module
).addDecorator(withKnobs);

const typeOptions = values(ChipType);
const template = `
  <b-chip [type]="type">
    {{ text }}
  </b-chip>
`;
const template2 = `
  <p b-chip [type]="type">
    Used as directive
  </p>
`;

const note = `
  ## Text-only Chip
  #### Module
  *ChipsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  text | string | chip text | ''
  type | ChipType | enum for setting the chip type (empty, default, info, success, attention, warning) | default (optional)


  ~~~
  ${template}
  ${template2}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout title="Chip">
  <div style="margin: 100px auto;">
    ${template}
  </div>
</b-story-book-layout>
`;

story.add(
  'Chip',
  () => ({
    template: storyTemplate,
    props: {
      type: select('type', typeOptions, ChipType.default),
      text: text('text', 'Chip text')
    },
    moduleMetadata: {
      imports: [ChipsModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
