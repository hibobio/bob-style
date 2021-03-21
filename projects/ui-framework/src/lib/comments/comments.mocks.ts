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
      action: function (event) {
        console.log('duplicate', event);
      },
    },
    {
      label: 'delete',
      action: function (event) {
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
    action: (event) => console.log('delete', event),
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

export const HTML_COMMENT_TEXT = `Hello! This is a comment with a mention! <span contenteditable="false"><a href="https://www.google.com/search?q=Earum" spellcheck="false" tabindex="-1" mention-employee-id="e6c3f-0194" class="employee-mention" target="_blank" rel="noopener noreferrer">@Laine Ostler</a></span> is the best! Also some link for no reason: www.google.com`;

export const HTML_COMMENT = {
  avatar: mockAvatar(),
  name: mockName(),
  date: mockDate(),
  content: HTML_COMMENT_TEXT,
  actionConfig: {
    icon: Icons.delete,
    tooltip: 'Delete',
    action: (event) => console.log('delete', event),
  },
};
