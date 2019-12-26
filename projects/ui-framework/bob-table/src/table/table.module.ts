import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { AgGridModule } from 'ag-grid-angular';
import { AvatarCellComponent } from './table-cell-components/avatar-cell/avatar.component';
import { TableUtilsService } from './table-utils-service/table-utils.service';
import { ActionsCellComponent } from './table-cell-components/actions-cell/actions-cell.component';
import { AvatarModule, ButtonsModule, IconsModule, MenuModule, } from 'bob-style';
// tslint:disable-next-line:max-line-length
import { TableActionsWrapperComponent } from './table-cell-components/table-actions-wrapper/table-actions-wrapper.component';
// tslint:disable-next-line:max-line-length
import { CircleIconAndLabelComponent } from './table-cell-components/circle-icon-and-label/circle-icon-and-label.component';

@NgModule({
  declarations: [
    TableComponent,
    AvatarCellComponent,
    ActionsCellComponent,
    TableActionsWrapperComponent,
    CircleIconAndLabelComponent,
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
    AgGridModule.withComponents([
      AvatarCellComponent,
      ActionsCellComponent,
      ActionsCellComponent,
      CircleIconAndLabelComponent,
    ]),
    IconsModule,
  ],
  exports: [
    TableComponent,
    AvatarCellComponent,
    ActionsCellComponent,
    TableActionsWrapperComponent,
    CircleIconAndLabelComponent,
  ],
})
export class TableModule {}
