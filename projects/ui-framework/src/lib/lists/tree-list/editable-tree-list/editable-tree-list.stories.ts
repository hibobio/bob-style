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

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-editable-tree-list
[menuLoc]="menuLoc === 'expand' ? 1 : menuLoc === 'dot' ? 2 : 3"
[menuHov]="menuHov === 'item hover' ? 2 : 1"
     [keyMap]="options === 'simple' ? serverKeyMap : null"
      [list]="options === 'simple' ? listSimple : options === 'single group' ? listSingleGroup : options === 'big' ? listHuge : listRandom"
     [debug]="debug">
</b-editable-tree-list>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Editable Tree List'" style="background-color: rgb(245,245,245);">
  <div style="max-width: 500px;">
    ${template}
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
];

story.add(
  'Editable Tree List',
  () => ({
    template: storyTemplate,
    props: {
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

      debug: boolean('debug', true, 'Props'),

      options: select(
        'list',
        ['simple', 'random', 'big', 'single group'],
        'simple',
        'Data'
      ),
      listRandom: HListMock,
      listSimple: HListMockSimple,
      listHuge: makeRandomList(5, 65, 4, [8, 15]),
      listSingleGroup: HListMockSingleGroup,
    },
    moduleMetadata: {
      imports: [
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        EditableTreeListModule,
      ],
      entryComponents: [],
    },
  }),
  { notes: { markdown: note } }
);
