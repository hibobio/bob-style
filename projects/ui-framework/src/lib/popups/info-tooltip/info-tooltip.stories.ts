import { storiesOf } from '@storybook/angular';
import { withKnobs, object, text } from '@storybook/addon-knobs/angular';
import { InfoTooltipModule } from './info-tooltip.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LinkColor, LinkTarget } from '../../buttons-indicators/link/link.enum';

const stories = storiesOf(ComponentGroupType.Popups, module).addDecorator(withKnobs);

const template = `<b-info-tooltip [text]="text" [link]="link" [title]="title"></b-info-tooltip>`;

const note = `
  ## Switch toggle element
  #### Module
  *InfoTooltipModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  title | string | tooltip title | ''
  text | string | tooltip text | ''
  link | Link | tooltip link
  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `<b-story-book-layout [title]="'Info Tooltip'">
  ${template}
</b-story-book-layout>`;

stories.add(
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
        target: LinkTarget.blank
      })
    },
    moduleMetadata: {
      imports: [InfoTooltipModule, StoryBookLayoutModule]
    }
  }),
  { notes: { markdown: note } }
);
