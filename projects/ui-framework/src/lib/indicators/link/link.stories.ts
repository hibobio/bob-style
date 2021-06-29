import { action } from '@storybook/addon-actions';
import { object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LinkColor, LinkTarget } from './link.enum';
import { LinkModule } from './link.module';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);
const template = `<b-link [config]="config" (clicked)="onClick()"></b-link>`;

const storyTemplate = `<b-story-book-layout [title]="'Link'">
    ${template}
</b-story-book-layout>`;

const note = `
  ## Link Element
  #### Module
  *LinkModule*

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [config] | Link | link configuration - text, url, target: LinkTarget, color: LinkColor
  (clicked) | EventEmitter<wbr>&lt;void&gt; | emitted on link click (use to attach methods to links - vs. urls)

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Link',
  () => {
    return {
      template: storyTemplate,
      props: {
        config: object('config', {
          text: 'Learn more',
          url: 'https://app.hibob.com',
          target: LinkTarget.blank,
          color: LinkColor.none,
        }),
        onClick: action('Link clicked'),
      },
      moduleMetadata: {
        imports: [LinkModule, StoryBookLayoutModule],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
