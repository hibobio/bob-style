import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableActionsWrapperComponent } from './table-actions-wrapper.component';

describe('TableActionsWrapperComponent', () => {
  let component: TableActionsWrapperComponent;
  let fixture: ComponentFixture<TableActionsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableActionsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableActionsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
