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

export const eeDetailsOptions = [
  {
    groupName: 'Personal',
    options: [
      {
        value: 'Prefix title *',
        id: '/personal/honorific',
        selected: false,
        disabled: false,
      },
      {
        value: 'Pronouns',
        id: '/personal/pronouns',
        selected: false,
        disabled: false,
      },
      {
        value: 'Birth date',
        id: '/personal/birthDate',
        selected: false,
        disabled: false,
      },
      {
        value: 'Nationality',
        id: '/personal/nationality',
        selected: false,
        disabled: false,
      },
      {
        value: 'tree list 100',
        id: '/personal/custom/tree list 1_8UZcS',
        selected: false,
        disabled: false,
      },
      {
        value: 'sdasd',
        id: '/personal/custom/sdasd_WFg6F',
        selected: false,
        disabled: false,
      },
      {
        value: 'New Field',
        id: '/personal/custom/field_1599575906060',
        selected: false,
        disabled: false,
      },
    ],
  },
  {
    groupName: 'About',
    options: [
      {
        value: 'About',
        id: '/about/about',
        selected: false,
        disabled: false,
      },
      {
        value: 'Social - Facebook',
        id: '/about/socialData/facebook',
        selected: false,
        disabled: false,
      },
      {
        value: 'Social - Twitter',
        id: '/about/socialData/twitter',
        selected: false,
        disabled: false,
      },
      {
        value: 'Social - LinkedIn',
        id: '/about/socialData/linkedin',
        selected: false,
        disabled: false,
      },
      {
        value: 'Hobbies',
        id: '/about/hobbies',
        selected: false,
        disabled: false,
      },
      {
        value: 'Superpowers',
        id: '/about/superpowers',
        selected: false,
        disabled: false,
      },
      {
        value: 'Food preferences',
        id: '/about/foodPreferences',
        selected: false,
        disabled: false,
      },
      {
        value: 'Tree list 2',
        id: '/about/custom/scsc_PomB4',
        selected: false,
        disabled: false,
      },
    ],
  },
  {
    groupName: 'Basic info',
    options: [
      {
        value: 'First name *',
        id: '/root/firstName',
        selected: true,
        disabled: true,
      },
      {
        value: 'Last name *',
        id: '/root/surname',
        selected: true,
        disabled: true,
      },
      {
        value: 'Middle name',
        id: '/root/secondName',
        selected: false,
        disabled: false,
      },
      {
        value: 'Display name',
        id: '/root/displayName',
        selected: false,
        disabled: false,
      },
    ],
  },
  {
    groupName: 'Home',
    options: [
      {
        value: 'Marital status',
        id: '/home/familyStatus',
        selected: false,
        disabled: false,
      },
      {
        value: 'Gender',
        id: '/home/legalGender',
        selected: false,
        disabled: false,
      },
      {
        value: `Spouse's first name`,
        id: '/home/spouse/firstName',
        selected: false,
        disabled: false,
      },
      {
        value: `Spouse's last name`,
        id: '/home/spouse/surname',
        selected: false,
        disabled: false,
      },
      {
        value: `Spouse's date of birth`,
        id: '/home/spouse/birthDate',
        selected: false,
        disabled: false,
      },
      {
        value: `Spouse's gender`,
        id: '/home/spouse/gender',
        selected: false,
        disabled: false,
      },
      {
        value: 'Children',
        id: '/home/kids',
        selected: false,
      },
    ],
  },
  {
    groupName: 'Work contact details',
    options: [
      {
        value: 'Work mobile',
        id: '/work/workMobile',
        selected: false,
        disabled: false,
      },
      {
        value: 'Work phone',
        id: '/work/workPhone',
        selected: false,
        disabled: false,
      },
      {
        value: 'Slack username',
        id: '/personal/communication/slackUsername',
        selected: false,
        disabled: false,
      },
      {
        value: 'Skype username',
        id: '/personal/communication/skypeUsername',
        selected: false,
        disabled: false,
      },
    ],
  },
  {
    groupName: 'Identification',
    options: [
      {
        value: 'Passport number',
        id: '/financial/passportNumber',
        selected: false,
        disabled: false,
      },
      {
        value: 'National ID',
        id: '/financial/identificationNumber',
        selected: false,
        disabled: false,
      },
      {
        value: 'NI number',
        id: '/payroll/nin',
        selected: false,
        disabled: false,
      },
      {
        value: 'SSN *',
        id: '/identification/ssn',
        selected: false,
        disabled: false,
      },
    ],
  },
  {
    groupName: 'Training',
    options: [
      {
        value: 'training test',
        id: '/training/custom/training test',
        selected: false,
        disabled: false,
      },
      {
        value: 'training test 2 *',
        id: '/training/custom/training test 2_liRzY',
        selected: false,
        disabled: false,
      },
      {
        value: 'Training Info',
        id: '/training',
        selected: false,
      },
    ],
  },
  {
    groupName: 'Work',
    options: [
      {
        value: 'work tree list',
        id: '/work/custom/work tree list_QxEWr',
        selected: false,
        disabled: false,
      },
      {
        value: 'employee ref',
        id: '/work/custom/employee ref_2CqzH',
        selected: false,
        disabled: false,
      },
      {
        value: 'Job title',
        id: '/work/custom/field_1605092278629',
        selected: false,
        disabled: false,
      },
    ],
  },
  {
    groupName: 'Address',
    options: [
      {
        value: 'Address *',
        id: '/address',
        selected: false,
      },
    ],
  },
];
