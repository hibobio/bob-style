import { MenuItem } from '../navigation/menu/menu.interface';
import { Card } from './card/card.interface';
import { AddCard } from './card-add/card-add.interface';
import { CardEmployee } from './card-employee/card-employee.interface';
import { mockAvatar, mockJobs, mockNames } from '../mock.const';
import { Icons } from '../icons/icons.enum';

const menuMock: MenuItem[] = [
  {
    label: 'Do this',
    action: $event => console.log('Do this', $event)
  },
  {
    label: 'Do that',
    action: $event => console.log('Do that', $event)
  },
  {
    label: 'Do something else',
    action: $event => console.log('Do something else', $event)
  }
];

export const AddCardMockData: AddCard = {
  title: 'Add a new flow',
  subtitle: 'Right now',
  action: () => console.log('Add Card was clicked')
};

export const CardsMockData: Card[] = [
  {
    title: 'Compensation update',
    menuConfig: menuMock,
    footerCtaLabel: 'EDIT',
  },
  {
    title: `Compensation update with a very long text that
        cuts off after 4 lines of text. And here is another very long text that should not be
        displayed at all.`,
    menuConfig: menuMock,
    footerCtaLabel: 'EDIT',
  },
  {
    title: 'Another compensation update',
    menuConfig: menuMock,
    footerCtaLabel: 'EDIT',
  },
  {
    title: 'Update that compensation already!',
    menuConfig: menuMock,
    footerCtaLabel: 'EDIT',
  },
  {
    title: `Come on! The compensation has not been updated for ages!`,
    menuConfig: menuMock,
    footerCtaLabel: 'EDIT',
  },
  {
    title: `If you dont update the compensation immidiately,
      I will update your compensation and you will not like it!`,
    actionConfig: {
      icon: Icons.file_copy,
      action: ($event) => console.log('copy file'),
    },
    footerCtaLabel: 'EDIT',
  }
];

export const EmployeeCardsMockData: CardEmployee[] = mockNames(6).map(name => ({
  imageSource: mockAvatar(),
  title: name,
  subtitle: mockJobs(1),
  social: {
    linkedin: 'bad_url_linkedin',
    facebook: 'bad_url_facebook',
    twitter: 'bad_url_twitter',
  },
  coverColors: {
    color1: '#fea54a',
    color2: '#fe4a4a',
  }
}));
