import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { MultiSearchModule } from './multi-search.module';
import { mockSearchData } from './multi-search.mock';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { boolean, select, number } from '@storybook/addon-knobs';
import { FormElementSize } from '../../form-elements/form-elements.enum';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `
<b-multi-search [options]="options"
                [label]="label"
                [placeholder]="placeholder"
                [minSearchLength]="minSearchLength"
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
     <div class="flx" style="margin: 25px auto 0 0; opacity: 0.5;">
       <button style="padding: 0 3px; margin: 0 5px 0 0; font-size: 9px" (click)="multisearch.focusSearchInput()">focusSearchInput()</button>
      <button style="padding: 0 3px; margin: 0 5px 0 0; font-size: 9px" (click)="multisearch.openPanel()">openPanel()</button>
     </div>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Multi-Search Component

  #### Module
  *MultiSearchModule*

  ~~~
  ${template}
  ~~~

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

  #### Public methods
  Name | Description
  --- | ---
  openPanel() | opens search panel, focuses input
  closePanel() | closes search panel
  focusSearchInput() | focuses input, without opening the panel

  ~~~
interface MultiSearchClickedEvent {
    group: MultiSearchGroupOption;
    option: MultiSearchOption;
}

interface MultiSearchGroupOption extends SelectGroupOption {
    keyMap?: MultiSearchKeyMap;
    key?: string | number; // group ID
    groupName?: string;
    icon?: Icons;
    options?: MultiSearchOption[];
    showItems?: number;
    translation?: {
      showMore?: string;
    };
    menu?: MultiSearchOptionMenuItem[];
    optionClickHandler?: (option: MultiSearchOption) => void;
    menuClickHandler?: (
      option: MultiSearchGroupOption,
      menuItem: MultiSearchOptionMenuItem
    ) => void;
}

interface MultiSearchOption extends SelectOption {
    id?: string | number;
    value?: string;
    label?: string;
    icon?: Icons | Icon;
    menu?: MultiSearchOptionMenuItem[];
}

interface MultiSearchOptionMenuItem extends MenuItem {
    id: string; // menu ID
    key: string; // menu item ID
    data?: MultiSearchOption;
    action?: never;
}

interface MultiSearchKeyMap {
    key?: string;
    groupName?: string;
    options?: string;
    id?: string;
    value?: string;
    label?: string;
}
  ~~~
`;
story.add(
  'Multi-Search',
  () => {
    return {
      template: storyTemplate,
      props: {
        options: mockSearchData,
        minSearchLength: number('minSearchLength', 2),
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
