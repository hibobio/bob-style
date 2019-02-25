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

  describe('Selected rows', () => {
    it('should get select row', fakeAsync(() => {
      component.agGrid.api.selectIndex(0, true, true);
      component.agGrid.api.selectIndex(1, true, true);
      tick(1);
      expect(component.getSelectedRows()).toEqual([
        {
          fullName: 'Doron Cynsiger',
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
        {
          fullName: 'Ishai Borovoy',
          email: 'ishai.borovoy@hibob.io',
          internal: { status: 'InActive' },
          about: {
            avatar: {
              imageSource:
                'https://lumiere-a.akamaihd.net/v1/images/solo-han-solo-main_890f79bd.jpeg?region=8%2C0%2C1543%2C868&width=960'
            }
          },
          hiredDate: '2017-01-30'
        }
      ]);
    }));
  });

  describe('Table events', () => {
    it('should select row', fakeAsync(() => {
      component.agGrid.api.selectIndex(0, false, true);
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
      component.agGrid.api.selectIndex(0, false, true);
      component.agGrid.api.deselectIndex(0, true);
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
