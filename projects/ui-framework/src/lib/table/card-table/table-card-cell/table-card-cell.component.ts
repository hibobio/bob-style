import { Component, Input } from '@angular/core';

import {
  CardTableCellData,
  CardTableCellDataType,
} from '../card-table.interface';
import {
  isString,
  isArray,
  isRenderedComponent,
} from '../../../services/utils/functional-utils';
import { TruncateTooltipType } from '../../../popups/truncate-tooltip/truncate-tooltip.enum';
import { RenderedComponent } from '../../../services/component-renderer/component-renderer.interface';

@Component({
  selector: 'b-table-card-cell, [b-table-card-cell]',
  templateUrl: './table-card-cell.component.html',
  styleUrls: ['./table-card-cell.component.scss'],
})
export class TableCardCellComponent {
  constructor() {}

  @Input() cell: CardTableCellData;
  @Input() index: number;

  ifString = isString;
  ifArray = isArray;
  ifComponent = isRenderedComponent;
  readonly tooltipType = TruncateTooltipType;

  onComponentClick($event: any, cell: CardTableCellDataType): void {
    if ((cell as RenderedComponent).handlers) {
      $event.stopPropagation();
    }
  }

  trackByIndex(index: number, data: string): number {
    return index;
  }
}
