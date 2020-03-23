import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  CardTableCellData,
  CardTableRowOrderChangeEvent,
} from '../card-table.interface';
import { CellWidthsService } from '../cell-widths-service/cell-widths.service';
import { CardTableComponent } from '../card-table/card-table.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';

@Component({
  selector: 'b-card-table-sortable',
  templateUrl: './card-table-sortable.component.html',
  styleUrls: [
    './card-table-sortable.component.scss',
    './../card-table/card-table.component.scss',
  ],
})
export class CardTableSortableComponent extends CardTableComponent {
  @Input() useDragHandle = false;
  @Input() disableDragging = false;
  @Output() rowOrderChanged: EventEmitter<
    CardTableRowOrderChangeEvent
  > = new EventEmitter<CardTableRowOrderChangeEvent>();

  constructor(protected widthsService: CellWidthsService) {
    super(widthsService);
  }

  public readonly icons = Icons;
  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;

  onDrop(event: CdkDragDrop<CardTableCellData[][]>): void {
    moveItemInArray(this.table, event.previousIndex, event.currentIndex);
    this.rowOrderChanged.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
    });
  }
}
