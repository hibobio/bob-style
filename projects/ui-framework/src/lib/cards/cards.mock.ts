import { MenuItem } from '../navigation/menu/menu.interface';
import { Card } from './card/card.interface';
import { AddCard } from './card-add/card-add.interface';
import { CardEmployee } from './card-employee/card-employee.interface';
import {
  mockAvatar,
  mockJobs,
  mockText,
  mockUrl,
  mockName,
} from '../mock.const';
import { Icons } from '../icons/icons.enum';
import { makeArray, randomNumber } from '../services/utils/functional-utils';

export const menuMock: MenuItem[] = [
  {
    label: 'Do this',
    action: ($event) => console.log('Do this', $event),
  },
  {
    label: 'Do that',
    action: ($event) => console.log('Do that', $event),
  },
  {
    label: 'Do something else',
    action: ($event) => console.log('Do something else', $event),
  },
];

const actionConfigMock = {
  icon: Icons.file_copy,
  action: ($event) => console.log('copy file'),
};

export const AddCardMockData: AddCard = {
  title: 'Add new',
  subtitle: null,
  action: () => console.log('Add Card was clicked'),
};

export const getCardsMockData = (number = 10) => {
  return makeArray(number).map((i) => {
    const dice = randomNumber();

    return {
      title:
        dice > 50
          ? mockText(randomNumber(2, 13))
          : mockText(randomNumber(2, 5)),
      menuConfig: dice > 50 ? menuMock : null,
      actionConfig: dice <= 50 ? actionConfigMock : null,
      footerCtaLabel: 'EDIT',
    };
  });
};

export const CardsMockData: Card[] = getCardsMockData(5);

export const getEmployeeCardsMockData = (number = 10) => {
  return makeArray(number).map((i) => ({
    imageSource: mockAvatar(),
    title: mockName(),
    subtitle: mockJobs(1),
    social: {
      linkedin: mockUrl('linkedin'),
      facebook: mockUrl('facebook'),
      twitter: mockUrl('twitter'),
    },
    coverColors: {
      color1: '#fea54a',
      color2: '#fea54a',
    },
  }));
};

export const EmployeeCardsMockData: CardEmployee[] = getEmployeeCardsMockData(
  6
);
