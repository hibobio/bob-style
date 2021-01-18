import { SelectGroupOption } from '../list.interface';
import { makeArray, simpleUID } from '../../services/utils/functional-utils';
import { mockAvatar, mockName, mockJobs, mockText } from '../../mock.const';
import { randomNumber } from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { IconColor, Icons } from '../../icons/icons.enum';

const mayBeSelected = (perc = 80) => {
  return randomNumber() > perc;
};

export const selectSome = (options: SelectGroupOption[]): SelectGroupOption[] =>
  cloneDeep(options).map((group: SelectGroupOption) => ({
    ...group,
    options: group.options.map((option, index) => ({
      ...option,
      selected: mayBeSelected(80),
      disabled: index !== 0 && mayBeSelected(90),
    })),
  }));

export const selectAll = (
  options: SelectGroupOption[],
  state = true
): SelectGroupOption[] =>
  cloneDeep(options).map((group: SelectGroupOption) => ({
    ...group,
    options: group.options.map((option, index) => ({
      ...option,
      selected: state,
      disabled: false,
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

  {
    groupName: 'Roles',
    key: 'roles',
    options: [
      {
        value: 'Crème Brulée',
        id: simpleUID(),
        selected: mayBeSelected(85),
        disabled: false,
        prefixComponent: {
          component: AvatarImageComponent,
          attributes: {
            icon: {
              icon: Icons.cake,
              color: IconColor.dark,
            },
          },
        },
      },
      {
        value: 'Manager',
        id: simpleUID(),
        selected: mayBeSelected(85),
        disabled: false,
        prefixComponent: {
          component: AvatarImageComponent,
          attributes: {
            icon: {
              icon: Icons.person_manager,
              color: IconColor.dark,
            },
          },
        },
      },
      {
        value: 'Reports To',
        id: simpleUID(),
        selected: mayBeSelected(85),
        disabled: false,
        prefixComponent: {
          component: AvatarImageComponent,
          attributes: {
            icon: {
              icon: Icons.person_reports,
              color: IconColor.dark,
            },
          },
        },
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

      options: makeArray(optionsNum).map((_, i) => {
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
          description: mayBeSelected(35) ? mockText(10) : null,
        };
      }),

      someGroupData: simpleUID(),
    };
  }),
  {
    groupName: 'Group with empty options',
    options: [],
  },
  {
    groupName: 'Level',
    options: [
      {
        id: 'Level',
        value: 'Level',
      },
    ],
  },
];
