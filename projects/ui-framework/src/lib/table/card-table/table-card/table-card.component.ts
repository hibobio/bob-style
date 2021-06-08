import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  cardTableAllowedCellStyles,
  CardTableCellClickEvent,
  CardTableCellData,
  CardTableCellMeta,
} from '../card-table.interface';

@Component({
  selector: 'b-table-card, [b-table-card]',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
})
export class TableCardComponent {
  constructor() {}

  @Input() meta: CardTableCellMeta[];
  @Input() row: CardTableCellData[];
  @Input() rowIndex: number;
  @Input() style: cardTableAllowedCellStyles[];
  @Output()
  cellClicked?: EventEmitter<CardTableCellClickEvent> = new EventEmitter();

  onCellClicked(cell: CardTableCellData, index: number): void {
    this.cellClicked.emit({
      cell: cell,
      cellIndex: index,
      rowIndex: this.rowIndex,
    });
  }

  trackByIndex(index: number, cell: CardTableCellData): number {
    return index;
  }
}
