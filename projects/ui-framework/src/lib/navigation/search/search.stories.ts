import { storiesOf } from '@storybook/angular';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { SearchModule } from './search.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const inputStories = storiesOf(ComponentGroupType.Navigation, module).addDecorator(withKnobs);

const template = `
<b-search style="width: 400px;"
          [value]="value"
          [label]="label"
          [hideLabelOnFocus]="hideLabelOnFocus"
          (inputChange)="inputChange($event)"
          (searchChange)="searchChange($event)">
</b-search>
`;

const storyTemplate = `
<b-story-book-layout title="Search">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Search Element

  #### Module
  *SingleListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  value | string/number/float | type of input field | none
  label | string | label text | none
  hideLabelOnFocus | boolean | should hide label on focus | false
  inputChange | action | inputChange output InputEvent | none
  searchChange | action | searchChange output string | none

  ~~~
  ${template}
  ~~~
`;
inputStories.add(
  'Search',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: text('value', 'Alan Tulin'),
        label: text('label', 'Search'),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        inputChange: action(),
        searchChange: action(),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, SearchModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
