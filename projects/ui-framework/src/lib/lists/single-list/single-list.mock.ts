import { SelectGroupOption } from '../list.interface';
import { makeArray, simpleUID } from '../../services/utils/functional-utils';
import { mockAvatar, mockNames, mockJobs } from '../../mock.const';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { randomNumber } from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';

export const selectSome = (options: SelectGroupOption[]): SelectGroupOption[] =>
  cloneDeep(options).map(group => ({
    ...group,
    options: group.options.map(option => ({
      ...option,
      selected: randomNumber() > 80,
      disabled: randomNumber() > 90,
    })),
  }));

const groupNum = 6;
const optionsNum = 4;

const groupNames: string[] = mockJobs(30);

export const optionsMock: SelectGroupOption[] = makeArray(groupNum).map(
  (group, index) => {
    const groupId = simpleUID(
      groupNames[index]
        .replace(/\s+/g, '')
        .slice(0, 8)
        .toUpperCase() + '-',
      3
    );

    return {
      groupName: groupNames[index],
      key: groupId,

      options: makeArray(optionsNum).map(option => {
        const optVal = mockNames(1);
        const optId = simpleUID(
          groupId +
            '/' +
            optVal
              .replace(/\s+/g, '')
              .slice(0, 8)
              .toUpperCase() +
            '-',
          3
        );

        return {
          id: optId,
          value: optVal,
          selected: false,
          disabled: false,
          prefixComponent: {
            component: AvatarComponent,
            attributes: {
              imageSource: mockAvatar(),
            },
          },
        };
      }),
    };
  }
);
