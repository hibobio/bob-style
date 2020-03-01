import { select, number, text, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { BTL_KEYMAP_SERVER } from './tree-list.const';
import { SelectType } from '../list.enum';
import {
  HListMockSimple,
  HListMock,
  HListMockSingleGroup,
  makeRandomList,
} from './tree-list.mock';

export const TreeListStoriesCommonProps = (
  footerActions = {
    apply: false,
    cancel: false,
    clear: false,
    reset: false,
  }
) => ({
  serverKeyMap: BTL_KEYMAP_SERVER,
  type: select('type', Object.values(SelectType), SelectType.single, 'Props'),
  maxHeightItems: number('maxHeightItems', 8, {}, 'Props'),
  valueSeparatorChar: text('valueSeparatorChar', ' / ', 'Props'),
  startCollapsed: boolean('startCollapsed', true, 'Props'),
  readonly: boolean('readonly', false, 'Props'),
  disabled: boolean('disabled', false, 'Props'),

  hideSelected: boolean('hideSelected', false, 'viewFilter'),
  externalSearch: text('externalSearch', '', 'viewFilter'),

  options: select(
    'list',
    ['simple', 'random', 'big', 'single group'],
    'simple',
    'Data'
  ),

  valueSimple: select(
    'simple list value',
    [
      0,
      HListMockSimple[0].serverId,
      HListMockSimple[1].children[0].serverId,
      HListMockSimple[1].children[1].children[2].serverId,
      HListMockSimple[2].children[1].serverId,
      [
        HListMockSimple[1].children[0].serverId,
        HListMockSimple[1].children[1].children[0].serverId,
        HListMockSimple[2].children[1].children[2].serverId,
        HListMockSimple[2].children[2].serverId,
      ],
    ],
    0,
    'Data'
  ),
  valueRandom: select('random list value', [], undefined, 'Data'),

  footerActions: object('footerActions', footerActions, 'Props'),

  listRandom: HListMock,
  listSimple: HListMockSimple,
  listHuge: makeRandomList(5, 65, 4, [8, 15]),
  listSingleGroup: HListMockSingleGroup,

  changed: action('List change'),
  apply: action('List apply'),
  cancel: action('List cancel'),

  debug: boolean('debug', false, 'Props'),
});
