import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from 'bob-style';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { DonutChartTextComponent } from './donut-chart-text/donut-chart-text.component';
import {LineChartComponent} from './line-chart/line-chart.component';
import {MultiBarChartComponent} from './bar-chart/multi-bar-chart/multi-bar-chart.component';
import {StackedBarChartComponent} from './bar-chart/stacked-bar-chart/stacked-bar-chart.component';
import {BarLineChartComponent} from './combinations/bar-line-chart/bar-line-chart.component';
import { BubbleChartComponent } from './bubble-chart/bubble.chart.component';

@NgModule({
  declarations: [
    PieChartComponent,
    DonutChartTextComponent,
    LineChartComponent,
    MultiBarChartComponent,
    StackedBarChartComponent,
    BarLineChartComponent,
    BubbleChartComponent,
  ],
  imports: [
    CommonModule,
    UtilsModule,
  ],
  exports: [
    PieChartComponent,
    DonutChartTextComponent,
    LineChartComponent,
    MultiBarChartComponent,
    StackedBarChartComponent,
    BarLineChartComponent,
    BubbleChartComponent,
  ]
})
export class ChartsModule {
}
