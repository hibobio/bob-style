import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { SearchModule } from './search.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `
<b-search [value]="value"
          [label]="label"
          [placeholder]="placeholder"
          (searchChange)="searchChange($event)">
</b-search>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Search'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Search Element

  #### Module
  *SingleListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  value | string/number/float | type of input field | &nbsp;
  label | string | label text | &nbsp;
  searchChange | action | searchChange output string | &nbsp;

  ~~~
  ${template}
  ~~~
`;
story.add(
  'Search',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: text('value', ''),
        label: text('label', ''),
        placeholder: text('placeholder', 'Search'),
        searchChange: action('searchChange')
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, SearchModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
