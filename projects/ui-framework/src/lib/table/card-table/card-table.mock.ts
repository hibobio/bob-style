import { CardTableCellMeta, CardTableCellData } from './card-table.interface';
import { ChipComponent } from '../../chips/chip/chip.component';
import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { action } from '@storybook/addon-actions';
import { AvatarSize } from '../../buttons-indicators/avatar/avatar.enum';
import { mockAvatar, mockNames, mockJobs, mockDate } from '../../mock.const';
import { ChipType } from '../../chips/chips.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import {
  randomFromArray,
  makeArray
} from '../../services/utils/functional-utils';

const numberOfLines = 5;

const getMockAvatar = () => ({
  component: AvatarComponent,
  attributes: {
    imageSource: mockAvatar(),
    title: mockNames(1),
    subtitle: mockJobs(1),
    size: AvatarSize.small,
    isClickable: false
  },
  handlers: {
    clicked: action('Avatar was clicked')
  }
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
          : ChipType.success
    },
    content: status
  };
};

export const CardTableMockMetaData: CardTableCellMeta[] = [
  {
    id: 5,
    name: 'Status',
    width: 16,
    sortable: true
  },
  {
    id: 1,
    name: 'Requested For',
    width: 25,
    sortable: false
  },
  {
    id: 2,
    name: 'Subject',
    textStyle: {
      fontWeight: '500'
    },
    width: 18,
    sortable: false
  },
  {
    id: 3,
    name: 'Requested by',
    sortable: false
  },
  {
    id: 4,
    name: 'Assignee',
    sortable: false
  }
];

const firstLine = [
  {
    data: {
      component: ButtonComponent,
      attributes: {
        type: ButtonType.secondary
      },
      content: 'Approve',
      handlers: {
        clicked: action('Button was clicked')
      }
    }
  },
  {
    data: getMockAvatar()
  },
  {
    data: 'UK Product Team Salary Change'
  },
  {
    data: [mockNames(1), mockDate()]
  },
  {
    data: [mockNames(1), '(You)'],
    class: 'highlight-second-line'
  }
];

const texts = [
  'Personal Information Update',
  'NYC Employee Promotion',
  'UK Design Team Salary Change',
  'Single line of some very long text that should truncate after two lines with an ellipsis'
];

export const CardTableMockData: CardTableCellData[][] = [
  firstLine,
  ...makeArray(numberOfLines).map(i => [
    {
      data: getMockStatusChip()
    },
    {
      data: getMockAvatar()
    },
    {
      data: randomFromArray(texts)
    },
    {
      data: [mockNames(1), mockDate()]
    },
    {
      data: [mockNames(1), mockJobs(1)]
    }
  ])
];
