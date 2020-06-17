import { TestBed } from '@angular/core/testing';
import { TableUtilsService } from './table-utils.service';
import { ColumnDef } from '../table/table.interface';
import { concat } from 'lodash';
import {
  PinDirection,
  RowSelection,
  SortDirections,
} from '../table/table.enum';
import { IconColor, Icons } from 'bob-style';

describe('TableUtilsService', () => {
  let tableUtilsService: TableUtilsService;
  let gridOptionsMock = {};
  let rowSelectionMock = null;
  let columnDefsMock: ColumnDef[] = [];
  let newColumnDefsMock;
  let tableColumnsMock = [];
  let existingColsMock;

  beforeEach(() => {
    existingColsMock = [
      { field: 'about.avatar', }, { field: 'fullName', }, { field: 'email', },
    ];

    columnDefsMock = [
      {
        headerName: '',
        field: 'about.avatar',
        pinned: PinDirection.Left,
        lockPosition: true,
        resizable: false,
        sortable: false,
        menuTabs: [],
        cellClass: [],
        cellStyle: {},
      },
      {
        headerName: 'Display Name',
        field: 'fullName',
        sort: SortDirections.Asc,
        resizable: true,
        sortable: true,
        menuTabs: [],
        cellClass: [],
        cellStyle: {},
      },
      {
        headerName: 'Email',
        field: 'email',
        resizable: true,
        sortable: true,
        menuTabs: [],
        cellClass: [],
        cellStyle: {},
      },
    ];
    newColumnDefsMock = [{ field: 'fullName' }, { field: 'email' }, { field: 'site' }, { field: 'department' }];
    tableColumnsMock = [
      {
        colId: 'about.avatar',
        colDef: columnDefsMock[0],
      },
      {
        colId: 'fullName',
        colDef: columnDefsMock[1],
      },
      {
        colId: 'email',
        colDef: columnDefsMock[2],
      },
    ];
    gridOptionsMock = {
      columnApi: {
        getAllColumns: () => tableColumnsMock,
      },
    };

    TestBed.configureTestingModule({
      providers: [TableUtilsService],
    });

    tableUtilsService = TestBed.inject(TableUtilsService);
  });

  describe('getAllColFields', () => {
    it('should return array of all column ids from gridOptions.columnApi', () => {
      const selectedFields = tableUtilsService.getAllColFields(gridOptionsMock);
      expect(selectedFields).toEqual(['about.avatar', 'fullName', 'email']);
    });
  });

  describe('getGridColumnDef', () => {
    it('should not enrich data with select column', () => {
      rowSelectionMock = null;
      const columnDefs = tableUtilsService.getGridColumnDef(
        columnDefsMock,
        rowSelectionMock
      );
      expect(columnDefs).toEqual(columnDefsMock);
    });
    xit('should enrich data with multi select column', () => {
      rowSelectionMock = RowSelection.Multiple;
      const multiColumnDef = {
        width: 46,
        field: 'selection',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerName: '',
        lockPosition: true,
        pinned: 'left',
        menuTabs: [],
      };
      const columnDefs = tableUtilsService.getGridColumnDef(
        columnDefsMock,
        rowSelectionMock
      );
      expect(columnDefs).toEqual(concat(multiColumnDef, columnDefsMock));
    });
    xit('should enrich data with single select column', () => {
      rowSelectionMock = RowSelection.Single;
      const multiColumnDef = {
        width: 46,
        field: 'selection',
        headerCheckboxSelection: false,
        checkboxSelection: true,
        headerName: '',
        lockPosition: true,
        pinned: 'left',
        menuTabs: [],
      };
      const columnDefs = tableUtilsService.getGridColumnDef(
        columnDefsMock,
        rowSelectionMock
      );
      expect(columnDefs).toEqual(concat(multiColumnDef, columnDefsMock));
    });
    it('should add icon cellClass and cellStyle and color normal by default', () => {
      rowSelectionMock = null;
      const colDefIconMock: ColumnDef[] = [
        {
          headerName: 'Email',
          field: 'email',
          resizable: true,
          sortable: true,
          icon: Icons.email,
        },
      ];
      const expectedColDefs: ColumnDef[] = [
        {
          headerName: 'Email',
          field: 'email',
          resizable: true,
          sortable: true,
          icon: Icons.email,
          menuTabs: [],
          cellClass: ['b-icon-email', 'b-icon-normal', 'b-icon-medium'],
          cellStyle: { padding: '0 15px 0 43px' },
        },
      ];
      const columnDefs = tableUtilsService.getGridColumnDef(
        colDefIconMock,
        rowSelectionMock
      );
      expect(columnDefs).toEqual(expectedColDefs);
    });
    it('should add icon cellClass and cellStyle and color from spec', () => {
      rowSelectionMock = null;
      const colDefIconMock: ColumnDef[] = [
        {
          headerName: 'Email',
          field: 'email',
          resizable: true,
          sortable: true,
          icon: Icons.email,
          iconColor: IconColor.inform,
        },
      ];
      const expectedColDefs: ColumnDef[] = [
        {
          headerName: 'Email',
          field: 'email',
          resizable: true,
          sortable: true,
          icon: Icons.email,
          iconColor: IconColor.inform,
          menuTabs: [],
          cellClass: ['b-icon-email', 'b-icon-inform', 'b-icon-medium'],
          cellStyle: { padding: '0 15px 0 43px' },
        },
      ];
      const columnDefs = tableUtilsService.getGridColumnDef(
        colDefIconMock,
        rowSelectionMock
      );
      expect(columnDefs).toEqual(expectedColDefs);
    });
  });

  describe('getOrderedFields', () => {
    it('Should sort existing columns according to order', () => {
      const columnOrder = ['about.avatar', 'email', 'fullName'];
      const orderedColumns = tableUtilsService.getOrderedFields(existingColsMock, newColumnDefsMock, columnOrder);
      expect(orderedColumns).toEqual([
        { field: 'email' }, { field: 'fullName' }, { field: 'site' }, { field: 'department', }
      ] as any);
    });
    it('Should kepp existing columns order is no order is passed', () => {
      const orderedColumns = tableUtilsService.getOrderedFields(existingColsMock, newColumnDefsMock, null);
      expect(orderedColumns).toEqual([
        { field: 'fullName' }, { field: 'email' }, { field: 'site' }, { field: 'department' },
      ] as any);
    });
  });
});
