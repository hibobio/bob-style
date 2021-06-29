import { Icons } from '../icons/icons.enum';
import {
  mockAvatar,
  mockDate,
  mockJobs,
  mockName,
  mockText,
} from '../mock.const';
import { makeArray, randomNumber } from '../services/utils/functional-utils';

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

const makeComment = (
  content: string,
  menu = false,
  action = true,
  role = false
) => ({
  avatar: mockAvatar(),
  name: mockName(),
  date: mockDate(),

  role: role && mockJobs(1),

  content,

  menuConfig: menu && [
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

  actionConfig: action && {
    icon: Icons.delete,
    tooltip: 'Delete',
    action: (event) => console.log('delete', event),
  },
});

export const COMMENT_ITEM = makeComment(
  mockText(5) + ' www.a-link.com ' + mockText(5),
  true,
  false,
  true
);

export const LONG_COMMENT_ITEM = makeComment(
  mockText(10) + ' email@gmail.com ' + mockText(5)
);

export const HTML_COMMENT_TEXT = `Hello! This is a comment with a mention! <span contenteditable="false"><a href="https://www.google.com/search?q=Earum" spellcheck="false" tabindex="-1" mention-employee-id="e6c3f-0194" class="employee-mention" target="_blank" rel="noopener noreferrer">@Laine Ostler</a></span> is the best! Also some link for no reason: www.google.com`;

export const HTML_COMMENT = makeComment(HTML_COMMENT_TEXT);

export const someComments = makeArray(5).map((_) =>
  makeComment(mockText(randomNumber(3, 7)))
);
