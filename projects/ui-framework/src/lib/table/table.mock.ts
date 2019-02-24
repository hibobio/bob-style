import { ColumnDef, PinDirection, SortDirections } from './table/table.interface';
import { AvatarCellComponent } from './table/avatar.component';

export const mockColumnsDefs: ColumnDef[] = [
  {
    headerName: 'selection',
    field: 'selection',
    checkboxSelection: true,
    resizable: true,
    pinned: PinDirection.Left,
    width: 40,
    lockPosition: true
  },
  {headerName: '', field: 'about.avatar', cellRendererFramework: AvatarCellComponent, width: 40, lockPosition: true},
  {headerName: 'Display Name', field: 'fullName', resizable: true, sort: SortDirections.Asc, sortable: true},
  {headerName: 'Email', field: 'email', resizable: true, sortable: true},
  {headerName: 'Status', field: 'internal.status', resizable: true, sortable: true},
  {headerName: 'Hired Date', field: 'hiredDate', resizable: true, sortable: true},
];

export const mockRowData = [
  {
    fullName: 'Omri Hecht',
    email: 'omri.hecht@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar: {imageSource: 'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'},
    },
    hiredDate: '2017-11-29'
  },
  {
    fullName: 'Doron Cynsiger',
    email: 'doron.cynsiger@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar:
        {imageSource: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvWogj6uHgdZ8ovMF6cYShBGxsOvfk0xv1GB6rxwAP7ABAivC6'},
    },
    hiredDate: '2017-02-29'
  },
  {
    fullName: 'Israel David',
    email: 'israel.david@hibob.io',
    internal: {
      status: 'Active'
    },
    about: {
      avatar: {imageSource: 'https://townsquare.media/site/442/files/2014/06/solo-foot-1.jpg?w=980&q=75'},
    },
    hiredDate: '2016-01-29'
  },
  {
    fullName: 'Ishai Borovoy',
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
  }
];
