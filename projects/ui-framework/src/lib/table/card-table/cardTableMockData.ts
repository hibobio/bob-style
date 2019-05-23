import { CardTableCellMeta, CardTableCellData } from './card-table.interface';
import { ChipComponent } from '../../buttons-indicators/chips/chip/chip.component';
import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { action } from '@storybook/addon-actions';

const avatarComponentAttributes = {
  size: 'small',
  isClickable: true
};

export const CardTableMockMetaData: CardTableCellMeta[] = [
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
  },
  {
    id: 5,
    name: 'Status',
    width: 15,
    align: 'right',
    sortable: true
  }
];

export const CardTableMockData: CardTableCellData[][] = [
  [
    {
      data: {
        component: AvatarComponent,
        attributes: {
          imageSource: 'http://i.pravatar.cc/200?img=3',
          title: 'Dylan Herrera',
          subtitle: 'Product designer',
          ...avatarComponentAttributes
        },
        handlers: {
          clicked: action('Avatar was clicked')
        }
      }
    },
    {
      data: 'UK Product Team Salary Change'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data: ['Madge Scott', '(You)'],
      class: 'highlight-second-line'
    },
    {
      data: {
        component: ButtonComponent,
        attributes: {
          type: 'secondary'
        },
        content: 'Approve',
        handlers: {
          clicked: action('Button was clicked')
        }
      }
    }
  ],
  [
    {
      data: {
        component: AvatarComponent,
        attributes: {
          imageSource: 'http://i.pravatar.cc/200?img=2',
          title: 'Joel Sanders',
          subtitle: 'Business developer',
          ...avatarComponentAttributes
        },
        handlers: {
          clicked: action('Avatar was clicked')
        }
      }
    },
    {
      data: 'Personal Information Update'
    },
    {
      data: ['Fakhri Shokoohi', '05/05/2019']
    },
    {
      data: ['Emelda Scandroot', 'CFO']
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'attention',
          color: 'red'
        },
        content: 'Pending'
      }
    }
  ],
  [
    {
      data: {
        component: AvatarComponent,
        attributes: {
          imageSource: 'http://i.pravatar.cc/200?img=1',
          title: 'Nora Herrera',
          subtitle: 'Front-end engineer',
          ...avatarComponentAttributes
        },
        handlers: {
          clicked: action('Avatar was clicked')
        }
      }
    },
    {
      data: 'NYC Employee Promotion'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data: ['Constanza Mariano', 'HR admin']
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'attention'
        },
        content: 'Pending'
      }
    }
  ],
  [
    {
      data: {
        component: AvatarComponent,
        attributes: {
          imageSource: 'http://i.pravatar.cc/200?img=4',
          title: 'Jaspreet Bhamrai',
          subtitle: 'Product designer',
          ...avatarComponentAttributes
        },
        handlers: {
          clicked: action('Avatar was clicked')
        }
      }
    },
    {
      data: 'UK Design Team Salary Change'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data:
        'Single line of some very long text that should truncate after two lines with an ellipsis.'
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'success'
        },
        content: 'Approved'
      }
    }
  ],
  [
    {
      data: {
        component: AvatarComponent,
        attributes: {
          imageSource: 'http://i.pravatar.cc/200?img=5',
          title: 'Chioke Okonkwo',
          subtitle: 'Business developer',
          ...avatarComponentAttributes
        },
        handlers: {
          clicked: action('Avatar was clicked')
        }
      }
    },
    {
      data: 'Personal Information Update'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data: ''
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'success'
        },
        content: 'Approved'
      }
    }
  ],
  [
    {
      data: {
        component: AvatarComponent,
        attributes: {
          imageSource: 'http://i.pravatar.cc/200?img=6',
          title: 'Abhoy Latif',
          subtitle: 'Business developer',
          ...avatarComponentAttributes
        },
        handlers: {
          clicked: action('Avatar was clicked')
        }
      }
    },
    {
      data: 'Personal Information Update'
    },
    {
      data: ['Gopichand Sana', '7/12/2018']
    },
    {
      data: ['Madge Scott', 'VP Product']
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'warning'
        },
        content: 'Rejected'
      }
    }
  ]
];
