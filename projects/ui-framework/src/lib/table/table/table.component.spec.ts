import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { mockColumnsDefs, mockRowData } from '../table.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TableModule } from '../table.module';
import { AvatarCellComponent } from './avatar.component';
import { AgGridModule } from 'ag-grid-angular';
import { RowSelectionEventType } from './table.interface';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
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
      .compileComponents().then(
      () => {
        fixture = TestBed.createComponent(TableComponent);
        component = fixture.componentInstance;
        component.columnDefs = mockColumnsDefs;
        component.rowData = mockRowData;
        component.ngOnInit();
        fixture.detectChanges();
        spyOn(component.sortChanged, 'emit');
        spyOn(component.rowSelected, 'emit');
        spyOn(component.rowClicked, 'emit');
      }
    );
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Table events', () => {
    it('should select row', fakeAsync(() => {
      component.agGrid.api.selectNode(component.agGrid.api.getRowNode('1'));
      tick(1);
      expect(component.rowSelected.emit).toHaveBeenCalledWith({
        rowIndex: 0,
        type: RowSelectionEventType.Select,
        data: { fullName: 'Doron Cynsiger',
                email: 'doron.cynsiger@hibob.io',
                internal: { status: 'Active' },
                about: {
                  avatar: {
                      imageSource:
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvWogj6uHgdZ8ovMF6cYShBGxsOvfk0xv1GB6rxwAP7ABAivC6'
                  }
                },
                hiredDate: '2017-02-29'
        },
      });
    }));
    it('should unselect row', fakeAsync(() => {
      component.agGrid.api.selectNode(component.agGrid.api.getRowNode('1'));
      component.agGrid.api.deselectNode(component.agGrid.api.getRowNode('1'));
      tick(1);
      expect(component.rowSelected.emit).toHaveBeenCalledWith({
        rowIndex: 0,
        type: RowSelectionEventType.Unselect,
        data: { fullName: 'Doron Cynsiger',
          email: 'doron.cynsiger@hibob.io',
          internal: { status: 'Active' },
          about: {
            avatar: {
              imageSource:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvWogj6uHgdZ8ovMF6cYShBGxsOvfk0xv1GB6rxwAP7ABAivC6'
            }
          },
          hiredDate: '2017-02-29'
        },
      });
    }));
    it('should sort column', fakeAsync(() => {
      component.agGrid.api.setSortModel([
        {
          colId: 'fullName',
          sort: 'asc'
        },
      ]);
      tick(1);
      expect(component.sortChanged.emit).toHaveBeenCalledWith({
        colId: 'fullName',
        sort: 'asc'
      });
    }));
  });
});
