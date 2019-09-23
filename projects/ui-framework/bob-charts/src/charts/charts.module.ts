import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from 'bob-style';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { DonutChartTextComponent } from './donut-chart-text/donut-chart-text.component';

@NgModule({
  declarations: [
    PieChartComponent,
    DonutChartTextComponent
  ],
  imports: [
    CommonModule,
    UtilsModule,
  ],
  exports: [
    PieChartComponent,
    DonutChartTextComponent
  ]
})
export class ChartsModule {
}
