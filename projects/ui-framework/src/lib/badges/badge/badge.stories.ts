import { storiesOf, moduleMetadata } from '@storybook/angular';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { BadgesModule } from '../badges.module';
import { BadgeType } from '../badges.enum';
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Badges, module).addDecorator(
  withKnobs
);

const typeOptions = values(BadgeType);
const template = `
<b-badge  [type]="type"
          [text]="text">
</b-badge>
`;
const note = `
  ## Text-only Badge
  #### Module
  *BadgesModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  text | string | badge text | ''
  type | BadgeType | enum for setting the badge type | default (optional)


  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout title="Badge">
  <div style="margin: 100px auto;">
    ${template}
  </div>
</b-story-book-layout>
`;

story.add(
  'Text-only Badge',
  () => ({
    template: storyTemplate,
    props: {
      type: select('type', typeOptions, BadgeType.default),
      text: text('text', 'Badge text'),
    },
    moduleMetadata: {
      imports: [BadgesModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
