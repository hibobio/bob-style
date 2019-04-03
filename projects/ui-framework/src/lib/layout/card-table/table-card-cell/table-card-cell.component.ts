import { Component, Input } from '@angular/core';

import {
  CardTableCellData,
  CardTableCellMeta,
  CardTableCellDataType
} from '../card-table.interface';

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

  isString(val: CardTableCellDataType): boolean {
    return typeof val === 'string';
  }

  isArray(val: CardTableCellDataType): boolean {
    return Array.isArray(val);
  }

  isComponent(obj: any): boolean {
    return !!obj.component;
  }
}
