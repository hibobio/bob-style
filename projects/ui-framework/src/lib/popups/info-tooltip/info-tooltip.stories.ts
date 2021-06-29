import { action } from '@storybook/addon-actions';
import { object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { LinkColor, LinkTarget } from '../../indicators/link/link.enum';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { InfoTooltipModule } from './info-tooltip.module';

const story = storiesOf(ComponentGroupType.Tooltip, module).addDecorator(
  withKnobs
);

const template = `<b-info-tooltip
              [title]="title"
              [text]="text"
              [link]="link"
              (linkClicked)="onLinkClick()"></b-info-tooltip>`;

const note = `
  ## Switch toggle element
  #### Module
  *InfoTooltipModule*

  ~~~
  <b-info-tooltip
              [config]="infoTooltipConfig">
  </b-info-tooltip>
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [config] | InfoTooltip | single config input
  [icon] | Icons | icon to use for trigger (most of the time, omit this input to keep to default)
  [title] | string | tooltip title
  [text] | string | tooltip text
  [link] | Link | tooltip link config
  (linkClicked) | EventEmitter<wbr>&lt;void&gt; | emitted on link click (use to attach methods to links - vs. urls)

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `<b-story-book-layout [title]="'Info Tooltip'">
    ${template}
</b-story-book-layout>`;

story.add(
  'Info tooltip',
  () => ({
    template: storyTemplate,
    props: {
      title: text('title', 'Panel title'),
      text: text(
        'text',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut'
      ),
      link: object('link', {
        text: 'Click here',
        url: 'https://app.hibob.com',
        color: LinkColor.primary,
        target: LinkTarget.blank,
      }),
      onLinkClick: action('Link clicked'),
    },
    moduleMetadata: {
      imports: [InfoTooltipModule, StoryBookLayoutModule],
    },
  }),
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
