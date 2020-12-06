import { ChangeDetectorRef, Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { ChartTypesEnum } from '../../charts.enum';
import { SeriesColumnOptions } from 'highcharts';
import { ChartCore } from '../../chart/chart-core';
import { COLUMN_BAR_WIDTH, MULTI_COLUMN_WIDTH } from '../../charts.const';

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

  type: ChartTypesEnum.Column | ChartTypesEnum.Bar = ChartTypesEnum.Column;
  @Input() set direction(direction: 'vertical' | 'horizontal') {
    this.type = direction === 'horizontal' ? ChartTypesEnum.Bar : ChartTypesEnum.Column;
  }
  @Input() categories: string[];
  @Input() stackType: 'normal' | 'stack' | 'stack-percent' = 'normal';
  @Input() data: SeriesColumnOptions[];
  @Input() name: string;


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
      plotOptions: {
        [this.type]: this.getChartPlotOptionsObj(),
      },
      series: this.data,
    };
  }

  private getChartPlotOptionsObj() {
    let plotOptionsObj;
    switch (this.stackType) {
      case 'stack':
        plotOptionsObj = { ...COLUMN_BAR_WIDTH, stacking: 'normal' };
        break;
      case 'stack-percent':
        plotOptionsObj = { ...COLUMN_BAR_WIDTH, stacking: 'percent' };
        break;
      default: // 'normal' or any other
        plotOptionsObj = { ...MULTI_COLUMN_WIDTH, stacking: undefined };
        break;
    }
    return plotOptionsObj;
  }
}
