import {
  mockNames,
  mockAvatar,
  mockText,
  makeArray,
  randomNumber,
  simpleUID,
  SelectGroupOption,
  selectOptionsMock,
} from 'bob-style';
import { RteMentionsOption } from './rte.interface';

const separator = '##%%';

export const mentionsOptions = mockNames(200).map(
  (name: string): RteMentionsOption => ({
    displayName: name,
    link: 'https://www.google.com/search?q=' + mockText(1),
    avatar: mockAvatar(),
    attributes: {
      'mention-employee-id': simpleUID(),
      class: 'employee-mention',
    },
  })
);

export const placeholderMock: SelectGroupOption[] = selectOptionsMock
  .map(group => ({
    ...group,
    options: group.options.map(option => ({
      ...option,
      id: (option.id as string).replace('/', separator),
    })),
  }))
  .concat(
    makeArray(15).map(i => {
      const groupId = simpleUID();
      return {
        groupName: mockText(randomNumber(1, 2)),
        key: groupId,
        options: makeArray(randomNumber(10, 25)).map(i => ({
          id: groupId + separator + simpleUID(),
          value: mockText(randomNumber(1, 2)),
        })),
      };
    })
  );
