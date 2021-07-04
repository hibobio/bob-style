import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SearchModule } from './search.module';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `
<b-search [value]="value"
          [label]="label"
          [placeholder]="placeholder"
          [size]="size"
          [hideIcon]="hideIcon"
          (searchChange)="onSearchChange($event)"
          (searchFocus)="onSearchFocus($event)"
          (searchBlur)="onSearchBlur($event)">
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
  [hideIcon] | boolean | hide the search icon | false
  (searchFocus) | EventEmitter<wbr>&lt;string&gt;  | emits on input focus | &nbsp;
  (searchBlur) | EventEmitter<wbr>&lt;DOMFocusEvent&gt;  | emits on input blur | &nbsp;
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
        hideIcon: boolean('hideIcon', false),
        onSearchChange: action('searchChange'),
        onSearchFocus: action('searchFocus'),
        onSearchBlur: action('searchBlur'),
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
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
