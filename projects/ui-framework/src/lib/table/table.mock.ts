import { ColumnConfig, filedType, sortDirections } from './table/column-config';
import { AvatarComponent } from '../buttons-indicators/avatar';

export const mockColumns: ColumnConfig[] = [
  {
    name: 'avatar',
    displayName: '',
    type: filedType.component,
    component: {
      component: AvatarComponent,
      attributes: { 'imageSource': 'about.avatar', 'clicked': 'about.avatarClick', 'isClickable': 'about.isClickable' },
    },
    isSort: true,
    sortActive: sortDirections.asc
  },
  {
    name: 'fullName',
    displayName: 'Display Name',
    type: filedType.string,
    isSort: true,
    sortActive: sortDirections.asc
  },
  {
    name: 'email',
    displayName: 'Email',
    type: filedType.string,
    isSort: true,
    sortActive: sortDirections.asc
  },
  {
    name: 'internal.status',
    displayName: 'Status',
    type: filedType.enum,
    options: [
      { name: 'active', displayName: 'Active', selected: false },
      { name: 'inactive', displayName: 'InActive', selected: true }
    ],
    isSort: true,
    sortActive: sortDirections.asc
  }
];

export const mockData = [
  {
    fullName: 'Omri Hecht',
    email: 'omri.hecht@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar: 'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg',
      avatarClick: ($event) => console.log($event),
      isClickable: true,
    }
  },
  {
    fullName: 'Doron Cynsiger',
    email: 'doron.cynsiger@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvWogj6uHgdZ8ovMF6cYShBGxsOvfk0xv1GB6rxwAP7ABAivC6',
      avatarClick: ($event) => console.log($event),
      isClickable: true,
    }
  },
  {
    fullName: 'Israel David',
    email: 'israel.david@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar: 'https://townsquare.media/site/442/files/2014/06/solo-foot-1.jpg?w=980&q=75',
      avatarClick: ($event) => console.log($event),
      isClickable: true,
    }
  },
  {
    fullName: 'Ishai Borovoy',
    email: 'ishai.borovoy@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar: 'https://lumiere-a.akamaihd.net/v1/images/solo-han-solo-main_890f79bd.jpeg?region=8%2C0%2C1543%2C868&width=960',
      avatarClick: ($event) => console.log($event),
      isClickable: true,
    }
  }
];
