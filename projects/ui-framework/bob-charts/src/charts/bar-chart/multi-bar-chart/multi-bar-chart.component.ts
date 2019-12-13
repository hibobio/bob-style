import {ChangeDetectorRef, Component, Input, NgZone, OnChanges, SimpleChanges} from '@angular/core';
import {ChartTypesEnum} from '../../chart/chart.enum';
import {SeriesColumnOptions} from 'highcharts';
import {ChartCore} from '../../chart/chart-core';

@Component({
  selector: 'b-multi-bar-chart',
  templateUrl: '../../chart/chart.component.html',
  styleUrls: [
    '../../chart/chart.component.scss',
    './multi-bar-chart.component.scss'
  ]
})
export class MultiBarChartComponent extends ChartCore implements OnChanges {
  type = ChartTypesEnum.Column;
  @Input() categories: string[];
  @Input() data: SeriesColumnOptions[];
  @Input() name: string;
  constructor(
    public zone: NgZone,
    public cdr: ChangeDetectorRef
  ) {
    super(zone, cdr);
    this.height = 450;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartOptions();
    this.applyOnChange();
  }

  private updateChartOptions() {
    this.chartOptions = {
      chart: {
        height: Math.abs(this.height)
      },
      xAxis: {
        categories: this.categories,
        crosshair: true
      },
      series: this.data
    };
  }
}
