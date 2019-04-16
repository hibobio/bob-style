import { storiesOf } from '@storybook/angular';
import { text, withKnobs, select } from '@storybook/addon-knobs/angular';
import { InfoStripModule } from './info-strip.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { IconColor, Icons } from '../../icons/icons.enum';
import { values } from 'lodash';

const infoStripStories = storiesOf(ComponentGroupType.ButtonsAndIndicators, module).addDecorator(
  withKnobs
);
const icons = values(Icons);
const color = values(IconColor);

const template = `<b-info-strip
  [icon]="icon"
  [iconColor]="iconColor"
  [linkText]="linkText"
  [text]="text"
  [targetUrl]="targetUrl">
</b-info-strip>`;

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
  linkText | string | text of the link
  text | string | The text inside the strip
  targetUrl | string | url address

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
        linkText: text('linkText', 'click here'),
        text: text('text', 'Place your info text here'),
        targetUrl: text('targetUrl', 'https://app.hibob.com'),
      },
      moduleMetadata: {
        imports: [InfoStripModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
