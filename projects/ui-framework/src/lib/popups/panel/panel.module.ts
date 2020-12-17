import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PanelComponent } from './panel.component';
import { UtilsService } from '../../services/utils/utils.service';

@NgModule({
  declarations: [PanelComponent],
  imports: [CommonModule, OverlayModule],
  exports: [PanelComponent],
  providers: [UtilsService],
})
export class PanelModule {}
