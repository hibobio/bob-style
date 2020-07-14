import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { MultiSearchModule } from './multi-search.module';
import { mockSearchData } from './multi-search.mock';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { boolean, select } from '@storybook/addon-knobs';
import { FormElementSize } from '../../form-elements/form-elements.enum';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `
<b-multi-search [options]="options"
                [label]="label"
                [placeholder]="placeholder"
                [showAll]="showAll"
                [size]="size"
                (clicked)="onSelect($event)"
                (opened)="onPanelOpen()"
                (closed)="onPanelClose()"
                #multisearch>
</b-multi-search>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi-Search'">
  <div style="max-width: 300px;">
    ${template}
    <button (click)="multisearch.openPanel()" style="display: block; margin: 35px auto 0 0;">openPanel()</button>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Multi-Search Component

  #### Module
  *MultiSearchModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---

  [options] | MultiSearchGroupOption[] | search options data | &nbsp;
  [label] | string | label text | &nbsp;
  [placeholder] | string | placeholder text | &nbsp;
  [size] | FormElementSize | regular height (44px), smaller height (36px) | regular
  [minSearchLength] | number | min text length for options search | 2
  [showAll] | boolean | show all available options | false
  (clicked) | EventEmitter<wbr>&lt;MultiSearchClickedEvent&gt;  | emits on option click | &nbsp;
  (opened) | EventEmitter<wbr>&lt;OverlayRef&gt; | emits on search pabel open | &nbsp;
  (closed) | EventEmitter<wbr>&lt;void&gt; | emits on panel close | &nbsp;

  ~~~
  ${template}
  ~~~
`;
story.add(
  'Multi-Search',
  () => {
    return {
      template: storyTemplate,
      props: {
        options: mockSearchData,
        label: text('label', ''),
        placeholder: text('placeholder', 'Search me'),
        showAll: boolean('showAll', false),
        size: select(
          'size',
          Object.values(FormElementSize),
          FormElementSize.regular
        ),
        onSelect: action('Option selected'),
        onPanelOpen: action('Search panel opened'),
        onPanelClose: action('Search panel closed'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          MultiSearchModule,
          StoryBookLayoutModule,
        ],
        entryComponents: [AvatarImageComponent],
      },
    };
  },
  { notes: { markdown: note } }
);
