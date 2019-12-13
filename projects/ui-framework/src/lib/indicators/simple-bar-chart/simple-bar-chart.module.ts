import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleBarChartComponent } from './simple-bar-chart.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SimpleBarChartComponent],
  exports: [SimpleBarChartComponent]
})
export class SimpleBarChartModule {}
