import { action } from '@storybook/addon-actions';
import { CardTableCellMeta, CardTableCellData } from './card-table.interface';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { mockAvatar, mockName, mockJobs, mockDate } from '../../mock.const';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { ChipComponent } from '../../chips/chip/chip.component';
import { ChipType } from '../../chips/chips.enum';
import {
  randomFromArray,
  makeArray,
} from '../../services/utils/functional-utils';
import { ButtonComponent } from '../../buttons/button/button.component';
import { ButtonType } from '../../buttons/buttons.enum';

const numberOfLines = 5;

const getMockAvatar = () => ({
  component: AvatarComponent,
  attributes: {
    imageSource: mockAvatar(),
    title: mockName(),
    subtitle: mockJobs(1),
    size: AvatarSize.small,
    isClickable: false,
  },
  handlers: {
    clicked: action('Avatar was clicked'),
  },
});

const getMockStatusChip = () => {
  const status = randomFromArray(['Rejected', 'Pending', 'Approved']);
  return {
    component: ChipComponent,
    attributes: {
      type:
        status === 'Rejected'
          ? ChipType.error
          : status === 'Pending'
          ? ChipType.warning
          : ChipType.success,
    },
    content: status,
  };
};

export const CardTableMockMetaData: CardTableCellMeta[] = [
  {
    id: 5,
    name: 'Status',
    width: 16,
    sortable: true,
  },
  {
    id: 1,
    name: 'Requested For',
    width: 25,
    sortable: false,
  },
  {
    id: 2,
    name: 'Subject',
    textStyle: {
      fontWeight: '500',
    },
    width: 18,
    sortable: false,
  },
  {
    id: 3,
    name: 'Requested by',
    sortable: false,
  },
  {
    id: 4,
    name: 'Assignee',
    sortable: false,
  },
];

const firstLine = [
  {
    data: {
      component: ButtonComponent,
      attributes: {
        type: ButtonType.secondary,
      },
      content: 'Approve',
      handlers: {
        clicked: action('Button was clicked'),
      },
    },
  },
  {
    data: getMockAvatar(),
  },
  {
    data: 'UK Product Team Salary Change',
  },
  {
    data: [mockName(), mockDate()],
  },
  {
    data: [mockName(), '(You)'],
    class: 'highlight-second-line',
  },
];

const texts = [
  'Personal Information Update',
  'NYC Employee Promotion',
  'UK Design Team Salary Change',
  'Single line of some very long text that should truncate after two lines with an ellipsis',
];

export const CardTableMockData: CardTableCellData[][] = [
  firstLine,
  ...makeArray(numberOfLines).map(i => [
    {
      data: getMockStatusChip(),
    },
    {
      data: getMockAvatar(),
    },
    {
      data: randomFromArray(texts),
    },
    {
      data: [mockName(), mockDate()],
    },
    {
      data: [mockName(), mockJobs(1)],
    },
  ]),
];
