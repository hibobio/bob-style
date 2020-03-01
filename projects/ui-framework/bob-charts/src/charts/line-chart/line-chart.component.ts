import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  NgZone,
} from '@angular/core';
import { ChartCore } from '../chart/chart-core';
import { SeriesLineOptions } from 'highcharts';
import { LineChartTypes } from '../chart/chart.interface';

@Component({
  selector: 'b-line-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
})
export class LineChartComponent extends ChartCore implements OnChanges {
  type: LineChartTypes;
  @Input() data: SeriesLineOptions[];
  @Input() name: string;
  constructor(public cdr: ChangeDetectorRef, public zone: NgZone) {
    super(cdr, zone);
    this.height = 450;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateOptions();
    this.applyOnChange();
  }

  private updateOptions() {
    this.chartOptions = {
      chart: {
        height: Math.abs(this.height),
      },
      plotOptions: {
        [this.type]: {},
      },
      series: [
        {
          type: this.type as any,
          name: this.name,
          data: this.data,
        },
      ],
    };
  }
}
