import { select, number, text, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { BTL_KEYMAP_SERVER } from './tree-list.const';
import { SelectType } from '../list.enum';
import { HListMockSimple, HListMock } from './tree-list.mock';

export const TreeListStoriesCommonProps = () => ({
  serverKeyMap: BTL_KEYMAP_SERVER,
  type: select('type', Object.values(SelectType), SelectType.multi, 'Props'),
  maxHeightItems: number('maxHeightItems', 8, {}, 'Props'),
  valueSeparatorChar: text('valueSeparatorChar', ' / ', 'Props'),
  startCollapsed: boolean('startCollapsed', true, 'Props'),
  showSingleGroupHeader: boolean('showSingleGroupHeader', false, 'Props'),
  readonly: boolean('readonly', false, 'Props'),
  disabled: boolean('disabled', false, 'Props'),

  // value
  // viewFilter

  valueSimple: select(
    'simple list value',
    [
      0,
      HListMockSimple[0].serverId,
      HListMockSimple[1].children[0].serverId,
      HListMockSimple[1].children[1].children[2].serverId,
      HListMockSimple[2].children[1].serverId,
    ],
    0,
    'Value'
  ),
  valueRandom: select('random list value', [], undefined, 'Value'),

  options: select('options', ['simple', 'random'], 'simple', 'Options'),
  listRandom: object('listRandom', HListMock, 'Options'),
  listSimple: object('listSimple', HListMockSimple, 'Options'),

  changed: action('List change'),
  apply: action('List apply'),
  cancel: action('List cancel'),
});
