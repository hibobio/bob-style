import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  NgZone,
} from '@angular/core';
import { ChartCore } from '../../chart/chart-core';
import { SeriesOptionsType } from 'highcharts';
import { merge } from 'lodash';
import { ChartTypesEnum } from '../../chart/chart.enum';

@Component({
  selector: 'b-bar-line-chart',
  templateUrl: '../../chart/chart.component.html',
  styleUrls: ['../../chart/chart.component.scss'],
})
export class BarLineChartComponent extends ChartCore implements OnChanges {
  type: ChartTypesEnum = ChartTypesEnum.Column;
  @Input() categories: string[];
  @Input() stacked = false;
  @Input() stackedPercent = false;
  @Input() data: SeriesOptionsType[];
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
    const COLUMN_BAR_WIDTH = {
      pointPadding: 0.1,
      groupPadding: 0.08,
    };
    const MULTI_COLUMN_WIDTH = {
      pointPadding: 0.1,
      groupPadding: 0.2,
    };

    this.chartOptions = merge(
      {
        chart: {
          height: Math.abs(this.height),
        },
        xAxis: {
          categories: this.categories,
        },
        series: this.data.map((dataSet: any) => {
          dataSet.showInLegend = this.legend;
          dataSet.dataLabels = {
            enabled: this.showDataLabels,
          };
          return dataSet as SeriesOptionsType[];
        }),
        plotOptions: {
          column: this.stacked
            ? this.stackedPercent
              ? { ...COLUMN_BAR_WIDTH, stacking: 'percent' }
              : { ...COLUMN_BAR_WIDTH, stacking: 'normal' }
            : { ...MULTI_COLUMN_WIDTH, stacking: undefined },
        },
      },
      this.extraOptions
    );
  }
}
