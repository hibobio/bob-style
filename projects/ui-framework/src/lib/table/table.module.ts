import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import {
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TableCellComponent } from './table-cell/table-cell.component';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [TableComponent, TableCellComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatMenuModule,
    DragDropModule,
    CdkTableModule,
  ],
  exports: [TableComponent],
})
export class TableModule { }
