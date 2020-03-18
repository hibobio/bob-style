import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardTableSortableComponent } from './card-table-sortable/card-table-sortable.component';
import { CellWidthsService } from '../card-table/cell-widths-service/cell-widths.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TypographyModule } from '../../typography/typography.module';
import { TableCardModule } from '../table-card/table-card.module';

@NgModule({
  declarations: [CardTableSortableComponent],
  imports: [
    CommonModule,
    TypographyModule,
    TableCardModule,
    DragDropModule
  ],
  exports: [CardTableSortableComponent],
  providers: [CellWidthsService]
})
export class CardTableSortableModule { }
