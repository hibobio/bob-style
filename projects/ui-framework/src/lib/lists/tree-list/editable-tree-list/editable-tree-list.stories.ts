import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
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

const template = `
<b-editable-tree-list

    [menuLoc]="menuLoc === 'dot' ? 2 : 3"
    [menuHov]="menuHov === 'item hover' ? 2 : 1"

     [keyMap]="options === 'simple' || options === 'primitive' ? serverKeyMap : null"

      [list]="options === 'simple' ? listSimple : options === 'primitive' ? list : options === 'single group' ? listSingleGroup : options === 'big' ? listHuge : listRandom"


      [startCollapsed]="startCollapsed"
      [maxHeightItems]="maxHeightItems"
      (changed)="listOut = $event; changed($event);"
     [debug]="debug">
</b-editable-tree-list>

`;

const storyTemplate = `
<b-story-book-layout [title]="'Editable Tree List'" style="background-color: rgb(245,245,245);">
  <div style="max-width: 500px;">
    ${template}

    <h4>Result:</h4>

    <b-tree-list [type]="'single'" [readonly]="true" [list]="listOut"
    [keyMap]="options === 'simple' || options === 'primitive' ? serverKeyMap : null" [startCollapsed]="startCollapsed" [debug]="debug"></b-tree-list>

  </div>
</b-story-book-layout>
`;

const note = `
  ## Editable Tree List

  #### Module
  *EditableTreeListModule*


`;

const mock3 = [
  {
    serverId: simpleUID('000-', 3),
    value: '000',
  },
  {
    serverId: simpleUID('aaa-', 3),
    value: 'AAA',
    children: [
      {
        serverId: simpleUID('ddd-', 3),
        value: 'DDD',
      },
      {
        serverId: simpleUID('eee-', 3),
        value: 'EEE',
      },
      {
        serverId: simpleUID('fff-', 3),
        value: 'FFF',
      },
    ],
  },
  {
    serverId: simpleUID('bbb-', 3),
    value: 'BBB',
    children: [
      {
        serverId: simpleUID('hhh-', 3),
        value: 'HHH',
      },
      {
        serverId: simpleUID('iii-', 3),
        value: 'III',
      },
      {
        serverId: simpleUID('jjj-', 3),
        value: 'JJJ',
      },
    ],
  },
  {
    serverId: simpleUID('ccc-', 3),
    value: 'CCC',
    children: [
      {
        serverId: simpleUID('kkk-', 3),
        value: 'KKK',
      },
      {
        serverId: simpleUID('lll-', 3),
        value: 'LLL',
      },
      {
        serverId: simpleUID('mmm-', 3),
        value: 'MMM',
      },
    ],
  },
  {
    serverId: simpleUID('111-', 3),
    value: '111',
  },
];

const mock2 = [
  {
    serverId: simpleUID('AAA-', 3),
    value: 'AAA',
  },
  {
    serverId: simpleUID('BBB-', 3),
    value: 'BBB',
  },
  {
    serverId: simpleUID('CCC-', 3),
    value: 'CCC',
  },
  {
    serverId: simpleUID('DDD-', 3),
    value: 'DDD',
  },
  {
    serverId: simpleUID('EEE-', 3),
    value: 'EEE',
  },
];

const mock = [
  {
    serverId: simpleUID('TLV-', 3),
    value: 'TLV',
  },
  {
    serverId: simpleUID('London-', 3),
    value: 'London',
  },
  {
    serverId: simpleUID('NewYork-', 3),
    value: 'New York',

    children: [
      {
        serverId: simpleUID('R&D-', 3),
        value: 'R&D',

        children: [
          {
            serverId: simpleUID('Product-', 3),
            value: 'Product',

            children: [
              {
                serverId: simpleUID('Design-', 3),
                value: 'Design',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    serverId: simpleUID('UK-', 3),
    value: 'UK',
  },
];

story.add(
  'Editable Tree List',
  () => ({
    template: storyTemplate,
    props: {
      listOut: mock.slice(),
      list: mock.slice(),
      serverKeyMap: BTL_KEYMAP_SERVER,

      menuLoc: select('menu location', ['dot', 'line'], 'line', 'Props'),

      menuHov: select(
        'show menu on',
        ['item hover', 'menu hover'],
        'item hover',
        'Props'
      ),

      startCollapsed: boolean('startCollapsed', true, 'Props'),
      maxHeightItems: number('maxHeightItems', 12, {}, 'Props'),

      debug: boolean('debug', false, 'Props'),

      options: select(
        'list',
        ['primitive', 'simple', 'random', 'big', 'single group'],
        'primitive',
        'Data'
      ),
      listRandom: HListMock,
      listSimple: HListMockSimple,
      listHuge: makeRandomList(5, 65, 4, [8, 15]),
      listSingleGroup: HListMockSingleGroup,

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
