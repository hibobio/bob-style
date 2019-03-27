import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { TableModule } from '../table.module';
import { AvatarCellComponent } from '../table-cell-components/avatar.component';
import { AgGridModule } from 'ag-grid-angular';
import { ColumnDef, PinDirection, SortDirections } from './table.interface';
import { By } from '@angular/platform-browser';
import { DebugElement, getDebugNode } from '@angular/core';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let columnDefsMock: ColumnDef[] = [];
  let rowDataMock = [];

  beforeEach(async(() => {
    columnDefsMock = [
      {
        headerName: '',
        field: 'about.avatar',
        pinned: PinDirection.Left,
        lockPosition: true,
        resizable: false,
        sortable: false,
      },
      {
        headerName: 'Display Name',
        field: 'fullName',
        sort: SortDirections.Asc,
        resizable: true,
        'sortable': true,
      },
      {
        headerName: 'Email',
        field: 'email',
        resizable: true,
        sortable: true,
      },
    ];

    rowDataMock = [
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

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CommonModule,
        TableModule,
        AgGridModule,
        AvatarModule,
        AgGridModule.withComponents([AvatarCellComponent])]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [AvatarCellComponent]
        }
      })
      .compileComponents()
      .then(
        () => {
          fixture = TestBed.createComponent(TableComponent);
          component = fixture.componentInstance;
          component.columnDefs = columnDefsMock;
          component.rowData = rowDataMock;
          fixture.autoDetectChanges();
          // spyOn(component.sortChanged, 'emit');
          // spyOn(component.rowClicked, 'emit');
        }
      );
  }));

  describe('OnInit', () => {
    it('should set the grid maxHeight based on input maxHeight', () => {
      // const agGrid = fixture.debugElement.query(By.css('ag-grid-angular'));
      // const agRoot = fixture.debugElement.query(By.css('.ag-root'));
      // const agRoot2 = fixture.debugElement.queryAll(By.css('.ag-root-wrapper'));
      // console.log('a', component);

      // const a = getDebugNode(agGrid.nativeElement) as DebugElement;
      // const agRoot = a.query(By.css('.ag-root'));
      // expect(1 === 1).toBeTruthy();
    });
  });

  // describe('Table events', () => {
  //   it('should select row', fakeAsync(() => {
  //     component.agGrid.api.selectIndex(0, false, true);
  //     tick(1);
  //     expect(component.rowSelected.emit).toHaveBeenCalledWith({
  //       rowIndex: 0,
  //       type: RowSelectionEventType.Select,
  //       data: { fullName: 'Doron Cynsiger',
  //               email: 'doron.cynsiger@hibob.io',
  //               internal: { status: 'Active' },
  //               about: {
  //                 avatar: {
  //                     imageSource:
  //                       'img_url1.jpg',
  //                 }
  //               },
  //
  //       },
  //     });
  //   }));
  //   it('should unselect row', fakeAsync(() => {
  //     component.agGrid.api.selectIndex(0, false, true);
  //     component.agGrid.api.deselectIndex(0, true);
  //     tick(1);
  //     expect(component.rowSelected.emit).toHaveBeenCalledWith({
  //       rowIndex: 0,
  //       type: RowSelectionEventType.Unselect,
  //       data: { fullName: 'Doron Cynsiger',
  //         email: 'doron.cynsiger@hibob.io',
  //         internal: { status: 'Active' },
  //         about: {
  //           avatar: {
  //             imageSource:
  //               'img_url1.jpg',
  //           }
  //         },
  //
  //       },
  //     });
  //   }));
  //   it('should sort column', fakeAsync(() => {
  //     component.agGrid.api.setSortModel([
  //       {
  //         colId: 'fullName',
  //         sort: 'asc'
  //       },
  //     ]);
  //     tick(1);
  //     expect(component.sortChanged.emit).toHaveBeenCalledWith({
  //       colId: 'fullName',
  //       sort: 'asc'
  //     });
  //   }));
  // });
});
