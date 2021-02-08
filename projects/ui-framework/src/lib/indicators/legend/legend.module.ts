import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend.component';
import { TrackByPropModule } from '../../services/filters/trackByProp.pipe';
import { SortByPipeModule } from '../../services/filters/sortByProp.pipe';

@NgModule({
  declarations: [LegendComponent],
  exports: [LegendComponent],
  imports: [CommonModule, TrackByPropModule, SortByPipeModule],
})
export class LegendModule {}
