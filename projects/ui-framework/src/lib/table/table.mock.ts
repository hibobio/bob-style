import { ColumnDef, PinDirection, SortDirections } from './table/table.interface';
import { AvatarCellComponent } from './table-cell-components/avatar.component';

export const mockColumnsDefs: ColumnDef[] = [
  {
    headerName: '',
    field: 'about.avatar',
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
  },
  {
    headerName: 'Status',
    field: 'internal.status',
  },
  {
    headerName: 'Hired Date',
    field: 'hiredDate',
  },
];

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
    hiredDate: '2017-11-29'
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
    hiredDate: '2017-02-29'
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
    hiredDate: '2016-01-29'
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
    hiredDate: '2017-01-30'
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
