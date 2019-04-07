import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableCardCellComponent } from './table-card-cell/table-card-cell.component';
import { TableCardComponent } from './table-card/table-card.component';
import { CardTableComponent } from './card-table/card-table.component';
import { CellWidthsService } from './cell-widths-service/cell-widths.service';
import { ComponentRendererComponent } from '../../services/component-renderer/component-renderer.component';

@NgModule({
  declarations: [
    TableCardCellComponent,
    TableCardComponent,
    CardTableComponent,
    ComponentRendererComponent
  ],
  imports: [CommonModule],
  exports: [CardTableComponent],
  providers: [CellWidthsService]
})
export class CardTableModule {}
