import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { AgGridModule } from 'ag-grid-angular';
import { AvatarCellComponent } from './table-cell-components/avatar-cell/avatar.component';
import { TableUtilsService } from './table-utils-service/table-utils.service';
import { ActionsCellComponent } from './table-cell-components/actions-cell/actions-cell.component';
import { AvatarModule, ButtonsModule, MenuModule } from 'bob-style';
// tslint:disable-next-line:max-line-length
import { TableActionsWrapperComponent } from './table-cell-components/table-actions-wrapper/table-actions-wrapper.component';

@NgModule({
  declarations: [
    TableComponent,
    AvatarCellComponent,
    ActionsCellComponent,
    TableActionsWrapperComponent,
  ],
  providers: [TableUtilsService],
  imports: [
    CommonModule,
    DragDropModule,
    CdkTableModule,
    AvatarModule,
    AgGridModule,
    ButtonsModule,
    MenuModule,
    AgGridModule.withComponents([AvatarCellComponent, ActionsCellComponent, ActionsCellComponent]),
  ],
  exports: [TableComponent, AvatarCellComponent, ActionsCellComponent, TableActionsWrapperComponent],
})
export class TableModule {}
