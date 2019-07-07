import { MenuItem } from '../navigation/menu/menu.interface';
import { SliderComponent } from '../buttons-indicators/slider/slider.component';
import { RenderedComponent } from '../services/component-renderer/component-renderer.interface';
import { AvatarComponent } from '../buttons-indicators/avatar/avatar.component';
import { AvatarSize } from '../buttons-indicators/avatar/avatar.enum';
import { CardData, AddCardData } from './cards.interface';
import { randomNumber } from '../services/utils/functional-utils';
import { mockNames, mockAvatar, mockJobs } from '../mock.const';

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

const headerComponent = (index: number): RenderedComponent => ({
  component: AvatarComponent,
  attributes: {
    imageSource: mockAvatar(),
    size: AvatarSize.mini,
    title: mockNames(30)[index]
  }
});

const footerComponent = (): RenderedComponent => ({
  component: SliderComponent,
  attributes: {
    value: randomNumber(10, 90),
    showLabel: false,
    readOnly: true
  }
});

export const AddCardMockData: AddCardData = {
  title: 'Add a new flow',
  subtitle: 'Right now',
  action: () => console.log('Add Card was clicked')
};

export const CardsMockData: CardData[] = [
  {
    data: {
      text: 'Compensation update',
      header: headerComponent(1),
      footer: footerComponent()
    },
    menu: menuMock
  },
  {
    data: {
      text: `Compensation update with a very long text that
        cuts off after 4 lines of text. And here is another very long text that should not be
        displayed at all.`,
      header: headerComponent(2),
      footer: footerComponent()
    },
    menu: menuMock
  },
  {
    data: {
      text: 'Another compensation update',
      header: headerComponent(3),
      footer: footerComponent()
    },
    menu: menuMock
  },
  {
    data: {
      text: 'Update that compensation already!',
      header: headerComponent(4),
      footer: footerComponent()
    },
    menu: menuMock
  },
  {
    data: {
      text: `Come on! The compensation has not been updated for ages!`,
      header: headerComponent(5),
      footer: footerComponent()
    },
    menu: menuMock
  },
  {
    data: {
      text: `If you dont update the compensation immidiately,
      I will update your compensation and you will not like it!`,
      header: headerComponent(6),
      footer: footerComponent()
    },
    menu: menuMock
  }
];

export const EmployeeCardsMockData: CardData[] = mockNames(6).map(name => ({
  data: {
    avatar: {
      imageSource: mockAvatar(),
      title: name,
      subtitle: mockJobs(1)
    }
  }
}));
