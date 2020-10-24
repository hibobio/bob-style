import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  NgZone,
} from '@angular/core';
import { ChartTypesEnum } from '../../charts.enum';
import { SeriesColumnOptions } from 'highcharts';
import { ChartCore } from '../../chart/chart-core';

@Component({
  selector: 'b-multi-bar-chart',
  templateUrl: '../../chart/chart.component.html',
  styleUrls: [
    '../../chart/chart.component.scss',
    './multi-bar-chart.component.scss',
  ],
})
export class MultiBarChartComponent extends ChartCore implements OnChanges {
  constructor(public cdr: ChangeDetectorRef, public zone: NgZone) {
    super(cdr, zone);
    this.sizeDefaults[0] = 450;
  }

  @Input() categories: string[];
  @Input() data: SeriesColumnOptions[];
  @Input() name: string;

  readonly type = ChartTypesEnum.Column;

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

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
        crosshair: true,
      },
      series: this.data,
    };
  }
}
