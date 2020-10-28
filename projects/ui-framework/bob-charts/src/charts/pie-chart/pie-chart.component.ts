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
import { ChartTypesEnum } from '../charts.enum';
import { Options, SeriesPieDataOptions } from 'highcharts';
import {
  PIE_CHART_LEGENT_HEIGHT,
  PIE_CHART_MIN_DONUT_WIDTH,
  PIE_CHART_PIE_PADDING,
  PIE_CHART_SIZE_DEFS,
} from '../charts.const';
import {
  applyChanges,
  closestNumber,
  getKeyByValue,
  DonutSize,
  DONUT_DIAMETERS,
  DONUT_SIZES,
  GenericObject,
} from 'bob-style';

@Component({
  selector: 'b-pie-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss', './pie-chart.component.scss'],
})
export class PieChartComponent extends ChartCore implements OnChanges {
  constructor(public cdr: ChangeDetectorRef, public zone: NgZone) {
    super(cdr, zone);
    this.sizeDefaults = [...PIE_CHART_SIZE_DEFS];
  }

  @Input() data: SeriesPieDataOptions[];
  @Input() name: string;
  @Input() donut = false;
  @Input() donutInnerSize = this.sizeDefaults[1];
  @Input() donutWidth: number;
  @Input() donutSize: DonutSize = null;

  @HostBinding('attr.data-donut-size') get getDonutSize() {
    return (
      this.donutSize ||
      (this.donut
        ? (() => {
            const key = `${this.donutWidth}-${this.donutInnerSize}`;
            if (!this.donutSizeCache.has(key)) {
              this.donutSizeCache.set(
                key,
                getKeyByValue(
                  DONUT_DIAMETERS,
                  closestNumber(
                    this.donutWidth || this.donutInnerSize / (1 - 0.14),
                    Object.values(DONUT_DIAMETERS)
                  )
                ) as DonutSize
              );
            }
            return this.donutSizeCache.get(key);
          })()
        : null)
    );
  }

  private donutSizeCache: Map<string, DonutSize> = new Map();
  private propsCache: GenericObject;
  readonly type = ChartTypesEnum.Pie;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        height: this.sizeDefaults[0],
        donutInnerSize: this.sizeDefaults[1],
        donutSize: null,
      },
      [],
      true
    );

    super.ngOnChanges(changes);

    let shouldDestroyOnUpdate = false;

    if (this.donutSize) {
      this.propsCache = {
        donut: this.donut,
        legend: this.legend,
        showDataLabels: this.showDataLabels,
        title: this.title,
        height: this.height,
        donutInnerSize: this.donutInnerSize,
      };
      this.donut = true;
      this.legend = this.showDataLabels = false;
      this.title = null;
      this.height = DONUT_SIZES[this.donutSize][0] + 5;
      //
    } else if (changes?.donutSize?.previousValue && this.propsCache) {
      //
      Object.assign(this, this.propsCache);
      this.propsCache = undefined;
      shouldDestroyOnUpdate = true;
    }

    this.updateChartOptions();
    this.applyOnChange(shouldDestroyOnUpdate);
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
              PIE_CHART_PIE_PADDING -
                PIE_CHART_MIN_DONUT_WIDTH +
                Math.abs(this.donutWidth)
            )
          )
        : Math.min(
            Math.abs(this.donutInnerSize),
            this.setInnerSize(PIE_CHART_PIE_PADDING)
          );
    }
  }

  private setInnerSize(offset: number) {
    return this.legend
      ? Math.abs(this.height) - PIE_CHART_LEGENT_HEIGHT - offset
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
