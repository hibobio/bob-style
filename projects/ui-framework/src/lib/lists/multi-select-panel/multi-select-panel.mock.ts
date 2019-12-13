import { SelectGroupOption } from '../list.interface';
import { randomNumber } from '../../services/utils/functional-utils';

export const selectOptionsMock: SelectGroupOption[] = [
  {
    groupName: 'Basic info',
    key: 'root',
    options: [
      {
        value: 'First name',
        id: 'root/firstName',
        selected: false,
      },
      {
        value: 'Last name',
        id: 'root/lastName',
        selected: false,
      },
      {
        value: 'Full name',
        id: 'root/fullName',
        selected: false,
      },
      {
        value: 'Display name',
        id: 'root/displayName',
        selected: false,
      },
    ],
  },
  {
    groupName: 'Personal',
    key: 'personal',
    options: [
      {
        value: 'Personal email',
        id: 'personal/personalEmail',
        selected: false,
      },
      {
        value: 'Personal phone',
        id: 'personal/personalPhone',
        selected: false,
      },
      {
        value: 'Personal mobile',
        id: 'personal/personalMobile',
        selected: false,
      },
    ],
  },
  {
    groupName: 'Work',
    key: 'work',
    options: [
      {
        value: 'Title',
        id: 'work/title',
        selected: false,
      },
      {
        value: 'Team',
        id: 'work/team',
        selected: false,
      },
      {
        value: 'Reports to',
        id: 'work/reportsTo',
        selected: false,
      },
      {
        value: 'Start date',
        id: 'work/startDate',
        selected: false,
      },
      {
        value: 'Site',
        id: 'work/siteId',
        selected: false,
      },
    ],
  },
  {
    groupName: 'Address',
    key: 'address',
    options: [
      {
        value: 'City',
        id: 'address/city',
        selected: false,
      },
      {
        value: 'Country',
        id: 'address/country',
        selected: false,
      },
      {
        value: 'State',
        id: 'address/state',
        selected: false,
      },
    ],
  },
];

export const selectOptionsMockDef: SelectGroupOption[] = selectOptionsMock.map(
  group => ({
    ...group,
    options: group.options.map(option => ({
      ...option,
      selected: randomNumber() > 80,
      disabled: randomNumber() > 90,
    })),
  })
);
