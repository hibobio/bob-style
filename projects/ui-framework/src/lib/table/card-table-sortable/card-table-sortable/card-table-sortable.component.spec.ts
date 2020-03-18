import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTableSortableComponent } from './card-table-sortable.component';

describe('CardTableSortableComponent', () => {
  let component: CardTableSortableComponent;
  let fixture: ComponentFixture<CardTableSortableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTableSortableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTableSortableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
