import {Icons} from '../icons/icons.enum';
import {mockAvatar, mockDate, mockNames, mockText} from '../mock.const';

export const COMMENT_ITEM = {
  avatar: mockAvatar(),
  name: mockNames(1),
  date: mockDate(),
  content: mockText(5),
  menuConfig: [
    {
      label: 'duplicate',
      action: function(event) { console.log('duplicate', event); }
    },
    {
      label: 'delete',
      action: function (event) { console.log('delete', event); }
    }
  ],
};
export const LONG_COMMENT_ITEM = {
  avatar: mockAvatar(),
  name: mockNames(1),
  date: mockDate(),
  content: mockText(20),
  actionConfig: {
    icon: Icons.delete,
    tooltip: 'Delete',
    action: (event) => console.log('delete', event)
  }
};

export const eventEnterShiftKey = (shiftKey: boolean) => {
  return {shiftKey: shiftKey, keyCode: '13', key: 'Enter', code: 'Enter'};
};
