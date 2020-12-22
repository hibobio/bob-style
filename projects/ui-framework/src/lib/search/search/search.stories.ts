import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SearchModule } from './search.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { select } from '@storybook/addon-knobs';
import { FormElementSize } from '../../form-elements/form-elements.enum';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `
<b-search [value]="value"
          [label]="label"
          [placeholder]="placeholder"
          [size]="size"
          (searchChange)="searchChange($event)"
          (searchFocus)="searchFocus($event)">
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
  [value] | string | input value | &nbsp;
  [label] | string | label text | &nbsp;
  [placeholder] | string | placeholder text | &nbsp;
  [hideLabelOnFocus] | boolean | make label behave as placeholder | true
  [enableBrowserAutoComplete] | InputAutoCompleteOptions | enable/disable autocomplete | off
  [size] | FormElementSize | regular height (44px), smaller height (36px) | regular
  (searchFocus) | EventEmitter<wbr>&lt;string&gt;  | emits on input focus | &nbsp;
  (searchChange) | EventEmitter<wbr>&lt;string&gt;  | emits on input value change | &nbsp;

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
        searchChange: action('searchChange'),
        searchFocus: action('searchFocus'),
        size: select(
          'size',
          Object.values(FormElementSize),
          FormElementSize.regular
        ),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, SearchModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
