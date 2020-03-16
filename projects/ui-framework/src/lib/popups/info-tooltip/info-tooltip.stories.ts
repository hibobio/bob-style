import { storiesOf } from '@storybook/angular';
import { withKnobs, object, text } from '@storybook/addon-knobs/angular';
import { InfoTooltipModule } from './info-tooltip.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LinkColor, LinkTarget } from '../../indicators/link/link.enum';
import { action } from '@storybook/addon-actions';

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

  #### Properties
  Name | Type | Description
  --- | --- | ---
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
  { notes: { markdown: note } }
);
