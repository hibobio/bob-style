import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
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
export class CardTableSortableComponent extends CardTableComponent
  implements OnInit {
  @HostBinding('attr.data-has-drag-handle') @Input() useDragHandle = false;
  @Output() rowChangedOrder: EventEmitter<
    CardTableRowOrderChangeEvent
  > = new EventEmitter<CardTableRowOrderChangeEvent>();

  constructor(protected widthsService: CellWidthsService) {
    super(widthsService);
  }

  public readonly icons = Icons;
  public readonly iconSize = IconSize;
  public readonly iconColor = IconColor;

  ngOnInit(): void {
    this.setCellsStyle();
  }

  onDrop(event: CdkDragDrop<CardTableCellData[][]>): void {
    moveItemInArray(this.table, event.previousIndex, event.currentIndex);
    this.rowChangedOrder.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
    });
  }
}
