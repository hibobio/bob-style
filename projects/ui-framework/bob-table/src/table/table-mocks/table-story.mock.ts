import { ColumnDef } from '../table/table.interface';
import { AvatarCellComponent } from '../table-cell-components/avatar-cell/avatar.component';
import { ActionsCellComponent } from '../table-cell-components/actions-cell/actions-cell.component';
import { GridActions } from '../table-cell-components/actions-cell/actions-cell.interface';
import { PinDirection, SortDirections } from '../table/table.enum';
import {
  Icons,
  makeArray,
  mockText,
  mockNames,
  simpleUID,
  mockAvatar,
  mockDate,
  randomFromArray
} from 'bob-style';

export const mockColumnsDefs: ColumnDef[] = [
  {
    headerName: '',
    field: 'about.avatar.imageSource',
    cellRendererFramework: AvatarCellComponent,
    pinned: PinDirection.Left,
    lockPosition: true,
    resizable: false,
    sortable: false
  },
  {
    headerName: 'Display Name',
    field: 'fullName',
    sort: SortDirections.Asc
  },
  {
    headerName: 'Email',
    field: 'email',
    icon: Icons.email
  },
  {
    headerName: 'Status',
    field: 'internal.status'
  },
  {
    headerName: 'Hired Date',
    field: 'hiredDate',
    icon: Icons.date
  },
  {
    headerName: '',
    field: 'actions',
    cellRendererFramework: ActionsCellComponent,
    pinned: PinDirection.Right,
    lockPosition: true,
    resizable: false,
    sortable: false
  }
];

const gridActions: GridActions = {
  menuItems: [
    {
      label: 'menu item 1',
      action: $event => console.log('menu item 1 clicked', $event)
    },
    {
      label: 'menu item 2',
      action: $event => console.log('menu item 2 clicked', $event)
    }
  ]
};

export const mockRowData = makeArray(200).map(i => ({
  fullName: mockNames(1),
  id: simpleUID(),
  email: mockText(1).toLowerCase() + '@' + mockText(1).toLowerCase() + '.com',
  internal: {
    status: randomFromArray([
      'Single',
      'Married',
      'Divorsed',
      'Engaged',
      'Separated',
      'Diceased'
    ])
  },
  about: {
    avatar: {
      imageSource: mockAvatar()
    }
  },
  hiredDate: mockDate(),
  actions: gridActions,
  isClickable: true
}));

// For test performance
/*
const rowNumber = 400;
const colNumber = 20;

for (let i = 4; i < rowNumber; i++) {
  mockRowData[i] = mockRowData[0];
  mockRowData[i].id = `${ i }`;
  if (i % 100 === 0) {
    console.log('Generate rows ' + i);
  }
  for (let j = 5; j < colNumber; j++) {
    mockRowData[i][`test${j}`] = 'test';
  }
}

for (let i = 5; i < colNumber; i++) {
  mockColumnsDefs[i] = {
    headerName: ` ${ i } column Name ${ i }`,
    field: `test${ i }`,
  };
}
console.log('mockRowData', mockRowData);
console.log('mockColumnsDefs', mockColumnsDefs);
*/
