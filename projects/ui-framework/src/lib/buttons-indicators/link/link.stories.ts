import { storiesOf } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs/angular';
import { LinkModule } from './link.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LinkColor, LinkTarget } from './link.enum';

const linkStories = storiesOf(
  ComponentGroupType.ButtonsAndIndicators,
  module
).addDecorator(withKnobs);
const template = `<b-link [config]="config"></b-link>`;

const storyTemplate = `<b-story-book-layout [title]="'Link'">
    ${template}
</b-story-book-layout>`;

const note = `
  ## Link Element
  #### Module
  *LinkModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  config | Link | link configuration - text, url, target: LinkTarget, color: LinkColor
  ~~~
  ${template}
  ~~~
`;

linkStories.add(
  'Link',
  () => {
    return {
      template: storyTemplate,
      props: {
        config: object('config', {
          text: 'Learn more',
          url: 'https://app.hibob.com',
          target: LinkTarget.blank,
          color: LinkColor.none
        })
      },
      moduleMetadata: {
        imports: [LinkModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
