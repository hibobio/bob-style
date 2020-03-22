import { storiesOf } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { boolean, select } from '@storybook/addon-knobs';
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

    [menuLoc]="menuLoc === 'expand' ? 1 : menuLoc === 'dot' ? 2 : 3"
    [menuHov]="menuHov === 'item hover' ? 2 : 1"

     [keyMap]="options === 'simple' || options === 'primitive' ? serverKeyMap : null"

      [list]="options === 'simple' ? listSimple : options === 'primitive' ? list : options === 'single group' ? listSingleGroup : options === 'big' ? listHuge : listRandom"

      [startCollapsed]="startCollapsed"
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

const mock = [
  {
    serverId: simpleUID(),
    value: 'TLV',
  },
  {
    serverId: simpleUID(),
    value: 'London',
  },
  {
    serverId: simpleUID(),
    value: 'New York',

    children: [
      {
        serverId: simpleUID(),
        value: 'R&D',

        children: [
          {
            serverId: simpleUID(),
            value: 'Product',

            children: [
              {
                serverId: simpleUID(),
                value: 'Design',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    serverId: simpleUID(),
    value: 'UK',
  },
];

story.add(
  'Editable Tree List',
  () => ({
    template: storyTemplate,
    props: {
      listOut: [],
      list: mock,
      serverKeyMap: BTL_KEYMAP_SERVER,

      menuLoc: select(
        'menu location',
        ['expand', 'dot', 'line'],
        'line',
        'Props'
      ),

      menuHov: select(
        'show menu on',
        ['item hover', 'menu hover'],
        'item hover',
        'Props'
      ),

      startCollapsed: boolean('startCollapsed', true, 'Props'),

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
