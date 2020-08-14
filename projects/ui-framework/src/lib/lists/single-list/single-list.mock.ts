import { SelectGroupOption } from '../list.interface';
import { makeArray, simpleUID } from '../../services/utils/functional-utils';
import { mockAvatar, mockName, mockJobs } from '../../mock.const';
import { randomNumber } from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';

export const selectSome = (options: SelectGroupOption[]): SelectGroupOption[] =>
  cloneDeep(options).map((group: SelectGroupOption) => ({
    ...group,
    options: group.options.map((option, index) => ({
      ...option,
      selected: randomNumber() > 80,
      disabled: index !== 0 && randomNumber() > 90,
    })),
  }));

const groupNum = 8;
const optionsNum = 4;

const groupNames: string[] = mockJobs(30);

export const optionsMock: SelectGroupOption[] = [
  {
    groupName: 'All',
    key: 'all',
    options: [
      {
        id: 'all',
        value: 'All',
        exclusive: true,
      },
    ],
  },
  ...makeArray(groupNum).map((group, index) => {
    const groupId = simpleUID(
      groupNames[index].replace(/\s+/g, '').slice(0, 8).toUpperCase() + '-',
      3
    );

    return {
      groupName: groupNames[index],
      key: groupId,

      options: makeArray(optionsNum).map((_, index) => {
        const optVal = mockName();
        const optId = simpleUID(
          groupId +
            '/' +
            optVal.replace(/\s+/g, '').slice(0, 8).toUpperCase() +
            '-',
          3
        );

        return {
          id: optId,
          value: optVal,
          selected: false,
          disabled: false,
          prefixComponent: {
            component: AvatarImageComponent,
            attributes: {
              imageSource: mockAvatar(),
            },
          },
          someOptionData: simpleUID(),
        };
      }),

      someGroupData: simpleUID(),
    };
  }),
  {
    groupName: 'Group with empty options',
    options: [],
  },
];
