import { storiesOf } from '@storybook/angular';
import { ComponentGroupType } from '../../consts';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CompactSearchModule } from './compact-search.module';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `
<b-compact-search [value]="value"
                  [label]="label"
                  [placeholder]="placeholder"
                  [size]="size"
                  (searchChange)="searchChange($event)"
                  (searchFocus)="searchFocus($event)">
</b-compact-search>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Compact Search'">
  <div style="display: flex; align-items: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Compact Search Element

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
  'Compact Search',
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
        imports: [BrowserAnimationsModule, CompactSearchModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
