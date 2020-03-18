import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCardComponent } from './table-card/table-card.component';
import { TableCardCellModule } from '../table-card-cell/table-card-cell.module';



@NgModule({
  declarations: [TableCardComponent],
  imports: [
    CommonModule,
    TableCardCellModule
  ],
  exports: [TableCardComponent]
})
export class TableCardModule { }
