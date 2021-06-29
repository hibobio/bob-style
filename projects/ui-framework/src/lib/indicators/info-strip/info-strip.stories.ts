import { action } from '@storybook/addon-actions';
import {
  boolean,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { CheckboxModule } from '../../form-elements/checkbox/checkbox.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LinkTarget } from '../link/link.enum';
import { InfoStripIconSize, InfoStripIconType } from './info-strip.enum';
import { InfoStripModule } from './info-strip.module';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const template = `<b-info-strip
        [iconType]="iconType"
        [iconSize]="iconSize"
        [link]="link"
        [fullWidth]="fullWidth"
        [text]="text"
        (linkClicked)="onLinkClick()">
</b-info-strip>`;

const template2 = `<b-info-strip
        [fullWidth]="fullWidth"
        [iconType]="infoStripIconType.warning"
        [iconSize]="infoStripIconSize.normal"
        [text]="'Please agree with everything I say'">
    <b-checkbox [label]="'I agree with everything you say'" [ngClass]="fullWidth ? 'mrg-l-8' : 'mrg-t-8'"></b-checkbox>
</b-info-strip>`;

const storyTemplate = `<b-story-book-layout [title]="'Info Strip'">
  <div>
    ${template}
    <br>
    ${template2}
  </div>
</b-story-book-layout>`;

const note = `
  ## Info Strip Element
  #### Module
  *InfoStripModule*

  ~~~
  ${template}

  ${template2}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [iconType] | InfoStripIconType | icon type - information, error, warning, success
  [iconSize] | InfoStripIconSize | icon size - normal, large
  [text] | string | The text inside the strip
  [link] | Link | link definition - text, url, color, target
  (linkClicked) | EventEmitter<wbr>&lt;void&gt; | emitted on link click (use to attach methods to links - vs. urls)

  *Note:* You can also pass content to the strip - it will appear between text and link (if they are present):
  \`<b-info-strip> My content </b-info-strip>\`
`;

story.add(
  'Info Strip',
  () => {
    return {
      template: storyTemplate,
      props: {
        infoStripIconType: InfoStripIconType,
        infoStripIconSize: InfoStripIconSize,
        iconType: select(
          'iconType',
          Object.values(InfoStripIconType),
          InfoStripIconType.information
        ),
        iconSize: select(
          'iconSize',
          Object.values(InfoStripIconSize),
          InfoStripIconSize.large
        ),
        text: text('text', 'Place your info text here'),
        fullWidth: boolean('fullWidth', false),
        link: object('link', {
          text: 'Click here',
          url: 'https://app.hibob.com',
          target: LinkTarget.blank,
        }),
        onLinkClick: action('Link clicked'),
      },
      moduleMetadata: {
        imports: [InfoStripModule, StoryBookLayoutModule, CheckboxModule],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
