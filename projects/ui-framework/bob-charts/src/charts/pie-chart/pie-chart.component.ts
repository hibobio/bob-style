import {ChangeDetectorRef, Component, Input, NgZone, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {ChartCore} from '../chart/chart-core';
import {ChartTypesEnum} from '../chart/chart.enum';
import {SeriesPieDataOptions} from 'highcharts';

export const minDonutWidth = 3, pieLegendHeight = 37, piePadding = 50;
@Component({
  selector: 'b-pie-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: [
    '../chart/chart.component.scss',
  ],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent extends ChartCore implements OnChanges {
  type = ChartTypesEnum.Pie;
  @Input() data: SeriesPieDataOptions[];
  @Input() name: string;
  @Input() donut = false;
  @Input() donutInnerSize = 60;
  @Input() donutWidth: number;
  constructor(
    public zone: NgZone,
    public cdr: ChangeDetectorRef
  ) {
    super(zone, cdr);
    this.height = 150;
  }

  updateChartOptions() {
    this.chartOptions = {
      chart: {
        height: Math.abs(this.height)
      },
      plotOptions: {
        pie: {
          innerSize: null,
          depth: null
        }
      },
      lang: {
        noData: '' // overrides no data alert
      },
      series: [
        {
          type: 'pie',
          name: this.name,
          data: this.data
        }
      ]
    };
    if (this.donut) {
      this.chartOptions.plotOptions.pie.innerSize = Math.min(
        Math.abs(this.donutInnerSize),
        this.setInnerSize(piePadding)
      );
    }
    if (this.donut && this.donutWidth) {
      this.chartOptions.plotOptions.pie.innerSize = Math.max(
        0,
          this.setInnerSize(piePadding - minDonutWidth + Math.abs(this.donutWidth))
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartOptions();
    this.applyOnChange();
  }

  private setInnerSize(offset: number) {
    return this.legend
      ? Math.abs(this.height) - pieLegendHeight - offset
      : Math.abs(this.height) - offset;
  }
}
