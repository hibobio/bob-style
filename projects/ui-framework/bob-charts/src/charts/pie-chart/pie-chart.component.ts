import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ChartCore } from '../chart/chart-core';
import { ChartTypesEnum } from '../chart/chart.enum';
import { Options, SeriesPieDataOptions } from 'highcharts';
import { DonutSize } from '../charts.enum';
import { DONUT_SIZES } from '../charts.const';

export const minDonutWidth = 3,
  pieLegendHeight = 37,
  piePadding = 50;

@Component({
  selector: 'b-pie-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss', './pie-chart.component.scss'],
})
export class PieChartComponent extends ChartCore implements OnChanges {
  constructor(public cdr: ChangeDetectorRef, public zone: NgZone) {
    super(cdr, zone);
    this.height = 150;
  }

  @Input() data: SeriesPieDataOptions[];
  @Input() name: string;
  @Input() donut = false;
  @Input() donutInnerSize = 60;
  @Input() donutWidth: number;

  @HostBinding('attr.data-donut-size') @Input() donutSize: DonutSize = null;

  readonly type = ChartTypesEnum.Pie;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.donutSize) {
      this.donut = true;
      this.legend = this.showDataLabels = false;
      this.title = null;
      this.height = DONUT_SIZES[this.donutSize][0] + 5;
    }

    this.updateChartOptions();
    this.applyOnChange();
  }

  updateChartOptions() {
    this.chartOptions = {
      chart: {
        height: Math.abs(this.height),
      },
      plotOptions: {
        pie: {
          depth: null,
          innerSize: null,
        },
      },

      lang: {
        noData: '',
      },
      series: [
        {
          type: 'pie',
          name: this.name,
          data: this.data,
        },
      ],
    };

    if (this.donut && this.donutSize) {
      //
      Object.assign(this.chartOptions, this.getSizedDonutPieOptions());
      //
    } else if (this.donut) {
      //
      this.chartOptions.plotOptions.pie.innerSize = this.donutWidth
        ? Math.max(
            0,
            this.setInnerSize(
              piePadding - minDonutWidth + Math.abs(this.donutWidth)
            )
          )
        : Math.min(
            Math.abs(this.donutInnerSize),
            this.setInnerSize(piePadding)
          );
    }
  }

  private setInnerSize(offset: number) {
    return this.legend
      ? Math.abs(this.height) - pieLegendHeight - offset
      : Math.abs(this.height) - offset;
  }

  private getSizedDonutPieOptions(): Partial<Options> {
    return {
      plotOptions: {
        pie: {
          depth: null,
          size: DONUT_SIZES[this.donutSize][0],
          minSize: DONUT_SIZES[this.donutSize][0],
          innerSize: DONUT_SIZES[this.donutSize][1],
          borderWidth: 0,
          gapSize: 0,
          shadow: false,
          states: {
            hover: { halo: null },
          },
        },
      },
      pane: {
        size: DONUT_SIZES[this.donutSize][0],
      },
    };
  }
}
