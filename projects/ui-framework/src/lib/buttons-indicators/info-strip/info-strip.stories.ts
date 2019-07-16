import { storiesOf } from '@storybook/angular';
import {
  text,
  withKnobs,
  select,
  object
} from '@storybook/addon-knobs/angular';
import { InfoStripModule } from './info-strip.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { values } from 'lodash';
import { LinkColor, LinkTarget } from '../link/link.enum';
import { InfoStripIconType } from './info-strip.enum';

const infoStripStories = storiesOf(
  ComponentGroupType.ButtonsAndIndicators,
  module
).addDecorator(withKnobs);
const iconTypes = values(InfoStripIconType);

const template = `
<b-info-strip
  [iconType]="iconType"
  [link]="link"
  [text]="text"></b-info-strip>
`;

const storyTemplate = `<b-story-book-layout [title]="'Info Strip'">
  <div>
    ${template}
  </div>
</b-story-book-layout>`;

const note = `
  ## Info Strip Element
  #### Module
  *InfoStripModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  iconType | InfoStripIconType | icon type - information, error, warning, success
  text | string | The text inside the strip
  link | Link | link definition - text, url, color, target
  ~~~
  ${template}
  ~~~
`;

infoStripStories.add(
  'Info Strip',
  () => {
    return {
      template: storyTemplate,
      props: {
        iconType: select('iconType', iconTypes, InfoStripIconType.information),
        text: text('text', 'Place your info text here'),
        link: object('link', {
          text: 'Click here',
          url: 'https://app.hibob.com',
          target: LinkTarget.blank,
          color: LinkColor.none
        })
      },
      moduleMetadata: {
        imports: [InfoStripModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
