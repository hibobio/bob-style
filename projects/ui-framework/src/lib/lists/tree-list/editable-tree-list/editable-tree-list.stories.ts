import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { boolean, select, number } from '@storybook/addon-knobs';
import { EditableTreeListModule } from './editable-tree-list.module';

import { simpleUID } from '../../../services/utils/functional-utils';
import { BTL_KEYMAP_SERVER } from '../tree-list.const';
import {
  HListMock,
  HListMockSimple,
  makeRandomList,
  HListMockSingleGroup,
} from '../tree-list.mock';
import { action } from '@storybook/addon-actions';
import { TreeListModule } from '../tree-list/tree-list.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `<b-editable-tree-list
     [keyMap]="options === 'simple' ? serverKeyMap : null"
     [list]="optionsMap[options]"
     [maxHeightItems]="maxHeightItems"
     [startCollapsed]="startCollapsed"
     [focusOnInit]="focusOnInit"
     (changed)="listOut = $event; changed($event);">
</b-editable-tree-list>`;

const templateForNotes = `<b-editable-tree-list
     [list]="list"
     [keyMap]="keyMap"
     [maxHeightItems]="maxHeightItems"
     [startCollapsed]="startCollapsed"
     [focusOnInit]="focusOnInit"
     (changed)="changed($event);">
</b-editable-tree-list>`;

const storyTemplate = `
<b-story-book-layout [title]="'Editable Tree List'" style="background-color: rgb(245,245,245);">
  <div style="max-width: 500px;">
    ${template}

    <ng-container *ngIf="listOut">
      <h4>Result:</h4>

      <b-tree-list
      [type]="'single'"
      [readonly]="true"
      [list]="listOut || optionsMap[options]"
      [keyMap]="options === 'simple' ? serverKeyMap : null" [startCollapsed]="startCollapsed"></b-tree-list>
    </ng-container>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Editable Tree List

  #### Module
  *EditableTreeListModule*

  ~~~
  ${templateForNotes}
  ~~~

  #### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [list] | TreeListOption[] | options list. <br>**Note:** if your list does not conform to TreeListOption interface, provide \`\`\`[keyMap]\`\`\` to convert it | &nbsp;
  [keyMap] | TreeListKeyMap | keymap to convert [list] to  TreeListOption interface (for tree list options coming from the server, use BTL<sub>-</sub>KEYMAP<sub>-</sub>SERVER const) | BTL<sub>-</sub>KEYMAP<sub>-</sub>DEF
  [maxHeightItems] | number | max number of items before scroll | 15
  [startCollapsed] | boolean | if true, will start with groups closed | true
  [focusOnInit] | boolean | if true will focus first item on init | false
  [disableDragAndDrop] | boolean | what it says | false
  (changed) | EventEmitter<TreeListOption[]> | emits list (same format as was input) on every change | &nbsp;
`;

const mock3 = [
  {
    id: simpleUID('000', 3),
    name: '000',
  },
  {
    id: simpleUID('AAA', 3),
    name: 'AAA',
    children: [
      {
        id: simpleUID('DDD', 3),
        name: 'DDD',
      },
      {
        id: simpleUID('EEE', 3),
        name: 'EEE',
      },
      {
        id: simpleUID('FFF', 3),
        name: 'FFF',
      },
    ],
  },
  {
    id: simpleUID('BBB', 3),
    name: 'BBB',
    children: [
      {
        id: simpleUID('HHH', 3),
        name: 'HHH',
      },
      {
        id: simpleUID('III', 3),
        name: 'III',
      },
      {
        id: simpleUID('JJJ', 3),
        name: 'JJJ',
      },
    ],
  },
  {
    id: simpleUID('CCC', 3),
    name: 'CCC',
    children: [
      {
        id: simpleUID('KKK', 3),
        name: 'KKK',
      },
      {
        id: simpleUID('LLL', 3),
        name: 'LLL',
      },
      {
        id: simpleUID('MMM', 3),
        name: 'MMM',
      },
    ],
  },
  {
    id: simpleUID('111', 3),
    name: '111',
  },
];

const mock2 = [
  {
    id: simpleUID('AAA', 3),
    name: 'AAA',
  },
  {
    id: simpleUID('BBB', 3),
    name: 'BBB',
  },
  {
    id: simpleUID('CCC', 3),
    name: 'CCC',
  },
  {
    id: simpleUID('DDD', 3),
    name: 'DDD',
  },
  {
    id: simpleUID('EEE', 3),
    name: 'EEE',
  },
];

const mock = [
  {
    id: simpleUID('TLV', 3),
    name: 'TLV',
  },
  {
    id: simpleUID('London', 3),
    name: 'London',
  },
  {
    id: simpleUID('NewYork', 3),
    name: 'New York',

    children: [
      {
        id: simpleUID('R&D', 3),
        name: 'R&D',

        children: [
          {
            id: simpleUID('Product', 3),
            name: 'Product',

            children: [
              {
                id: simpleUID('Design', 3),
                name: 'Design',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: simpleUID('UK', 3),
    name: 'UK',
  },
];

story.add(
  'Editable Tree List',
  () => ({
    template: storyTemplate,
    props: {
      listOut: undefined,
      list: mock.slice(),
      serverKeyMap: BTL_KEYMAP_SERVER,

      startCollapsed: boolean('startCollapsed', true, 'Props'),
      maxHeightItems: number('maxHeightItems', 15, {}, 'Props'),
      focusOnInit: boolean('focusOnInit', true, 'Props'),

      optionsMap: {
        'primitive 1': mock,
        'primitive 2': mock2,
        'primitive 3': mock3,
        simple: HListMockSimple,
        random: HListMock,
        big: makeRandomList(5, 65, 4, [8, 15]),
        'single group': HListMockSingleGroup,
      },
      options: select(
        'list',
        [
          'primitive 1',
          'primitive 2',
          'primitive 3',
          'simple',
          'random',
          'big',
          'single group',
        ],
        'primitive 1',
        'Data'
      ),

      changed: action('List change'),
    },
    moduleMetadata: {
      imports: [
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        EditableTreeListModule,
        TreeListModule,
      ],
      entryComponents: [],
    },
  }),
  { notes: { markdown: note } }
);
