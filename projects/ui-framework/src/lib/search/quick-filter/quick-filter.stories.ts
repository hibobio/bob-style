import { storiesOf } from '@storybook/angular';
import { boolean, object, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { cloneDeep } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { QuickFilterModule } from './quick-filter.module';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuickFilterSelectType } from './quick-filter.enum';
import { SelectGroupOption } from '../../form-elements/lists/list.interface';
import { QuickFilterConfig } from './quick-filter.interface';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const textareaStories = storiesOf(
  ComponentGroupType.Search,
  module
).addDecorator(withKnobs);

const template = `
<b-quick-filter-bar [quickFilters]="quickFilters"
                    [showResetFilter]="showResetFilter"
                    (filtersChange)="filtersChange($event)"
                    (resetFilters)="resetFilters()">
  <b-text-button bar-suffix
                 text="More"
                 color="primary">
  </b-text-button>
</b-quick-filter-bar>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Textarea'" style="background-color: rgb(247,247,247);">
<div style="max-width: calc(100vw - 100px);">
  ${template}
</div>
</b-story-book-layout>
`;

const note = `
  ## Quick filters
  #### Module
  *QuickFilterModule*

  #### Properties
  Name | Type | Description | Default Value
  --- | --- | --- | ---
  quickFilters | QuickFilterConfig[] | array of quick filters | none
  filtersChange | QuickFilterBarChangeEvent | Output of quick filter bar change | none
  showResetFilter | boolean | displays reset button | false
  resetFilters | void | event of reset click | none

  ~~~
  ${template}
  ~~~
`;

const groupNun = 3;
const optionsNum = 4;

const optionsMock: SelectGroupOption[] = Array.from(Array(groupNun), (_, i) => {
  return {
    groupName: `Basic Info G${i} - header`,
    options: Array.from(Array(optionsNum), (_, k) => {
      return {
        selected: false,
        value: `Basic Info G${i}_E${k} - option`,
        id: i * optionsNum + k
      };
    })
  };
});

const quickFilters: QuickFilterConfig[] = [
  {
    selectType: QuickFilterSelectType.multiSelect,
    label: 'Departments',
    placeholder: 'No departments',
    key: 'department',
    options: [cloneDeep(optionsMock[0]), cloneDeep(optionsMock[1])]
  },
  {
    selectType: QuickFilterSelectType.multiSelect,
    label: 'Sites',
    placeholder: 'No sites',
    key: 'site',
    options: cloneDeep(optionsMock)
  },
  {
    selectType: QuickFilterSelectType.singleSelect,
    label: 'Employment type',
    placeholder: 'Select employment type',
    key: 'employment',
    showSingleGroupHeader: true,
    options: [cloneDeep(optionsMock[0])]
  },
];

quickFilters[0].options[0].options[1].selected = true;
quickFilters[0].options[1].options[1].selected = true;
quickFilters[2].options[0].options[3].selected = true;

textareaStories.add(
  'Quick filters',
  () => {
    return {
      template: storyTemplate,
      props: {
        showResetFilter: boolean('showResetFilter', false),
        quickFilters: object('quickFilters', quickFilters),
        filtersChange: action('Quick filter bar change'),
        resetFilters: action('Reset Filters click')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          QuickFilterModule,
          ButtonsModule,
          UtilComponentsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
