import { cloneDeep } from 'lodash';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import {
  boolean,
  number,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { RadioButtonModule } from '../../form-elements/radio-button/radio-button.module';
import { Icons } from '../../icons/icons.enum';
// @ts-ignore: md file and not a module
import listInterfaceDoc from '../../lists/list.interface.md';
// @ts-ignore: md file and not a module
import listSelectsPropsDoc from '../../lists/lists-selects.properties.md';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { selectSome } from '../single-list/single-list.mock';
import {
  MultiListAndAvatarChipsOptionsMock,
  MultiListAndChipsOptionsMock,
  someValues1,
  someValues2,
} from './multi-list-and-chips.mock';
import { MultiListAndChipsModule } from './multi-list-and-chips.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const listOpts = cloneDeep(MultiListAndChipsOptionsMock);
const avatarListOpts = cloneDeep(MultiListAndAvatarChipsOptionsMock);

const listOptsDef = selectSome(MultiListAndChipsOptionsMock);
const avatarListOptsDef = selectSome(MultiListAndChipsOptionsMock);

const listOpts$ = of(listOpts).pipe(delay(1000));
const avatarListOpts$ = of(avatarListOpts).pipe(delay(1000));

const template = `<b-multi-list-and-chips
        [options]="(options === 2 ? avatarListOpts$ : listOpts$) | async"
        [optionsDefault]="options === 2 ? avatarListOptsDef : listOptsDef"
        [value]="value === 1 ? someValues1 : value === 2 ? someValues2 : value === 3 ? [] : undefined"
        [listLabel]="listLabel"
        [chipsLabel]="chipsLabel"
        [showSingleGroupHeader]="showSingleGroupHeader"
        [startWithGroupsCollapsed]="options === 2 ? false : startWithGroupsCollapsed"
        [min]="min"
        [max]="max"
        [maxHeight]="maxHeight"
        [emptyState]="emptyStateConfig"
        [disabled]="disabled"
        (selectChange)="onSelectChange($event)"
        (changed)="onChange($event)">
  </b-multi-list-and-chips>`;

const templateForNotes = `<b-multi-list-and-chips
      [options]="options"
      [value]="selectedIDs"
      [listLabel]="listLabel"
      [chipsLabel]="chipsLabel"
      [showSingleGroupHeader]="showSingleGroupHeader"
      [startWithGroupsCollapsed]="startWithGroupsCollapsed"
      [min]="min"
      [max]="max"
      [emptyState]="emptyStateConfig"
      (selectChange)="onSelectChange($event)"
      (changed)="onChange($event)">
</b-multi-list-and-chips>`;

const note = `
  ## Multi List And Chips

  #### Module
  *MultiListAndChipsModule*

  ~~~
  ${templateForNotes}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [listLabel] | string | label text for the Multi List component | &nbsp;
  [chipsLabel] | string | label text for the Chips List component | &nbsp;
  [emptyState] | EmptyStateConfig | config for the EmptyStateComponent to\
   be displayed when no options are selected | &nbsp;
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | emits on list change | &nbsp;

  ${listSelectsPropsDoc}

  ${listInterfaceDoc}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi List And Chips'" style=" background: rgb(247,247,247);">
  <div style="max-width:900px;">
    ${template}

    <br><br>
    <b-radio-button [radioConfig]="[
        {id: 1, label: 'Hobbies'},
        {id: 2, label: 'People'}
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
    listLabel: text('chipsLabel', 'Select fields', 'Props'),
    chipsLabel: text('listLabel', 'Selected fields', 'Props'),
    showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
    startWithGroupsCollapsed: boolean(
      'startWithGroupsCollapsed',
      true,
      'Props'
    ),
    min: number('min', 0, {}, 'Props'),
    max: number('max', 0, {}, 'Props'),

    maxHeight: number('maxHeight', 0, {}, 'Props'),

    disabled: boolean('disabled', false, 'Props'),

    value: select('value', [0, 1, 2, 3], 0, 'Data'),
    someValues1: someValues1,
    someValues2: someValues2,

    listOpts: object('listOpts', listOpts, 'Data'),
    avatarListOpts: object('avatarListOpts', avatarListOpts, 'Data'),

    listOptsDef: listOptsDef,
    avatarListOptsDef: avatarListOptsDef,

    listOpts$: listOpts$,
    avatarListOpts$: avatarListOpts$,

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
  },
  moduleMetadata: {
    imports: [
      MultiListAndChipsModule,
      StoryBookLayoutModule,
      BrowserAnimationsModule,
      RadioButtonModule,
    ],
  },
});

story.add('Multi List And Chips', toAdd, {
  notes: { markdown: note },
  knobs: STORIES_KNOBS_OPTIONS
});
