import { storiesOf } from '@storybook/angular';
import {
  text,
  withKnobs,
  select,
  object,
} from '@storybook/addon-knobs/angular';
import { InfoStripModule } from './info-strip.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { values } from 'lodash';
import { LinkColor, LinkTarget } from '../link/link.enum';
import { InfoStripIconSize, InfoStripIconType } from './info-strip.enum';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);
const iconTypes = values(InfoStripIconType);
const iconSizes = values(InfoStripIconSize);

const template = `<b-info-strip
        [iconType]="iconType"
        [iconSize]="iconSize"
        [link]="link"
        [text]="text"
        (linkClicked)="onLinkClick()"></b-info-strip>
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
  Name | Type | Description
  --- | --- | --- | ---
  [iconType] | InfoStripIconType | icon type - information, error, warning, success
  [iconSize] | InfoStripIconSize | icon size - normal, large
  [text] | string | The text inside the strip
  [link] | Link | link definition - text, url, color, target
  (linkClicked) | EventEmitter<wbr>&lt;void&gt; | emitted on link click (use to attach methods to links - vs. urls)

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Info Strip',
  () => {
    return {
      template: storyTemplate,
      props: {
        iconType: select('iconType', iconTypes, InfoStripIconType.information),
        iconSize: select('iconSize', iconSizes, InfoStripIconSize.large),
        text: text('text', 'Place your info text here'),
        link: object('link', {
          text: 'Click here',
          url: 'https://app.hibob.com',
          target: LinkTarget.blank,
          color: LinkColor.none,
        }),
        onLinkClick: action('Link clicked'),
      },
      moduleMetadata: {
        imports: [InfoStripModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
