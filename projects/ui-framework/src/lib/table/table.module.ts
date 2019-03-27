import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { AgGridModule } from 'ag-grid-angular';
import { AvatarModule } from '../../public_api';
import { AvatarCellComponent } from './table-cell-components/avatar.component';
import { TableUtilsService } from './table-utils-service/table-utils.service';


@NgModule({
  declarations: [
    TableComponent,
    AvatarCellComponent,
  ],
  providers: [
    TableUtilsService,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    CdkTableModule,
    AvatarModule,
    AgGridModule,
    AgGridModule.withComponents([AvatarCellComponent])
  ],
  exports: [
    TableComponent,
  ],
})
export class TableModule { }
