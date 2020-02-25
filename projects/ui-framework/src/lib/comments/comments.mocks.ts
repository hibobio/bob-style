import { Icons } from '../icons/icons.enum';
import { mockAvatar, mockDate, mockName, mockText } from '../mock.const';

export const COMMENT_ITEM = {
  avatar: mockAvatar(),
  name: mockName(),
  date: mockDate(),
  content: mockText(5) + ' www.a-link.com ' + mockText(5),
  menuConfig: [
    {
      label: 'duplicate',
      action: function(event) {
        console.log('duplicate', event);
      },
    },
    {
      label: 'delete',
      action: function(event) {
        console.log('delete', event);
      },
    },
  ],
};
export const LONG_COMMENT_ITEM = {
  avatar: mockAvatar(),
  name: mockName(),
  date: mockDate(),
  content: mockText(10) + ' email@gmail.com ' + mockText(5),
  actionConfig: {
    icon: Icons.delete,
    tooltip: 'Delete',
    action: event => console.log('delete', event),
  },
};

export const eventEnterShiftKey = (shiftKey: boolean): KeyboardEvent => {
  return ({
    shiftKey: shiftKey,
    meta: shiftKey,
    keyCode: 13,
    key: 'Enter',
    code: 'Enter',
    preventDefault: () => {},
  } as any) as KeyboardEvent;
};
