import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleBarChartComponent } from './simple-bar-chart.component';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';

@NgModule({
  imports: [CommonModule],
  declarations: [SimpleBarChartComponent],
  exports: [SimpleBarChartComponent],
  providers: [EventManagerPlugins[0]],
})
export class SimpleBarChartModule {}
