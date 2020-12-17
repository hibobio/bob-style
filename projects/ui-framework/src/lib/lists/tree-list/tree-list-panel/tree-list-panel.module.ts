import { NgModule } from '@angular/core';
import { TreeListPanelComponent } from './tree-list-panel.component';
import { CommonModule } from '@angular/common';
import { TreeListModule } from '../tree-list/tree-list.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { ListPanelService } from '../../list-panel.service';

@NgModule({
  declarations: [TreeListPanelComponent],
  imports: [CommonModule, OverlayModule, TreeListModule],
  exports: [TreeListPanelComponent],
  providers: [ListPanelService],
})
export class TreeListPanelModule {}
