import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CardTableCellData,
  CardTableRowOrderChangeEvent,
} from '../card-table.interface';
import { CellWidthsService } from '../cell-widths-service/cell-widths.service';
import { CardTableComponent } from '../card-table/card-table.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

//     data: {
//       component: SquareButtonComponent,
//       attributes: {
//         type: ButtonType.tertiary,
//         icon: Icons.drag_alt,
//         color: IconColor.dark,
//         size: IconSize.small
//       }
//     }

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
  @Input() useDragHandle = false;
  @Output() rowChangedOrder: EventEmitter<
    CardTableRowOrderChangeEvent
  > = new EventEmitter<CardTableRowOrderChangeEvent>();

  constructor(protected widthsService: CellWidthsService) {
    super(widthsService);
  }

  ngOnInit(): void {
    if (this.useDragHandle) {
      this.meta.unshift({
        id: 9999,
        name: '',
        width: 5,
        sortable: false,
      });
    }
    this.setCellsStyle();
  }

  onDrop(event: CdkDragDrop<CardTableCellData[][]>) {
    console.log('onDrop');
    moveItemInArray(this.table, event.previousIndex, event.currentIndex);
    this.rowChangedOrder.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex
    });
  }
}
