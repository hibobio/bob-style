import { PinDirection, SortDirections } from '../table/table.interface';

export const COLUMN_DEFS_MOCK = [
  {
    headerName: '',
    field: 'about.avatar.imageSource',
    pinned: PinDirection.Left,
    lockPosition: true,
    resizable: false,
    sortable: false,
  },
  {
    headerName: 'Display Name',
    field: 'fullName',
    resizable: true,
    sortable: true,
  },
  {
    headerName: 'Email',
    field: 'email',
    resizable: true,
    sortable: true,
  },
];

export const ROW_DATA_MOCK = [
  {
    fullName: 'Omri Hecht',
    id: '1',
    email: 'omri.hecht@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar: {
        imageSource: 'img_url1.jpg',
      },
    },
  },
  {
    fullName: 'Doron Cynsiger',
    id: '2',
    email: 'doron.cynsiger@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar:
        {
          imageSource: 'img_url2.jpg',
        },
    },
  },
  {
    fullName: 'Ishai Borovoy',
    id: '3',
    email: 'ishai.borovoy@hibob.io',
    internal: {
      status: 'InActive'
    },
    about: {
      avatar: {
        imageSource: 'img_url3.jpg',
      }
    },
  },
];
