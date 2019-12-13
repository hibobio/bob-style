import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
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
  @Input() data: SeriesOptionsType[];
  @Input() name: string;
  constructor(public zone: NgZone, public cdr: ChangeDetectorRef) {
    super(zone, cdr);
    this.height = 450;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartOptions();
    this.applyOnChange();
  }

  private updateChartOptions() {
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
      },
      { ...this.extraOptions }
    );
  }
}
