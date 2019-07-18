import { storiesOf } from '@storybook/angular';
import { withKnobs, boolean, object } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import {TextColoredLinksModule} from './text-colored-links.module';
import {COLOR_TEXT_ITEMS} from './text-colored-links/text-colored-links.mocks';

const textColoredLinksStories = storiesOf(
  ComponentGroupType.EyeCandy,
  module
).addDecorator(withKnobs);

const displayTemplate = `
<style>
  div {
    border-bottom: 1px solid #c4cdd5;

  }
  div .code-sample {
    padding: 4px 8px;
    background-color: #d4dde6;
    display: inline-block;
    margin-bottom: 10px;
    font-weight: 500;
  }
</style>
<div>
  <span class="code-sample">&#60;b-text-colored-links&#62;</span><br/>
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
textColoredLinksStories.add(
  'Text colored links',
  () => ({
    template: displayTemplate,
    props: {
      isClickable: boolean('isClickable', true),
      colorTextItems: object('texts', COLOR_TEXT_ITEMS),
    },
    moduleMetadata: {
      imports: [TextColoredLinksModule]
    }
  }),
  { notes: { markdown: note } }
);
