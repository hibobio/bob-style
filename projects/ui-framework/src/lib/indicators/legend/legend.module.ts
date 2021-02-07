import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend.component';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';

@NgModule({
  declarations: [LegendComponent],
  exports: [LegendComponent],
  imports: [CommonModule, TrackByPropModule],
})
export class LegendModule {}
