import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCardCellComponent } from '../table-card-cell/table-card-cell/table-card-cell.component';
import { TruncateTooltipModule } from '../../popups/truncate-tooltip/truncate-tooltip.module';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';



@NgModule({
  declarations: [TableCardCellComponent],
  imports: [
    CommonModule,
    TruncateTooltipModule,
    ComponentRendererModule,
  ],
  exports: [TableCardCellComponent]
})
export class TableCardCellModule { }
