import { Component, Input } from '@angular/core';

import { CardTableCellData, CardTableCellMeta } from '../card-table.interface';

@Component({
  selector: 'b-table-card-cell, [b-table-card-cell]',
  templateUrl: './table-card-cell.component.html',
  styleUrls: ['./table-card-cell.component.scss']
})
export class TableCardCellComponent {
  constructor() {}

  @Input() meta: CardTableCellMeta;
  @Input() cell: CardTableCellData;
  @Input() index: number;

  isComponent(obj: any): boolean {
    return !!obj.component;
  }

  asArray(data: CardTableCellData) {
    return Array.isArray(data)
      ? data
      : typeof data === 'string'
      ? [data]
      : null;
  }
}
