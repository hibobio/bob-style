import { storiesOf } from '@storybook/angular';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { QuickFilterModule } from './quick-filter.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuickFilterSelectType } from './quick-filter.enum';
import { QuickFilterConfig } from './quick-filter.interface';
import { mockCities, mockDepartments, mockJobs } from '../../mock.const';
import { simpleUID } from '../../services/utils/functional-utils';
import { LinkColor } from '../../indicators/link/link.enum';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { select } from '@storybook/addon-knobs';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `<b-quick-filter-bar [quickFilters]="quickFilters"
                      [size]="size"
                      [showResetFilter]="showResetFilter"
                      (filtersChange)="filtersChange($event)"
                      (resetFilters)="resetFilters()">
    <b-text-button bar-suffix
                  [text]="'More'"
                  [color]="linkColor.primary">
    </b-text-button>
</b-quick-filter-bar>`;

const storyTemplate = `
<b-story-book-layout [title]="'Quick Filter Bar'" style="background-color: rgb(247,247,247);">
<div style="max-width: calc(100vw - 100px);">
  ${template}
</div>
</b-story-book-layout>
`;

const note = `
  ## Quick Filter Bar
  #### Module
  *QuickFilterModule*

  #### Properties
  Name | Type | Description | Default Value
  --- | --- | --- | ---
  [size] | FormElementSize | \`regular\` or \`smaller\` | FormElementSize.regular
  [quickFilters] | QuickFilterConfig[] | array of quick filters | &nbsp;
  [showResetFilter] | boolean | displays reset button | false
  (filtersChange) | EventEmitter<wbr>&lt;QuickFilterChangeEvent&gt; | emits on quick filter bar change | &nbsp;
  (resetFilters) | EventEmitter<wbr>&lt;void&gt; |emits on reset click | &nbsp;

  ~~~
  ${template}
  ~~~

  #### interface: QuickFilterConfig
  Name | Type | Description
  --- | --- | ---
  key | string | filter id
  selectType | QuickFilterSelectType | single or multi
  selectMode? | SelectMode | select mode (classic, radioGroups, checkGroups) - for multi select
  options | SelectGroupOption[] | select options
  optionsDefault | SelectGroupOption[] | default options for 'Reset' action
  value? | any | select value
  showSingleGroupHeader? | boolean | hide or show single group header
  showNoneOption? | boolean | hide 'None' option - for single select
  startWithGroupsCollapsed? | boolean | start with groups open or closed
  label? | string | label (above select)
  placeholder? | string | placeholder (inside select)

  #### interface: QuickFilterChangeEvent
  Name | Type | Description
  --- | --- | ---
  key | string | filter id
  listChange | ListChange | ListChange instance
`;

const optionsFromList = (list, key = 'Stuff') => [
  {
    groupName: key,
    options: list.map((c) => ({ value: c, id: simpleUID() })),
  },
];

const quickFilters: QuickFilterConfig[] = [
  {
    selectType: QuickFilterSelectType.multiSelect,
    label: 'Sites',
    placeholder: 'No sites',
    key: 'site',
    showSingleGroupHeader: false,
    options: optionsFromList(mockCities(), 'All sites'),
  },
  {
    selectType: QuickFilterSelectType.multiSelect,
    label: 'Departments',
    placeholder: 'No departments',
    key: 'department',
    showSingleGroupHeader: false,
    options: optionsFromList(mockDepartments(), 'All departments'),
  },
  {
    selectType: QuickFilterSelectType.singleSelect,
    label: 'Jobs',
    placeholder: 'Select job type',
    key: 'employment',
    showSingleGroupHeader: false,
    options: optionsFromList(mockJobs(), 'All jobs'),
  },
];

story.add(
  'Quick Filter Bar',
  () => {
    return {
      template: storyTemplate,
      props: {
        linkColor: LinkColor,
        size: select(
          'size',
          [FormElementSize.smaller, FormElementSize.regular],
          FormElementSize.regular
        ),
        showResetFilter: boolean('showResetFilter', false),
        quickFilters: object('quickFilters', quickFilters),
        filtersChange: action('Quick filter bar change'),
        resetFilters: action('Reset Filters click'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          QuickFilterModule,
          ButtonsModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
