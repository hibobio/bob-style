import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartLegendPositionEnum } from '../charts.interface';
import { applyChanges, DonutSize } from 'bob-style';
import {
  DONUT_CHART_WTEXT_ANIM_DURATION,
  DONUT_CHART_WTEXT_SIZE_DEFS,
} from '../charts.const';
import { ChartCore } from '../chart/chart-core';
import { ChartTypesEnum } from '../charts.enum';
import { SeriesPieDataOptions } from 'highcharts';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout = 0;

  const debounced = (...args: any[]) => {
    clearTimeout(timeout);
    // @ts-ignore
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

@Component({
  selector: 'b-donut-text-chart',
  templateUrl: './donut-chart-text.component.html',
  styleUrls: ['./donut-chart-text.component.scss'],
})
export class DonutChartTextComponent extends ChartCore
  implements OnChanges, AfterViewInit {
  constructor(public cdr: ChangeDetectorRef, public zone: NgZone) {
    super(cdr, zone);
    this.legendPosition = ChartLegendPositionEnum.RIGHT;
    this.sizeDefaults = DONUT_CHART_WTEXT_SIZE_DEFS;
  }

  @ViewChild(PieChartComponent, { read: ElementRef })
  chartElRef: ElementRef<HTMLElement>;
  @ViewChild(PieChartComponent)
  chart: PieChartComponent;
  @ViewChild('text', { read: ElementRef }) textContainer: ElementRef;

  @Input() data: SeriesPieDataOptions[];
  @Input() name: string;
  @Input() donutInnerSize = this.sizeDefaults[1];
  @Input() donutSize: DonutSize;

  // tslint:disable-next-line: member-ordering
  public textStyle: any;
  readonly type = ChartTypesEnum.Pie;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        height: this.sizeDefaults[0],
        donutInnerSize: this.sizeDefaults[1],
        donutSize: null,
        legendPosition: ChartLegendPositionEnum.RIGHT,
      },
      [],
      true
    );

    super.ngOnChanges(changes);
  }

  ngAfterViewInit() {
    this.highChartRef = this.chart.highChartRef;
  }

  private calculateTextPosition() {
    const chartWrapperRect = this.chartElRef.nativeElement.getBoundingClientRect();
    const chartRect = this.chartElRef.nativeElement
      .querySelector('.highcharts-plot-background')
      .getBoundingClientRect();
    this.textStyle = {
      top: `${chartRect.top - chartWrapperRect.top}px`,
      left: `${chartRect.left - chartWrapperRect.left}px`,
      width: `${chartRect.width}px`,
      height: `${chartRect.height}px`,
      transition: 'none',
      opacity: 1,
    };
  }

  private updateTextStyle() {
    if (this.cdr && !this.cdr['destroyed']) {
      this.cdr.markForCheck();
    }
    this.calculateTextPosition();
  }

  updatePosition() {
    if (this.cdr && !this.cdr['destroyed']) {
      this.cdr.markForCheck();
    }
    this.textStyle = {
      ...this.textStyle,
      opacity: 0,
      transition: 'all .2s cubic-bezier(.17,.13,.53,.52)',
    };
    debounce(() => {
      this.updateTextStyle();
    }, DONUT_CHART_WTEXT_ANIM_DURATION)();
  }

  initialOptions() {}
  applyOnChange() {}
}
