import { ColumnDef } from '../table/table.interface';
import { AvatarCellComponent } from '../table-cell-components/avatar-cell/avatar.component';
import { ActionsCellComponent } from '../table-cell-components/actions-cell/actions-cell.component';
import { GridActions } from '../table-cell-components/actions-cell/actions-cell.interface';
import { PinDirection, SortDirections } from '../table/table.enum';
import {
  Icons,
  makeArray,
  mockAvatar,
  mockDate,
  mockNames,
  mockText,
  randomFromArray,
  randomNumber,
  simpleUID,
  mockThings,
  mockAnimals,
} from 'bob-style';

const gridActions: GridActions = {
  menuItems: [
    {
      label: 'menu item 1',
      action: ($event) => console.log('menu item 1 clicked', $event),
    },
    {
      label: 'menu item 2',
      action: ($event) => console.log('menu item 2 clicked', $event),
    },
  ],
};

export const mockColumnsDefs: ColumnDef[] = [
  {
    headerName: '',
    field: 'about.avatar.imageSource',
    cellRendererFramework: AvatarCellComponent,
    minWidth: 66,
    maxWidth: 66,
    pinned: PinDirection.Left,
    lockPosition: true,
    resizable: false,
    sortable: false,
    flex: 1,
  },
  {
    headerName: 'Display Name',
    headerClass: 'test-class',
    field: 'fullName',
    sort: SortDirections.Asc,
    flex: 2,
  },
  {
    headerName: 'Email',
    field: 'email',
    icon: Icons.email,
    flex: 1,
  },
  {
    headerName: 'Status',
    field: 'internal.status',
    flex: 1,
  },
  {
    headerName: 'Hired Date',
    field: 'hiredDate',
    icon: Icons.date,
    flex: 1,
  },
  {
    headerName: '',
    field: 'actions',
    cellRendererFramework: ActionsCellComponent,
    pinned: PinDirection.Right,
    lockPosition: true,
    resizable: false,
    sortable: false,
    flex: 1,
  },
];

const mockFields = mockThings(10);

export const mockColumnsDefsExtended: ColumnDef[] = [
  ...mockColumnsDefs,

  ...mockFields.map((field) => ({
    headerName: field,
    field: field,
  })),
];

export const mockRowData = makeArray(100).map((i, index) => ({
  fullName: index === 0 ? 'Érica Ûulrich' : mockNames(1),
  id: simpleUID(),
  email: mockText(1).toLowerCase() + '@' + mockText(1).toLowerCase() + '.com',
  internal: {
    status: randomFromArray([
      'Single',
      'Married',
      'Divorsed',
      'Engaged',
      'Separated',
      'Diceased',
    ]),
  },
  about: {
    avatar: {
      imageSource: mockAvatar(),
    },
  },
  hiredDate: mockDate(),

  ...mockFields.reduce((obj, field) => {
    obj[field] = mockAnimals(1);
    return obj;
  }, {}),
  actions: gridActions,
  isClickable: true,
}));

export const treeColumnDefsMock: ColumnDef[] = [
  {
    field: 'jobTitle',
    headerName: 'Job Title',
    sortable: true,
  },
  {
    field: 'employmentType',
    headerName: 'Employment Type',
    sortable: true,
  },
];
export const treeRowDataMock = [
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: ['Erica Rogers'],
    },
    jobTitle: 'CEO',
    employmentType: 'Permanent',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: ['Erica Rogers', 'Malcolm Barrett'],
    },
    jobTitle: 'Exec. Vice President',
    employmentType: 'Permanent',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker'],
    },
    jobTitle: 'Director of Operations',
    employmentType: 'Permanent',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: [
        'Erica Rogers',
        'Malcolm Barrett',
        'Esther Baker',
        'Brittany Hanson',
      ],
    },
    jobTitle: 'Fleet Coordinator',
    employmentType: 'Permanent',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: [
        'Erica Rogers',
        'Malcolm Barrett',
        'Esther Baker',
        'Brittany Hanson',
        'Leah Flowers',
      ],
    },
    jobTitle: 'Parts Technician',
    employmentType: 'Contract',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: [
        'Erica Rogers',
        'Malcolm Barrett',
        'Esther Baker',
        'Brittany Hanson',
        'Tammy Sutton',
      ],
    },
    jobTitle: 'Service Technician',
    employmentType: 'Contract',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: [
        'Erica Rogers',
        'Malcolm Barrett',
        'Esther Baker',
        'Derek Paul',
      ],
    },
    jobTitle: 'Inventory Control',
    employmentType: 'Permanent',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland'],
    },
    jobTitle: 'VP Sales',
    employmentType: 'Permanent',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: [
        'Erica Rogers',
        'Malcolm Barrett',
        'Francis Strickland',
        'Morris Hanson',
      ],
    },
    jobTitle: 'Sales Manager',
    employmentType: 'Permanent',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: [
        'Erica Rogers',
        'Malcolm Barrett',
        'Francis Strickland',
        'Todd Tyler',
      ],
    },
    jobTitle: 'Sales Executive',
    employmentType: 'Contract',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: [
        'Erica Rogers',
        'Malcolm Barrett',
        'Francis Strickland',
        'Bennie Wise',
      ],
    },
    jobTitle: 'Sales Executive',
    employmentType: 'Contract',
  },
  {
    orgHierarchy: {
      data: { imageSource: mockAvatar() },
      hierarchy: [
        'Erica Rogers',
        'Malcolm Barrett',
        'Francis Strickland',
        'Joel Cooper',
      ],
    },
    jobTitle: 'Sales Executive',
    employmentType: 'Permanent',
  },
];

function makeBranch(names: string[]) {
  return makeArray(randomNumber(1, names.length)).map(
    () => names[randomNumber(1, names.length)]
  );
}

function generateTree() {
  const names = mockNames(5);
  return makeArray(200).map(() => makeBranch(names));
}

const tree = generateTree();
export const mockRowDataTree = makeArray(200).map((i) => ({
  fullName: tree[i],
  id: simpleUID(),
  email: mockText(1).toLowerCase() + '@' + mockText(1).toLowerCase() + '.com',
  internal: {
    status: randomFromArray([
      'Single',
      'Married',
      'Divorsed',
      'Engaged',
      'Separated',
      'Diceased',
    ]),
  },
  about: {
    avatar: {
      imageSource: mockAvatar(),
    },
  },
  hiredDate: mockDate(),
  actions: gridActions,
  isClickable: true,
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
