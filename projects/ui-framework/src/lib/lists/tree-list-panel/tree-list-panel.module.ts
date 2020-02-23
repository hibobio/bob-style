import { NgModule } from '@angular/core';
import { TreeListPanelComponent } from './tree-list-panel.component';
import { CommonModule } from '@angular/common';
import { TreeListModule } from '../tree-list/tree-list.module';
import { PanelPositionService } from '../../popups/panel/panel-position-service/panel-position.service';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [TreeListPanelComponent],
  imports: [CommonModule, OverlayModule, TreeListModule],
  exports: [TreeListPanelComponent],
  providers: [PanelPositionService],
})
export class TreeListPanelModule {}
