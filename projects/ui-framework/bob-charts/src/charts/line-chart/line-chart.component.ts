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
import { LineChartTypes } from '../charts.interface';

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
    this.sizeDefaults[0] = 450;
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

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
