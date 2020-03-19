import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CardTableSortableComponent } from './card-table-sortable.component';
import { DragDropRegistry, DragDropModule } from '@angular/cdk/drag-drop';
import { TruncateTooltipModule } from '../../../popups/truncate-tooltip/truncate-tooltip.module';
import { IconsModule } from '../../../icons/icons.module';
import { CellWidthsService } from 'bob-style';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardTableMockData, CardTableMockMetaData } from '../card-table.mock';

describe('CardTableSortableComponent', () => {
  let component: CardTableSortableComponent;
  let fixture: ComponentFixture<CardTableSortableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardTableSortableComponent],
      imports: [TruncateTooltipModule, DragDropModule, IconsModule],
      providers: [CellWidthsService],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardTableSortableComponent);
        component = fixture.componentInstance;
        component.meta = CardTableMockMetaData;
        component.table = CardTableMockData;
      });
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
