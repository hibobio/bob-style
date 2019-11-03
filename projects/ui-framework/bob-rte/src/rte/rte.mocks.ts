import {
  mockNames,
  mockAvatar,
  mockText,
  makeArray,
  randomNumber,
  simpleUID,
  SelectGroupOption,
  selectOptionsMock
} from 'bob-style';
import { RteMentionsOption } from './rte.interface';

export const mentionsOptions = mockNames(200).map(
  (name: string): RteMentionsOption => ({
    displayName: name,
    link: 'https://www.google.com/search?q=' + mockText(1),
    avatar: mockAvatar(),
    attributes: {
      'mention-employee-id': simpleUID(),
      class: 'mention-employee'
    }
  })
);

export const placeholderMock: SelectGroupOption[] = selectOptionsMock.concat(
  makeArray(15).map(i => {
    const groupId = simpleUID();

    return {
      groupName: mockText(randomNumber(1, 2)),
      key: groupId,
      options: makeArray(randomNumber(10, 25)).map(i => ({
        id: groupId + '/' + simpleUID(),
        value: mockText(randomNumber(1, 2))
      }))
    };
  })
);
