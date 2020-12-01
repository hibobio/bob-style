import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  resetFakeAsyncZone,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';
import {
  AvatarModule,
  DOMhelpers,
  fakeAsyncFlush,
  simpleChange,
} from 'bob-style';
import { cloneDeep, keys, pick } from 'lodash';
import {
  mockTranslatePipe,
  TranslateServiceProvideMock,
} from '../../../../src/lib/tests/services.stub.spec';
import { AvatarCellComponent } from '../table-cell-components/avatar-cell/avatar.component';
import {
  COLUMN_DEFS_MOCK,
  ROW_DATA_MOCK,
} from '../table-mocks/table-test.mock';
import { TableUtilsService } from '../table-utils-service/table-utils.service';
import { TableModule } from '../table.module';
import { TableComponent } from './table.component';
import { ColumnOrderStrategy, RowSelection, TableType } from './table.enum';
import { ColumnDef } from './table.interface';

import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { RowNode } from 'ag-grid-community/dist/lib/entities/rowNode';
import { RowDragEvent } from 'ag-grid-community';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let columnDefsMock: ColumnDef[] = [];
  let previousColumnDefsMock: ColumnDef[] = [];
  let rowDataMock = [];
  let spyTableUtilsService: SpyObj<TableUtilsService>;
  let spyCdr: SpyObj<ChangeDetectorRef>;
  let agRoot: HTMLElement;
  let compEl: HTMLElement;

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(async(() => {
    columnDefsMock = cloneDeep(COLUMN_DEFS_MOCK);
    rowDataMock = cloneDeep(ROW_DATA_MOCK);
    previousColumnDefsMock = [
      {
        headerName: 'Email',
        field: 'email',
        resizable: true,
        sortable: true,
      },
    ];

    spyTableUtilsService = createSpyObj('spyTableUtilsService', [
      'getGridColumnDef',
      'getOrderedFields',
    ]);
    spyTableUtilsService.getGridColumnDef.and.returnValue(columnDefsMock);
    spyTableUtilsService.getOrderedFields.and.returnValue(columnDefsMock);

    spyCdr = createSpyObj('spyCdr', ['markForChange', 'detectChanges']);

    TestBed.configureTestingModule({
      declarations: [mockTranslatePipe],
      imports: [
        NoopAnimationsModule,
        CommonModule,
        TableModule,
        AvatarModule,
        AgGridModule.withComponents([AvatarCellComponent]),
      ],
      providers: [
        { provide: TableUtilsService, useValue: spyTableUtilsService },
        TranslateServiceProvideMock(),
        DOMhelpers,
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AvatarCellComponent],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TableComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();

        spyOn(component.sortChanged, 'emit');
        spyOn(component.selectionChanged, 'emit');
        spyOn(component.rowClicked, 'emit');
        spyOn(component.gridInit, 'emit');
        spyOn(component.getColumnApi(), 'autoSizeAllColumns');

        component.ngOnChanges(
          simpleChange({
            columnDefs: columnDefsMock,
            rowData: rowDataMock,
          })
        );

        compEl = component['elRef'].nativeElement;
      });
  }));

  describe('OnInit', () => {
    it('should add type attribute', fakeAsync(() => {
      component.ngOnChanges(
        simpleChange({
          type: TableType.Secondary,
        })
      );
      flush();
      fixture.detectChanges();
      expect(compEl.dataset.type).toContain('secondary');
    }));
  });

  describe('maxHeight', () => {
    beforeEach(() => {
      agRoot = fixture.debugElement.query(By.css('ag-grid-angular'))
        ?.nativeElement;
    });

    it('should set the grid maxHeight to 336px by default', () => {
      expect(getComputedStyle(agRoot).maxHeight).toEqual('336px');
    });

    it('should set the grid maxHeight based on input maxHeight', () => {
      component.ngOnChanges(
        simpleChange({
          maxHeight: 500,
        })
      );

      expect(getComputedStyle(agRoot).maxHeight).toEqual('500px');
    });

    it('should update height if changed', () => {
      expect(getComputedStyle(agRoot).maxHeight).toEqual('336px');

      component.ngOnChanges(
        simpleChange({
          maxHeight: 600,
        })
      );

      expect(getComputedStyle(agRoot).maxHeight).toEqual('600px');
    });
  });

  describe('OnChanges', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          rowSelection: RowSelection.Single,
        })
      );
    });

    it('onSortChanged - should emit sortChanged event', fakeAsync(() => {
      component.getGridApi().setSortModel([
        {
          colId: 'fullName',
          sort: 'asc',
        },
      ]);
      tick();
      expect(component.sortChanged.emit).toHaveBeenCalledWith({
        colId: 'fullName',
        sort: 'asc',
      });
      fakeAsyncFlush();
    }));

    it('should get table columnDef from tableUtilsService', fakeAsync(() => {
      flush();

      expect(spyTableUtilsService.getGridColumnDef).toHaveBeenCalledWith(
        columnDefsMock,
        null
      );

      expect(component.gridColumnDefs).toEqual(columnDefsMock);
      fakeAsyncFlush();
    }));
  });

  describe('GridOptions', () => {
    beforeEach(() => {
      component.ngOnChanges(
        simpleChange({
          rowSelection: RowSelection.Single,
          suppressColumnVirtualisation: false,
        })
      );
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should set rowSelection as option if provided', () => {
      expect(component.gridOptions.rowSelection).toEqual(RowSelection.Single);
    });

    it('should set suppressColumnVirtualisation to input value', () => {
      expect(component.gridOptions.suppressColumnVirtualisation).toEqual(false);
    });

    it('should define gridOptions with input values and readonly values', () => {
      const expectedPartialOptions = {
        autoSizePadding: 30,
        suppressAutoSize: true,
        suppressRowClickSelection: true,
        rowHeight: 56,
        headerHeight: 56,
        rowSelection: 'single',
      };

      const actualPartialOptions = pick(
        component.gridOptions,
        keys(expectedPartialOptions)
      );

      expect(actualPartialOptions).toEqual(expectedPartialOptions);
    });
  });

  describe('onGridReady', () => {
    it('should set gridReady to true when onGridReady is triggered', () => {
      expect(component.gridReady).toBe(true);
    });

    it('should call autoSizeAllColumns when onGridReady is triggered', () => {
      expect(component.getColumnApi().autoSizeAllColumns).toHaveBeenCalled();
    });

    it('should emit gridInit event when onGridReady is triggered', () => {
      expect(component.gridInit.emit).toHaveBeenCalled();
    });
  });

  describe('getDisplayedRowCount', () => {
    it('Should call grid api getDisplayedRowCount', () => {
      spyOn(component.getGridApi(), 'getDisplayedRowCount');
      component.getDisplayedRowCount();
      expect(component.getGridApi().getDisplayedRowCount).toHaveBeenCalled();
    });
  });

  describe('onRowClicked', () => {
    it('should emit row clicked with row index and row data', fakeAsync(() => {
      tick();
      const shadowRoot: DocumentFragment = fixture.debugElement.nativeElement;
      const firstRow = shadowRoot.querySelectorAll('.ag-row')[0] as HTMLElement;
      firstRow.click();
      tick();

      expect(component.rowClicked.emit).toHaveBeenCalledWith({
        rowIndex: 0,
        data: ROW_DATA_MOCK[0],
        agGridId: '0',
      });
      fakeAsyncFlush();
    }));

    it('clickable row should have "row-clickable" selector', fakeAsync(() => {
      const shadowRoot: DocumentFragment = fixture.debugElement.nativeElement;
      const firstRow = shadowRoot.querySelectorAll('.ag-row')[0] as HTMLElement;

      expect(firstRow.className.includes('row-clickable')).toBeTruthy();
      fakeAsyncFlush();
    }));
  });

  describe('columnDefs', () => {
    it('Should call getOrderedFields with current cols from current value if no previous value provided', () => {
      component['columns'] = [];
      component.ngOnChanges(
        simpleChange({
          columnDefs: columnDefsMock,
        })
      );
      expect(spyTableUtilsService.getOrderedFields).toHaveBeenCalledWith(
        columnDefsMock,
        columnDefsMock,
        []
      );
    });

    it('Should call getOrderedFields with previous cols if previous value provided', () => {
      component['columns'] = [];
      component.ngOnChanges(
        simpleChange(
          {
            columnDefs: columnDefsMock,
          },
          false,
          {
            columnDefs: previousColumnDefsMock,
          }
        )
      );

      expect(spyTableUtilsService.getOrderedFields).toHaveBeenCalledWith(
        previousColumnDefsMock,
        columnDefsMock,
        []
      );
    });
  });

  describe('columnDefConfig', () => {
    it('Should call getOrderedFields with current cols from current value if no previous value provided', () => {
      component['columns'] = [];
      component.ngOnChanges(
        simpleChange({
          columnDefConfig: {
            columnDef: columnDefsMock,
            orderStrategy: ColumnOrderStrategy.AppendNew,
          },
        })
      );

      expect(spyTableUtilsService.getOrderedFields).toHaveBeenCalledWith(
        columnDefsMock,
        columnDefsMock,
        []
      );
    });

    it('Should call getOrderedFields with previous cols if previous value provided', () => {
      component['columns'] = [];
      component.ngOnChanges(
        simpleChange(
          {
            columnDefConfig: {
              columnDef: columnDefsMock,
              orderStrategy: ColumnOrderStrategy.AppendNew,
            },
          },
          false,
          {
            columnDefConfig: {
              columnDef: previousColumnDefsMock,
              orderStrategy: ColumnOrderStrategy.AppendNew,
            },
          }
        )
      );

      expect(spyTableUtilsService.getOrderedFields).toHaveBeenCalledWith(
        previousColumnDefsMock,
        columnDefsMock,
        []
      );
    });
  });

  describe('onSelectionChanged', () => {
    it('should select row', fakeAsync(() => {
      component.getGridApi().selectIndex(0, false, true);
      tick();
      expect(component.selectionChanged.emit).toHaveBeenCalledWith([
        ROW_DATA_MOCK[0],
      ]);
      fakeAsyncFlush();
    }));

    it('should unselect row', fakeAsync(() => {
      component.getGridApi().selectIndex(1, false, true);
      tick();
      expect(component.selectionChanged.emit).toHaveBeenCalledWith([
        ROW_DATA_MOCK[1],
      ]);

      component.getGridApi().deselectIndex(1, true);
      tick();
      expect(component.selectionChanged.emit).toHaveBeenCalledWith([]);

      fakeAsyncFlush();
    }));
  });

  describe('Table actions', () => {
    it('should add rows', () => {
      spyOn(component.getGridApi(), 'updateRowData');
      component.addRows([{ 'test:': 1 }]);

      expect(component.getGridApi().updateRowData).toHaveBeenCalledWith({
        add: [{ 'test:': 1 }],
      });
    });

    it('should update rows', () => {
      spyOn(component.getGridApi(), 'updateRowData');
      const rowData = { 'test:': 2 };
      component.updateRows([rowData]);

      expect(component.getGridApi().updateRowData).toHaveBeenCalledWith({
        update: [{ 'test:': 2 }],
      });
    });

    it('should remove rows', () => {
      spyOn(component.getGridApi(), 'updateRowData');
      component.removeRows([{ 'test:': 3 }]);

      expect(component.getGridApi().updateRowData).toHaveBeenCalledWith({
        remove: [{ 'test:': 3 }],
      });
    });
  });

  describe('filterRows', () => {
    it('Should call grid api setQuickFilter', () => {
      spyOn(component.getGridApi(), 'setQuickFilter');
      component.filterRows('test');

      expect(component.getGridApi().setQuickFilter).toHaveBeenCalledWith(
        'test'
      );
    });
  });

  describe('resetFilter', () => {
    it('Should call grid api resetQuickFilter', () => {
      spyOn(component.getGridApi(), 'resetQuickFilter');
      component.resetFilter();

      expect(component.getGridApi().resetQuickFilter).toHaveBeenCalled();
    });
  });

  describe('deselectAll', () => {
    it('Should call grid api deselectAll', () => {
      spyOn(component.getGridApi(), 'deselectAll');
      component.deselectAll();

      expect(component.getGridApi().deselectAll).toHaveBeenCalled();
    });
  });

  describe('getDisplayedRowCount', () => {
    it('Should return the column names', () => {
      expect(component.getOrderedColumnFields()).toEqual([
        'about.avatar.imageSource',
        'fullName',
        'email',
      ]);
    });
  });

  describe('onRowDragMove', () => {
    it('Should update rowData', () => {
      spyOn(component.getGridApi(), 'updateRowData').and.callFake(() => null);
      component.onRowDragMove({
        node: { id: rowDataMock[0].id, data: rowDataMock[0] } as RowNode,
        overNode: { id: rowDataMock[1].id, data: rowDataMock[1] } as RowNode,
      } as RowDragEvent);
      expect(component.rowData).toEqual([
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
          isClickable: true,
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
      ]);
      expect(rowDataMock).toEqual(ROW_DATA_MOCK);
    });

    it('Should call gridApi', () => {
      spyOn(component.getGridApi(), 'updateRowData').and.callFake(() => null);
      component.onRowDragMove({
        node: { id: rowDataMock[0].id, data: rowDataMock[0] } as RowNode,
        overNode: { id: rowDataMock[1].id, data: rowDataMock[1] } as RowNode,
      } as RowDragEvent);
      expect(component.getGridApi().updateRowData).toHaveBeenCalledWith({
        remove: [rowDataMock[0]]
      });
      expect(component.getGridApi().updateRowData).toHaveBeenCalledWith({
        add: [rowDataMock[0]],
        addIndex: 1
      });
    });
  });
});
