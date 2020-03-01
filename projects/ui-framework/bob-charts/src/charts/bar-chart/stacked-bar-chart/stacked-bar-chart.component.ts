import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  NgZone,
} from '@angular/core';
import { ChartTypesEnum } from '../../chart/chart.enum';
import { SeriesColumnOptions } from 'highcharts';
import { ChartCore } from '../../chart/chart-core';

@Component({
  selector: 'b-stacked-bar-chart',
  templateUrl: '../../chart/chart.component.html',
  styleUrls: [
    '../../chart/chart.component.scss',
    './stacked-bar-chart.component.scss',
  ],
})
export class StackedBarChartComponent extends ChartCore implements OnChanges {
  type = ChartTypesEnum.Column;
  @Input() categories: string[];
  @Input() data: SeriesColumnOptions[];
  @Input() stackedDataLabels = true;
  @Input() name: string;
  constructor(public cdr: ChangeDetectorRef, public zone: NgZone) {
    super(cdr, zone);
    this.height = 450;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartOptions();
    this.applyOnChange();
  }

  private updateChartOptions() {
    this.chartOptions = {
      chart: {
        height: Math.abs(this.height),
      },
      xAxis: {
        categories: this.categories,
      },
      yAxis: {
        stackLabels: {
          enabled: this.stackedDataLabels,
          style: {
            fontWeight: 'bold',
            color: '#535353',
          },
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0.15,
          groupPadding: 0,
          stacking: 'normal',
        },
      },
      series: this.data,
    };
  }
}
