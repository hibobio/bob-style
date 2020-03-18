import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardTableComponent } from './card-table/card-table.component';
import { CellWidthsService } from './cell-widths-service/cell-widths.service';
import { TypographyModule } from '../../typography/typography.module';
import { TableCardModule } from '../table-card/table-card.module';

@NgModule({
  declarations: [
    CardTableComponent
  ],
  imports: [
    CommonModule,
    TypographyModule,
    TableCardModule
  ],
  exports: [CardTableComponent],
  providers: [CellWidthsService]
})
export class CardTableModule {}
