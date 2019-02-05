import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { SearchModule } from './search.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const inputStories = storiesOf(ComponentGroupType.Navigation, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-story-book-layout title="Search">
  <b-search style="width: 400px;"
            [value]="value"
            [label]="label"
            [hideLabelOnFocus]="hideLabelOnFocus"
            (searchChange)="searchChange($event)">
  </b-search>
</b-story-book-layout>
`;

const note = `
  ## Search Element

  #### Properties

  Name | Type | Description
  --- | --- | ---
  value | string/number/float | type of input field
  label | string | label text
  hideLabelOnFocus | boolean | should hide label on focus
  searchChange | action | searchChange

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
        label: text('label', 'Search'),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        searchChange: action(),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          SearchModule,
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
