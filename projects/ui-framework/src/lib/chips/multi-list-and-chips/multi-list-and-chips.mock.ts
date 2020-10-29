import { SelectGroupOption, SelectOption } from '../../lists/list.interface';
import {
  simpleUID,
  randomNumber,
  randomFromArray,
  arrayDifference,
} from '../../services/utils/functional-utils';
import { mockHobbies, mockNames, mockAvatar } from '../../mock.const';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { Icons } from '../../icons/icons.enum';

const maxOpts = 10;

const oldPeopleHobbies = randomFromArray(mockHobbies(), maxOpts);
const couplesHobbies = randomFromArray(
  arrayDifference(mockHobbies(), oldPeopleHobbies),
  maxOpts
);
const kidsHobbies = randomFromArray(
  arrayDifference(mockHobbies(), oldPeopleHobbies.concat(couplesHobbies)),
  maxOpts
);

const mayBeSelected = (perc = 80) => {
  return randomNumber() > perc;
};

export const MultiListAndChipsOptionsMock: SelectGroupOption[] = [
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
    groupName: 'For kids',
    options: kidsHobbies.map((hobby, index) => ({
      value: hobby,
      id: simpleUID(),
      selected: index === 1 || mayBeSelected(),
      disabled: index === 1,
    })),
  },
  {
    groupName: 'For couples',
    options: couplesHobbies.map((hobby, index) => ({
      value: hobby,
      id: simpleUID(),
      selected: mayBeSelected(),
      disabled: index === 2,
    })),
  },
  {
    groupName: 'For old people',
    options: oldPeopleHobbies.map((hobby) => ({
      value: hobby,
      id: simpleUID(),
      selected: mayBeSelected(),
    })),
  },
  {
    groupName: 'Group with empty options',
    options: [],
  },
];

export const MultiListAndAvatarChipsOptionsMock: SelectGroupOption[] = [
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
    groupName: 'People',
    options: [
      {
        value: 'Manager',
        id: simpleUID(),
        selected: mayBeSelected(85),
        disabled: false,
        prefixComponent: {
          component: AvatarImageComponent,
          attributes: {
            icon: Icons.person_manager,
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
            icon: Icons.person_reports,
          },
        },
      },
      ...mockNames(30).map(
        (person: string, index: number): SelectOption => ({
          value: person,
          id: simpleUID(),
          selected: index < 15 && mayBeSelected(85),
          disabled: false,
          prefixComponent: {
            component: AvatarImageComponent,
            attributes: {
              imageSource: mockAvatar(),
            },
          },
        })
      ),
    ],
  },
];
