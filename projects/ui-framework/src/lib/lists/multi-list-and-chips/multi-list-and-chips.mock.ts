import { SelectGroupOption, SelectOption } from '../../lists/list.interface';
import {
  simpleUID,
  randomNumber,
  randomFromArray,
  arrayDifference,
  arrayFlatten,
} from '../../services/utils/functional-utils';
import { mockHobbies, mockNames, mockAvatar } from '../../mock.const';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { IconColor, Icons } from '../../icons/icons.enum';

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
    options: [
      {
        value: 'Crème Brûlée',
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
      ...kidsHobbies.map((hobby, index) => ({
        value: hobby,
        id: simpleUID(),
        selected: index === 1 || mayBeSelected(),
        disabled: index === 1,
      })),
    ],
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

const getSomeValues = () =>
  arrayFlatten(
    MultiListAndChipsOptionsMock.slice(
      randomNumber(1, MultiListAndChipsOptionsMock.length)
    ).map((group) =>
      randomFromArray(group.options, randomNumber(2, maxOpts)).map(
        (o: SelectOption) => o.id
      )
    )
  ).concat(
    randomFromArray(
      MultiListAndAvatarChipsOptionsMock[1].options,
      randomNumber(2, MultiListAndAvatarChipsOptionsMock[1].options.length)
    ).map((o: SelectOption) => o.id)
  );

export const someValues1 = getSomeValues();
export const someValues2 = getSomeValues();
