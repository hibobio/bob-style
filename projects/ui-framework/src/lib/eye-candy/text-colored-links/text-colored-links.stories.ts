import { storiesOf } from '@storybook/angular';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { TextColoredLinksModule } from './text-colored-links.module';
import { COLOR_TEXT_ITEMS } from './text-colored-links/text-colored-links.mocks';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { DEFAULT_COLORS } from './text-colored-links.interface';

const story = storiesOf(ComponentGroupType.EyeCandy, module).addDecorator(
  withKnobs
);

const template = `
<div>
  <b-text-colored-links [colorTextItems]="colorTextItems"
                        [colors]="colors"
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
property name | Type | Description
--- | ---
texts: | ColorTextItem[] | Array of object with text and action
colors: | string[] - Optional | Array of color strings to random from
isClickable: | boolean - Optional | should have cursor:pointer and hover state or not

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

story.add(
  'Text colored links',
  () => ({
    template: storyTemplate,
    props: {
      isClickable: boolean('isClickable', true),
      colors: object('colors', DEFAULT_COLORS),
      colorTextItems: object('texts', COLOR_TEXT_ITEMS),
    },
    moduleMetadata: {
      imports: [TextColoredLinksModule, StoryBookLayoutModule],
    },
  }),
  { notes: { markdown: note } }
);
