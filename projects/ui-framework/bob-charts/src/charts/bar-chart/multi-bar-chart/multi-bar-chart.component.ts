import {ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
export class MultiBarChartComponent extends ChartCore implements OnInit, OnChanges {
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

  ngOnInit() {
    this.updatePieOptions();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.updatePieOptions();
    this.applyOnChange();
  }

  private updatePieOptions() {
    this.extraOptions = {
      chart: {
        height: Math.abs(this.height)
      },
      xAxis: {
        categories: this.categories,
        crosshair: true
      },
      plotOptions: {
        column: {
        }
      },
      series: this.data
    };
  }
}
