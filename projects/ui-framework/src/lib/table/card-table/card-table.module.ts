import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableCardCellComponent } from './table-card-cell/table-card-cell.component';
import { TableCardComponent } from './table-card/table-card.component';
import { CardTableComponent } from './card-table/card-table.component';
import { CellWidthsService } from './cell-widths-service/cell-widths.service';
import { TypographyModule } from '../../typography/typography.module';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardTableSortableComponent } from './card-table-sortable/card-table-sortable.component';
import { IconsModule } from '../../icons/icons.module';

@NgModule({
  declarations: [
    TableCardCellComponent,
    TableCardComponent,
    CardTableComponent,
    CardTableSortableComponent
  ],
  imports: [
    CommonModule,
    TypographyModule,
    ComponentRendererModule,
    TruncateTooltipModule,
    DragDropModule,
    IconsModule,
  ],
  exports: [CardTableComponent, CardTableSortableComponent],
  providers: [CellWidthsService]
})
export class CardTableModule {}
