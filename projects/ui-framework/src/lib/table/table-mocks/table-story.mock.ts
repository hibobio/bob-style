import { ColumnDef } from '../table/table.interface';
import { AvatarCellComponent } from '../table-cell-components/avatar-cell/avatar.component';
import { ActionsCellComponent } from '../table-cell-components/actions-cell/actions-cell.component';
import { GridActions } from '../table-cell-components/actions-cell/actions-cell.interface';
import { PinDirection, SortDirections } from '../table/table.enum';
import { Icons } from '../../icons/icons.enum';

export const mockColumnsDefs: ColumnDef[] = [
  {
    headerName: '',
    field: 'about.avatar.imageSource',
    cellRendererFramework: AvatarCellComponent,
    pinned: PinDirection.Left,
    lockPosition: true,
    resizable: false,
    sortable: false,
  },
  {
    headerName: 'Display Name',
    field: 'fullName',
    sort: SortDirections.Asc,
  },
  {
    headerName: 'Email',
    field: 'email',
    icon: Icons.email,
  },
  {
    headerName: 'Status',
    field: 'internal.status',
  },
  {
    headerName: 'Hired Date',
    field: 'hiredDate',
    icon: Icons.date,
  },
  {
    headerName: '',
    field: 'actions',
    cellRendererFramework: ActionsCellComponent,
    pinned: PinDirection.Right,
    lockPosition: true,
    resizable: false,
    sortable: false,
  },
];

const gridActions: GridActions = {
  menuItems: [
    {
      label: 'menu item 1',
      action: ($event) => console.log('menu item 1 clicked', $event)
    },
    {
      label: 'menu item 2',
      action: ($event) => console.log('menu item 2 clicked', $event)
    },
  ],
};

export const mockRowData = [
  {
    fullName: 'Omri Hecht',
    id: '1',
    email: 'omri.hecht@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar: {
        imageSource: 'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg',
      },
    },
    hiredDate: '2017-11-29',
    actions: gridActions,
    isClickable: true,
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
          imageSource: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvWogj6uHgdZ8ovMF6cYShBGxsOvfk0xv1GB6rxwAP7ABAivC6',
        },
    },
    hiredDate: '2017-02-29',
    actions: gridActions,
    isClickable: false,
  },
  {
    fullName: 'Israel David',
    id: '3',
    email: 'israel.david@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar: {
        imageSource: 'https://townsquare.media/site/442/files/2014/06/solo-foot-1.jpg?w=980&q=75',
      },
    },
    hiredDate: '2016-01-29',
    actions: gridActions,
    isClickable: true,
  },
  {
    fullName: 'Ishai Borovoy',
    id: '4',
    email: 'ishai.borovoy@hibob.io',
    internal: {
      status: 'InActive'
    },
    about: {
      avatar: {
        imageSource:
          'https://lumiere-a.akamaihd.net/v1/images/solo-han-solo-main_890f79bd.jpeg?region=8%2C0%2C1543%2C868&width=960',
      }
    },
    hiredDate: '2017-01-30',
    actions: gridActions,
    isClickable: true,
  },
];

// For test performance
// for (let i = 4; i < 40; i++) {
//   mockRowData[i] = mockRowData[0];
//   mockRowData[i].id = `${ i }`;
//   if (i % 100 === 0) {
//     console.log('Generate rows ' + i);
//   }
// }
//
// for (let i = 5; i < 10; i++) {
//   mockColumnsDefs[i] = {
//     headerName: ` ${i} column Name ${i}`,
//     field: `field.path`,
//   };
// }
