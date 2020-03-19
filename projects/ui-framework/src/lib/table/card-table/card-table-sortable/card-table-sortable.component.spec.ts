import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CardTableSortableComponent } from './card-table-sortable.component';
import { DragDropRegistry, DragDropModule } from '@angular/cdk/drag-drop';

describe('CardTableSortableComponent', () => {
  let component: CardTableSortableComponent;
  let fixture: ComponentFixture<CardTableSortableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardTableSortableComponent],
      imports: [

      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardTableSortableComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
