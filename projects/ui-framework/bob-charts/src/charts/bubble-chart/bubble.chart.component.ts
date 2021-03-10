import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Color } from 'bob-style';
import { ChartCore } from '../chart/chart-core';
import { ChartTypesEnum } from '../charts.enum';
import { ExtendedSeriesBubbleDataOptions } from '../charts.interface';

@Component({
  selector: 'b-bubble-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleChartComponent extends ChartCore implements OnChanges {
  constructor(public cdr: ChangeDetectorRef, public zone: NgZone) {
    super(cdr, zone);
    this.sizeDefaults[0] = 450;
  }

  @Input() xTitle: string;
  @Input() yTitle: string;
  @Input() xLabels: string[];
  @Input() yLabels: string[];
  @Input() xSize: number;
  @Input() ySize: number;
  @Input() color: Color;
  @Input() data: ExtendedSeriesBubbleDataOptions[];

  readonly type: ChartTypesEnum = ChartTypesEnum.Bubble;

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    this.updateOptions();
    this.applyOnChange();
  }

  private updateOptions() {
    // @ts-ignore
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
            format: '{point.name}',
          },
        },
      },
      series: [{ data: this.data, type: 'bubble' }],
    };
  }
}
