import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellComponent } from './table-cell.component';
import { mockColumns } from '../table.mock';
import { AvatarComponent, AvatarModule } from '../../buttons-indicators/avatar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('TableCellComponent', () => {
  let component: TableCellComponent;
  let fixture: ComponentFixture<TableCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCellComponent ],
      imports: [ AvatarModule ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ AvatarComponent ],
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellComponent);
    component = fixture.componentInstance;
    component.column = mockColumns[0];
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
