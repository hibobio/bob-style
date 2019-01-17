import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { SearchModule } from './search.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const inputStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-search style="display:block; width: 400px;"
          [value]="value"
          [placeholder]="placeholder"
          [hideLabelOnFocus]="hideLabelOnFocus">
</b-search>
`;

const note = `
  ## Search Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
  value | string/number/float | type of input field
  placeholder | string | placeholder text
  hideLabelOnFocus | boolean | should hide label on focus

  ~~~
  ${ template }
  ~~~
`;
inputStories.add(
  'Search',
  () => {
    return {
      template,
      props: {
        value: text('value', ''),
        placeholder: text('placeholder', 'Search'),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          SearchModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
