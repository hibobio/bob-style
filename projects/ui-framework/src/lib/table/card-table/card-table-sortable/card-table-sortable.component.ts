import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Icon } from '../../../icons/icon.interface';
import { IconColor, Icons, IconSize } from '../../../icons/icons.enum';
import {
  CardTableCellData,
  CardTableRowOrderChangeEvent,
} from '../card-table.interface';
import { CardTableComponent } from '../card-table/card-table.component';
import { CellWidthsService } from '../cell-widths-service/cell-widths.service';

@Component({
  selector: 'b-card-table-sortable',
  templateUrl: './card-table-sortable.component.html',
  styleUrls: [
    './card-table-sortable.component.scss',
    './../card-table/card-table.component.scss',
  ],
  providers: [CellWidthsService],
})
export class CardTableSortableComponent extends CardTableComponent {
  @Input() useDragHandle = false;
  @Input() disableDragging = false;
  @Output()
  rowOrderChanged: EventEmitter<CardTableRowOrderChangeEvent> = new EventEmitter();

  constructor(protected widthsService: CellWidthsService) {
    super(widthsService);
  }

  readonly dragIcn: Icon = {
    icon: Icons.drag_alt,
    color: IconColor.light,
    size: IconSize.small,
  };

  onDrop(event: CdkDragDrop<CardTableCellData[][]>): void {
    moveItemInArray(this.table, event.previousIndex, event.currentIndex);
    this.rowOrderChanged.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
    });
  }
}
