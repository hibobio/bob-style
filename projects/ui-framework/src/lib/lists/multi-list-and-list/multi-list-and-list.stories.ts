import { storiesOf } from '@storybook/angular';
import {
  boolean,
  object,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  listViewConfigMock,
  MultiListAndListOptionsMock,
  MultiListAndListPepopleOptionsMock,
  MultiListAndListTimeOffOptionsMock,
} from './multi-list-and-list.mock';
import { action } from '@storybook/addon-actions';
import { RadioButtonModule } from '../../form-elements/radio-button/radio-button.module';
import { Icons } from '../../icons/icons.enum';
import { number } from '@storybook/addon-knobs';

// @ts-ignore: md file and not a module
import listInterfaceDoc from '../../lists/list.interface.md';
// @ts-ignore: md file and not a module
import listSelectsPropsDoc from '../../lists/lists-selects.properties.md';
import { MultiListModule } from '../multi-list/multi-list.module';
import { EmptyStateModule } from '../../indicators/empty-state/empty-state.module';
import { TranslateModule } from '@ngx-translate/core';
import { MultiListAndListModule } from './multi-list-and-list.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);
const listViewConfig = listViewConfigMock;
const listOpts = MultiListAndListOptionsMock;
const policies = MultiListAndListTimeOffOptionsMock;
const avatarListOpts = MultiListAndListPepopleOptionsMock;

const template = `<b-multi-list-and-list
        [options]="options === 2 ? policies : listOpts"
        [listLabel]="listLabel"
        [selectedLabel]="selectedLabel"
        [listViewConfig]="listViewConfig"
        [showSingleGroupHeader]="showSingleGroupHeader"
        [startWithGroupsCollapsed]="options === 2 ? false : startWithGroupsCollapsed"
        [min]="min"
        [max]="max"
        [maxHeight]="maxHeight"
        (selectChange)="onSelectChange($event)"
        (changed)="onChange($event)"
        (menuAction)="onEmitMenuAction($event)">
  </b-multi-list-and-list>`;

const templateForNotes = `<b-multi-list-and-list
      [options]="options"
      [listLabel]="listLabel"
      [selectedLabel]="selectedLabel"
      [listViewConfig]="listViewConfig"
      [showSingleGroupHeader]="showSingleGroupHeader"
      [startWithGroupsCollapsed]="startWithGroupsCollapsed"
      [min]="min"
      [max]="max"
      (menuAction)="onEmitMenuAction($event)"
      (changed)="onChange($event)"
      (selectChange)="onSelectChange($event)">
</b-multi-list-and-list>`;

const note = `
  ## Multi List And List

  #### Module
  *MultiListAndListModule*

  ~~~
  ${templateForNotes}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [listLabel] | string | label text for the Multi List component | &nbsp;
  [listViewConfig] | ListViewConfig | init state config | { rowStartIcon: Icons.doc, rowAction: { icon: Icons.delete,} |
  [selectedLabel] | string | label text for the right List | &nbsp;
  [emptyState] | EmptyStateConfig | config for the EmptyStateComponent to\
   be displayed when no options are selected | &nbsp;
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | emits on list change | &nbsp;
  (changed) | EventEmitter<wbr>&lt;(string|number)[]&gt; | emits selected IDs (value)
  (EmitMenuAction) | EventEmitter<wbr>&lt;{ action: string;<wbr> item: string; }&gt; | emits list option id + menu item id - on menu click | &nbsp;

  ${listSelectsPropsDoc}

  ${listInterfaceDoc}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi List And List'" style=" background: rgb(247,247,247);">
  <div style="max-width:900px;">
    ${template}

    <br><br>
    <b-radio-button [radioConfig]="[
        {id: 1, label: 'Hobbies'},
        {id: 2, label: 'Policies'}
      ]"
      [value]="{id: 1}"
      (radioChange)="options = $event">
    </b-radio-button>
  </div>
</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    listLabel: text('listLabel', 'Select fields', 'Props'),
    selectedLabel: text('selectedLabel', 'Selected fields', 'Props'),
    listViewConfig: object('listViewConfig', listViewConfig, 'Props'),
    showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
    startWithGroupsCollapsed: boolean(
      'startWithGroupsCollapsed',
      true,
      'Props'
    ),
    min: number('min', 0, {}, 'Props'),

    maxHeight: number('maxHeight', 0, {}, 'Props'),

    listOpts: object('listOpts', listOpts, 'Data'),
    avatarListOpts: object('avatarListOpts', avatarListOpts, 'Data'),
    policies: object('policies', policies, 'Data'),
    emptyStateConfig: object(
      'emptyStateConfig',
      {
        text:
          'Choose a life. Choose a job. Choose a career. Choose a family. Choose a fucking big television.',
        icon: Icons.toDos_link,
      },
      'Props'
    ),

    onSelectChange: action('ListChange'),
    onChange: action('Selected IDs changed'),
    onEmitMenuAction: action('EmitMenuAction'),
  },
  moduleMetadata: {
    imports: [
      StoryBookLayoutModule,
      BrowserAnimationsModule,
      MultiListAndListModule,
      RadioButtonModule,
      MultiListModule,
      EmptyStateModule,
      TranslateModule,
    ],
  },
});

story.add('Multi List And List', toAdd, { notes: { markdown: note } });
