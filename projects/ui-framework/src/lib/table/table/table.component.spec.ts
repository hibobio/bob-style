import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.columnDefs = mockColumnsDefs;
    component.rowData = mockRowData;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
