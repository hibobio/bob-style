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
import { AvatarModule } from 'bob-style';
import { cloneDeep, keys, pick } from 'lodash';
import { AvatarCellComponent } from '../table-cell-components/avatar-cell/avatar.component';
import {
  COLUMN_DEFS_MOCK,
  ROW_DATA_MOCK,
} from '../table-mocks/table-test.mock';
import { TableUtilsService } from '../table-utils-service/table-utils.service';
import { TableModule } from '../table.module';
import { TableComponent } from './table.component';
import { RowSelection, TableType } from './table.enum';
import { ColumnDef } from './table.interface';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let columnDefsMock: ColumnDef[] = [];
  let rowDataMock = [];
  let spyTableUtilsService: SpyObj<TableUtilsService>;
  let spyCdr: SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    resetFakeAsyncZone();
  });

  beforeEach(async(() => {
    columnDefsMock = cloneDeep(COLUMN_DEFS_MOCK);
    rowDataMock = cloneDeep(ROW_DATA_MOCK);

    spyTableUtilsService = createSpyObj('spyTableUtilsService', [
      'getGridColumnDef',
    ]);
    spyTableUtilsService.getGridColumnDef.and.returnValue(columnDefsMock);

    spyCdr = createSpyObj('spyCdr', ['markForChange']);

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CommonModule,
        TableModule,
        AvatarModule,
        AgGridModule.withComponents([AvatarCellComponent]),
      ],
      providers: [
        { provide: TableUtilsService, useValue: spyTableUtilsService },
        { provide: ChangeDetectorRef, useValue: spyCdr },
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
        component.columnDefs = columnDefsMock;
        component.rowData = rowDataMock;
        spyOn(component.sortChanged, 'emit');
        spyOn(component.selectionChanged, 'emit');
        spyOn(component.rowClicked, 'emit');
      });
  }));

  describe('OnInit', () => {
    it('should set the grid maxHeight based on input maxHeight', () => {
      component.maxHeight = 200;
      fixture.autoDetectChanges();
      const shadowRoot: DocumentFragment = fixture.debugElement.nativeElement;
      const agRoot = shadowRoot.querySelector('.ag-root') as HTMLElement;
      expect(getComputedStyle(agRoot).maxHeight).toEqual('200px');
    });
    it('should set the grid maxHeight to 450px by default', () => {
      fixture.autoDetectChanges();
      const shadowRoot: DocumentFragment = fixture.debugElement.nativeElement;
      const agRoot = shadowRoot.querySelector('.ag-root') as HTMLElement;
      expect(getComputedStyle(agRoot).maxHeight).toEqual('450px');
    });
    it('should add class "secondary" if type is secondary', () => {
      component.type = TableType.Secondary;
      fixture.autoDetectChanges();
      const grid = fixture.debugElement.query(By.css('ag-grid-angular'));
      expect(grid.nativeElement.classList).toContain('secondary');
    });
  });

  describe('OnChanges', () => {
    describe('maxHeight', () => {
      it('should update height if changed', () => {
        fixture.autoDetectChanges();
        const shadowRoot: DocumentFragment = fixture.debugElement.nativeElement;
        let agRoot = shadowRoot.querySelector('.ag-root') as HTMLElement;
        expect(getComputedStyle(agRoot).maxHeight).toEqual('450px');
        agRoot = shadowRoot.querySelector('.ag-root') as HTMLElement;
        component.ngOnChanges({
          maxHeight: {
            previousValue: undefined,
            currentValue: 200,
            firstChange: false,
            isFirstChange: () => false,
          },
        });
        expect(getComputedStyle(agRoot).maxHeight).toEqual('200px');
      });
    });
    describe('columnDefs', () => {
      beforeEach(() => {
        component.ngOnChanges({
          columnDefs: {
            previousValue: undefined,
            currentValue: columnDefsMock,
            firstChange: false,
            isFirstChange: () => false,
          },
          rowData: {
            previousValue: undefined,
            currentValue: rowDataMock,
            firstChange: false,
            isFirstChange: () => false,
          },
          rowSelection: {
            previousValue: undefined,
            currentValue: RowSelection.Single,
            firstChange: false,
            isFirstChange: () => false,
          },
        });
      });
      describe('onSortChanged', () => {
        it('should emit sortChanged event', fakeAsync(() => {
          fixture.autoDetectChanges();
          component.agGrid.api.setSortModel([
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
          flush();
        }));
      });
      it('should get table columnDef from tableUtilsService', fakeAsync(() => {
        fixture.autoDetectChanges();
        flush();
        expect(spyTableUtilsService.getGridColumnDef).toHaveBeenCalledWith(
          columnDefsMock,
          null
        );
        expect(component.gridColumnDefs).toEqual(columnDefsMock);
      }));
      describe('GridOptions', () => {
        it('should set rowSelection as option if provided', () => {
          component.rowSelection = RowSelection.Single;
          fixture.autoDetectChanges();
          expect(component.gridOptions.rowSelection).toEqual(
            RowSelection.Single
          );
        });
        it('should set suppressColumnVirtualisation to true by default', () => {
          fixture.autoDetectChanges();
          expect(component.gridOptions.suppressColumnVirtualisation).toEqual(
            true
          );
        });
        it('should set suppressColumnVirtualisation to input value', () => {
          component.suppressColumnVirtualisation = false;
          fixture.autoDetectChanges();
          expect(component.gridOptions.suppressColumnVirtualisation).toEqual(
            false
          );
        });
        it('should define gridOptions with input values and readonly values', () => {
          fixture.autoDetectChanges();
          const expectedPartialOptions = {
            autoSizePadding: 30,
            suppressAutoSize: true,
            suppressRowClickSelection: true,
            rowHeight: 56,
            headerHeight: 56,
            rowSelection: null,
          };
          const actualPartialOptions = pick(
            component.gridOptions,
            keys(expectedPartialOptions)
          );
          expect(actualPartialOptions).toEqual(expectedPartialOptions);
        });
      });
      describe('onGridReady', () => {
        it('should set gridReady to true when onGridReady is triggered', fakeAsync(() => {
          expect(component.gridReady).toBe(false);
          fixture.autoDetectChanges();
          flush();
          expect(component.gridReady).toBe(true);
        }));
        it('should call autoSizeAllColumns when onGridReady is triggered', fakeAsync(() => {
          fixture.autoDetectChanges();
          spyOn(component.gridOptions.columnApi, 'autoSizeAllColumns');
          flush();
          expect(
            component.gridOptions.columnApi.autoSizeAllColumns
          ).toHaveBeenCalled();
        }));
        it('should call autoSizeAllColumns when onGridReady is triggered', fakeAsync(() => {
          component.shouldAutoSizeColumns = false;
          fixture.autoDetectChanges();
          spyOn(component.gridOptions.columnApi, 'autoSizeAllColumns');
          flush();
          expect(
            component.gridOptions.columnApi.autoSizeAllColumns
          ).not.toHaveBeenCalled();
        }));
        it('should emit gridInit event when onGridReady is triggered', fakeAsync(() => {
          fixture.autoDetectChanges();
          spyOn(component.gridInit, 'emit');
          flush();
          expect(component.gridInit.emit).toHaveBeenCalled();
        }));
      });
      describe('onRowClicked', () => {
        it('should emit row clicked with row index and row data', fakeAsync(() => {
          fixture.autoDetectChanges();
          tick();
          const shadowRoot: DocumentFragment =
            fixture.debugElement.nativeElement;
          const firstRow = shadowRoot.querySelectorAll(
            '.ag-row'
          )[0] as HTMLElement;
          firstRow.click();
          tick();
          expect(component.rowClicked.emit).toHaveBeenCalledWith({
            rowIndex: 0,
            data: ROW_DATA_MOCK[0],
            agGridId: '0',
          });
          flush();
        }));

        it('clickable row should have "row-clickable" selector', fakeAsync(() => {
          fixture.autoDetectChanges();
          const shadowRoot: DocumentFragment =
            fixture.debugElement.nativeElement;
          const firstRow = shadowRoot.querySelectorAll(
            '.ag-row'
          )[0] as HTMLElement;
          expect(firstRow.className.includes('row-clickable')).toBeTruthy();
          flush();
        }));
      });
    });
  });

  describe('onSelectionChanged', () => {
    it('should select row', fakeAsync(() => {
      fixture.autoDetectChanges();
      component.agGrid.api.selectIndex(0, false, true);
      tick();
      expect(component.selectionChanged.emit).toHaveBeenCalledWith([
        ROW_DATA_MOCK[0],
      ]);
      flush();
    }));
    it('should unselect row', fakeAsync(() => {
      fixture.autoDetectChanges();

      component.agGrid.api.selectIndex(1, false, true);
      tick();
      expect(component.selectionChanged.emit).toHaveBeenCalledWith([
        ROW_DATA_MOCK[1],
      ]);

      component.agGrid.api.deselectIndex(1, true);
      tick();
      expect(component.selectionChanged.emit).toHaveBeenCalledWith([]);

      flush();
    }));
  });

  describe('Table actions', () => {
    it('should add rows', () => {
      fixture.autoDetectChanges();
      spyOn(component.agGrid.api, 'updateRowData');
      component.addRows([{ 'test:': 1 }]);
      expect(component.agGrid.api.updateRowData).toHaveBeenCalledWith({
        add: [{ 'test:': 1 }],
      });
    });
    it('should update rows', () => {
      fixture.autoDetectChanges();
      spyOn(component.agGrid.api, 'updateRowData');
      const rowData = { 'test:': 2 };
      component.updateRows([rowData]);
      expect(component.agGrid.api.updateRowData).toHaveBeenCalledWith({
        update: [{ 'test:': 2 }],
      });
    });
    it('should remove rows', () => {
      fixture.autoDetectChanges();
      spyOn(component.agGrid.api, 'updateRowData');
      component.removeRows([{ 'test:': 3 }]);
      expect(component.agGrid.api.updateRowData).toHaveBeenCalledWith({
        remove: [{ 'test:': 3 }],
      });
    });
  });

  describe('filterRows', () => {
    it('Should call grid api setQuickFilter', () => {
      fixture.autoDetectChanges();
      spyOn(component.agGrid.api, 'setQuickFilter');
      component.filterRows('test');
      expect(component.agGrid.api.setQuickFilter).toHaveBeenCalledWith('test');
    });
  });

  describe('resetFilter', () => {
    it('Should call grid api resetQuickFilter', () => {
      fixture.autoDetectChanges();
      spyOn(component.agGrid.api, 'resetQuickFilter');
      component.resetFilter();
      expect(component.agGrid.api.resetQuickFilter).toHaveBeenCalled();
    });
  });

  describe('deselectAll', () => {
    it('Should call grid api deselectAll', () => {
      fixture.autoDetectChanges();
      spyOn(component.agGrid.api, 'deselectAll');
      component.deselectAll();
      expect(component.agGrid.api.deselectAll).toHaveBeenCalled();
    });
  });

  describe('getDisplayedRowCount', () => {
    it('Should call grid api getDisplayedRowCount', () => {
      fixture.autoDetectChanges();
      spyOn(component.agGrid.api, 'getDisplayedRowCount');
      component.getDisplayedRowCount();
      expect(component.agGrid.api.getDisplayedRowCount).toHaveBeenCalled();
    });
  });

  describe('getDisplayedRowCount', () => {
    xit('Should return the column names', () => {
      component.ngOnInit();
      component.gridOptions.columnDefs = [
        { field: '1' },
        { field: '2' },
        { field: '3' },
      ];
      fixture.autoDetectChanges();
      expect(component.getOrderedColumnFields()).toEqual(['1', '2', '3']);
    });
  });
});
