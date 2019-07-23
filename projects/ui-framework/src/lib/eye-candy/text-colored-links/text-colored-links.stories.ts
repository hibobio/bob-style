import { storiesOf } from '@storybook/angular';
import { withKnobs, boolean, object } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import {TextColoredLinksModule} from './text-colored-links.module';
import {COLOR_TEXT_ITEMS} from './text-colored-links/text-colored-links.mocks';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const textColoredLinksStories = storiesOf(
  ComponentGroupType.EyeCandy,
  module
).addDecorator(withKnobs);

const template = `
<div>
  <b-text-colored-links [colorTextItems]="colorTextItems"
                        [isClickable]="isClickable">
  </b-text-colored-links>
</div>

`;
const note = `
## Text Colored Links
The Text Colored Links is a list of links with colors, fonts etc.

#### Module
*TextColoredLinksModule*

#### Style customization
property name | Description
--- | ---
texts: | string[] - Array of text strings
colors: | string[] - Array of color strings to random from
sizes: | string[] - Array of size class names
fonts: | string[] - Array of font class names

~~~
b-text-colored-links
~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi List And Chips'" style=" background: rgb(247,247,247);">
  <div style="max-width:900px;">
    ${template}
  </div>

</b-story-book-layout>
`;

textColoredLinksStories.add(
  'Text colored links',
  () => ({
    template: storyTemplate,
    props: {
      isClickable: boolean('isClickable', true),
      colorTextItems: object('texts', COLOR_TEXT_ITEMS),
    },
    moduleMetadata: {
      imports: [
        TextColoredLinksModule,
        StoryBookLayoutModule,
      ],
    }
  }),
  { notes: { markdown: note } }
);
