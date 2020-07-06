import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import {
  AvatarModule,
  ButtonsModule,
  IconsModule,
  MenuModule,
  PagerModule,
} from 'bob-style';
import { ActionsCellComponent } from './table-cell-components/actions-cell/actions-cell.component';
import { AvatarCellComponent } from './table-cell-components/avatar-cell/avatar.component';
// tslint:disable-next-line:max-line-length
import { CircleIconAndLabelComponent } from './table-cell-components/circle-icon-and-label/circle-icon-and-label.component';
// tslint:disable-next-line:max-line-length
import { TableActionsWrapperComponent } from './table-cell-components/table-actions-wrapper/table-actions-wrapper.component';
import { TableUtilsService } from './table-utils-service/table-utils.service';
import { TreeDirective } from './table/extensions/tree.directive';
import { TableComponent } from './table/table.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    TableComponent,
    AvatarCellComponent,
    ActionsCellComponent,
    TableActionsWrapperComponent,
    CircleIconAndLabelComponent,
    TreeDirective,
  ],
  providers: [TableUtilsService],
  imports: [
    CommonModule,
    DragDropModule,
    CdkTableModule,
    AvatarModule,
    ButtonsModule,
    IconsModule,
    MenuModule,
    MatTooltipModule,
    AgGridModule.withComponents([
      AvatarCellComponent,
      ActionsCellComponent,
      ActionsCellComponent,
      CircleIconAndLabelComponent,
    ]),
    IconsModule,
    PagerModule,
  ],
  exports: [
    TableComponent,
    TreeDirective,
    AvatarCellComponent,
    ActionsCellComponent,
    TableActionsWrapperComponent,
    CircleIconAndLabelComponent,
  ],
})
export class TableModule {}
