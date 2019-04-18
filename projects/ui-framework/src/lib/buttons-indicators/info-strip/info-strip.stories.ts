import { storiesOf } from '@storybook/angular';
import { text, withKnobs, select, object } from '@storybook/addon-knobs/angular';
import { InfoStripModule } from './info-strip.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { IconColor, Icons } from '../../icons/icons.enum';
import { values } from 'lodash';
import { LinkColor, LinkTarget } from '../link/link.enum';

const infoStripStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module).addDecorator(
  withKnobs
);
const icons = values(Icons);
const color = values(IconColor);

const template = `<b-info-strip
  [icon]="icon"
  [iconColor]="iconColor"
  [link]="link"
  [text]="text"></b-info-strip>`;

const storyTemplate = `<b-story-book-layout title="Info Strip">
  <div style="margin: 0px 25px;">
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
  icon | string | icon | baseline_info_icon (optional)
  iconColor | string | icon color | inform (optional)
  text | string | The text inside the strip
  link | json | link definition - text, url, color, target |
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
        icon: select('icon', icons, Icons.baseline_info_icon),
        iconColor: select('color', color, IconColor.inform),
        text: text('text', 'Place your info text here'),
        link: object('link', {
          text: 'Click here', url: 'https://app.hibob.com', target: LinkTarget.blank, color: LinkColor.none })
      },
      moduleMetadata: {
        imports: [InfoStripModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
