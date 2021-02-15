import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  NgZone, ChangeDetectionStrategy
} from '@angular/core';
import { ChartCore } from '../chart/chart-core';
import { SeriesBubbleOptions } from 'highcharts';
import { ChartTypesEnum } from '../charts.enum';

@Component({
  selector: 'b-bubble-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleChartComponent extends ChartCore implements OnChanges {

  readonly type: ChartTypesEnum = ChartTypesEnum.Bubble;

  @Input() xTitle: string;
  @Input() yTitle: string;
  @Input() xLabels: string[];
  @Input() yLabels: string[];
  @Input() xSize: number;
  @Input() ySize: number;
  @Input() color: string;
  @Input() data: SeriesBubbleOptions[];

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
        plotBorderWidth: 1,
      },
      xAxis: {
        startOnTick: true,
        endOnTick: false,
        gridLineWidth: 1,
        title: {
          text: this.xTitle,
        },
        max: this.xSize - 1,
        min: 0,
        categories: this.xLabels ?? [],
      },
      yAxis: {
        startOnTick: true,
        endOnTick: false,
        gridLineWidth: 1,
        title: {
          text: this.yTitle,
        },
        max: this.ySize - 1,
        min: 0,
        categories: this.yLabels ?? [],
      },
      plotOptions: {
        bubble: {
          color: this.color,
        },
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          }
        }
      },
      series: [
        { data: this.data }
      ] as any
    };
  }
}
