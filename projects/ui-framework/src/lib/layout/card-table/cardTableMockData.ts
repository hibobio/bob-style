import { CardTableMetaData, CardTableData } from './card-table.interface';
import { ChipComponent } from '../../buttons-indicators/chips/chip/chip.component';
import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';
import { MockComponent } from '../../services/mock-component/mock.component';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';

import { action } from '@storybook/addon-actions';

const mockComponentAttributes = {
  hostcss: {
    display: 'grid',
    gridTemplateColumns: '60px auto',
    gridGap: '0 15px'
  },
  slot1css: {
    gridRow: '1 / span 2'
  },
  slot2css: {
    display: 'flex',
    alignItems: 'flex-end',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  slot3css: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};

const avatarComponentAttributes = {
  size: 'small',
  isClickable: true
};

export const CardTableMockMetaData: CardTableMetaData = [
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

export const CardTableMockData: CardTableData = [
  [
    {
      data: {
        component: MockComponent,
        attributes: mockComponentAttributes,
        content: [
          {
            component: AvatarComponent,
            attributes: {
              imageSource: 'http://i.pravatar.cc/200?img=3',
              ...avatarComponentAttributes
            },
            handlers: {
              clicked: action('Avatar was clicked')
            }
          },
          'Dylan Herrera',
          'Product designer'
        ]
      }
    },
    {
      data: 'UK Product Team Salary Change'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data: ['Madge Scott', '(You)']
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
        component: MockComponent,
        attributes: mockComponentAttributes,
        content: [
          {
            component: AvatarComponent,
            attributes: {
              imageSource: 'http://i.pravatar.cc/200?img=2',
              ...avatarComponentAttributes
            },
            handlers: {
              clicked: action('Avatar was clicked')
            }
          },
          'Joel Sanders',
          'Business developer'
        ]
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
          type: 'attention'
        },
        content: 'Pending'
      }
    }
  ],
  [
    {
      data: {
        component: MockComponent,
        attributes: mockComponentAttributes,
        content: [
          {
            component: AvatarComponent,
            attributes: {
              imageSource: 'http://i.pravatar.cc/200?img=1',
              ...avatarComponentAttributes
            },
            handlers: {
              clicked: action('Avatar was clicked')
            }
          },
          'Nora Herrera',
          'Front-end engineer'
        ]
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
        component: MockComponent,
        attributes: mockComponentAttributes,
        content: [
          {
            component: AvatarComponent,
            attributes: {
              imageSource: 'http://i.pravatar.cc/200?img=4',
              ...avatarComponentAttributes
            },
            handlers: {
              clicked: action('Avatar was clicked')
            }
          },
          'Jaspreet Bhamrai',
          'Product designer'
        ]
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
        component: MockComponent,
        attributes: mockComponentAttributes,
        content: [
          {
            component: AvatarComponent,
            attributes: {
              imageSource: 'http://i.pravatar.cc/200?img=5',
              ...avatarComponentAttributes
            },
            handlers: {
              clicked: action('Avatar was clicked')
            }
          },
          'Chioke Okonkwo',
          'Business developer'
        ]
      }
    },
    {
      data: 'Personal Information Update'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data: '\u2014'
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
        component: MockComponent,
        attributes: mockComponentAttributes,
        content: [
          {
            component: AvatarComponent,
            attributes: {
              imageSource: 'http://i.pravatar.cc/200?img=6',
              ...avatarComponentAttributes
            },
            handlers: {
              clicked: action('Avatar was clicked')
            }
          },
          'Abhoy Latif',
          'Business developer'
        ]
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
