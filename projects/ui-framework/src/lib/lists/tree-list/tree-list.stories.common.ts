import { select, number, text, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { BTL_KEYMAP_SERVER, BTL_VALUE_SEPARATOR_DEF } from './tree-list.const';
import { SelectType, SelectMode } from '../list.enum';
import {
  HListMockSimple,
  HListMock,
  HListMockSingleGroup,
  makeRandomList,
  HListMockValues,
} from './tree-list.mock';

export const TreeListStoriesCommonProps = (
  footerActions = {
    apply: false,
    cancel: false,
    clear: false,
    reset: false,
  },
  maxHeightItems = 8
) => ({
  serverKeyMap: BTL_KEYMAP_SERVER,
  type: select('type', Object.values(SelectType), SelectType.single, 'Props'),
  mode: select(
    'mode',
    [SelectMode.tree, SelectMode.classic],
    SelectMode.tree,
    'Props'
  ),
  ...(maxHeightItems && {
    maxHeightItems: number('maxHeightItems', maxHeightItems, {}, 'Props'),
  }),
  valueSeparatorChar: text(
    'valueSeparatorChar',
    BTL_VALUE_SEPARATOR_DEF,
    'Props'
  ),
  startCollapsed: boolean('startCollapsed', true, 'Props'),
  readonly: boolean('readonly', false, 'Props'),
  disabled: boolean('disabled', false, 'Props'),
  focusOnInit: boolean('focusOnInit', true, 'Props'),

  // hideSelected: boolean('hideSelected', false, 'viewFilter'),
  // externalSearch: text('externalSearch', '', 'viewFilter'),

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
    // 0,
    HListMockSimple[0].serverId,
    'Data'
  ),
  valueRandom: select('random list value', [0, ...HListMockValues], 0, 'Data'),

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
