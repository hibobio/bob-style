import { TestBed } from '@angular/core/testing';
import { TableUtilsService } from './table-utils.service';
import { ColumnDef, PinDirection, RowSelection, SortDirections } from '../table/table.interface';
import { concat } from 'lodash';

describe('TableUtilsService', () => {
  let tableUtilsService: TableUtilsService;
  let gridOptionsMock = {};
  let rowSelectionMock = null;
  let columnDefsMock: ColumnDef[] = [];
  let tableColumnsMock = [];

  beforeEach(() => {
    columnDefsMock = [
      {
        headerName: '',
        field: 'about.avatar',
        pinned: PinDirection.Left,
        lockPosition: true,
        resizable: false,
        sortable: false,
        menuTabs: [],
      },
      {
        headerName: 'Display Name',
        field: 'fullName',
        sort: SortDirections.Asc,
        resizable: true,
        'sortable': true,
        menuTabs: [],
      },
      {
        headerName: 'Email',
        field: 'email',
        resizable: true,
        sortable: true,
        menuTabs: [],
      },
    ];
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
      providers: [
        TableUtilsService,
      ],
    });

    tableUtilsService = TestBed.get(TableUtilsService);
  });

  describe('getAllColFields', () => {
    it('should return array of all column ids from gridOptions.columnApi', () => {
      const selectedFields = tableUtilsService.getAllColFields(gridOptionsMock);
      expect(selectedFields).toEqual([
        'about.avatar',
        'fullName',
        'email',
      ]);
    });
  });

  fdescribe('getGridColumnDef', () => {
    it('should not enrich data with select column', () => {
      rowSelectionMock = null;
      const columnDefs = tableUtilsService.getGridColumnDef(columnDefsMock, rowSelectionMock);
      expect(columnDefs).toEqual(columnDefsMock);
    });
    it('should enrich data with multi select column', () => {
      rowSelectionMock = RowSelection.Multiple;
      const multiColumnDef = {
        field: 'selection',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerName: '',
        lockPosition: true,
        pinned: 'left',
        menuTabs: [],
      };
      const columnDefs = tableUtilsService.getGridColumnDef(columnDefsMock, rowSelectionMock);
      expect(columnDefs).toEqual(concat(multiColumnDef, columnDefsMock));
    });
    it('should enrich data with single select column', () => {
      rowSelectionMock = RowSelection.Single;
      const multiColumnDef = {
        field: 'selection',
        headerCheckboxSelection: false,
        checkboxSelection: true,
        headerName: '',
        lockPosition: true,
        pinned: 'left',
        menuTabs: [],
      };
      const columnDefs = tableUtilsService.getGridColumnDef(columnDefsMock, rowSelectionMock);
      expect(columnDefs).toEqual(concat(multiColumnDef, columnDefsMock));
    });
  });
});
