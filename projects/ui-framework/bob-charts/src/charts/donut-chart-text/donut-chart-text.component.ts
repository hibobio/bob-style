import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Options, SeriesPieDataOptions } from 'highcharts';
import {
  ChartLegendPositionEnum,
  ChartTooltipTemplateFormatter,
  ChartTooltipValueFormatter,
} from '../charts.interface';
import { applyChanges, pass, DonutSize } from 'bob-style';
import {
  DONUT_CHART_WTEXT_ANIM_DURATION,
  CHART_CORE_COLORPALETTE_DEF,
  CHART_CORE_POINTFORMAT_DEF,
  DONUT_CHART_WTEXT_SIZE_DEFS,
  CHART_CORE_TOOLTIP_TEMPLATE_DEF,
} from '../charts.const';

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
export class DonutChartTextComponent implements OnChanges {
  constructor(private cdr: ChangeDetectorRef) {}

  @ViewChild('chart', { read: ElementRef }) chartComponent: ElementRef;
  @ViewChild('text', { read: ElementRef }) textContainer: ElementRef;

  @Input() data: SeriesPieDataOptions[];
  @Input() name: string;
  @Input() height = 300;
  @Input() donutInnerSize = 80;
  @Input() title: string = null;
  @Input() legend = false;
  @Input() legendPosition: ChartLegendPositionEnum =
    ChartLegendPositionEnum.RIGHT;
  @Input() pointFormat = CHART_CORE_POINTFORMAT_DEF;
  @Input() extraOptions: Options = {};
  @Input() preTooltipValue = '';
  @Input() postTooltipValue = '';
  @Input() colorPalette: string[] = [...CHART_CORE_COLORPALETTE_DEF];
  @Input() donutSize: DonutSize;

  @Input() tooltipValueFormatter: ChartTooltipValueFormatter = pass;
  @Input()
  tooltipTemplate: ChartTooltipTemplateFormatter = CHART_CORE_TOOLTIP_TEMPLATE_DEF;

  // tslint:disable-next-line: member-ordering
  public textStyle: any;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        height: DONUT_CHART_WTEXT_SIZE_DEFS[0],
        donutInnerSize: DONUT_CHART_WTEXT_SIZE_DEFS[1],
        legendPosition: ChartLegendPositionEnum.RIGHT,
        pointFormat: CHART_CORE_POINTFORMAT_DEF,
        extraOptions: {},
        colorPalette: [...CHART_CORE_COLORPALETTE_DEF],
        preTooltipValue: '',
        postTooltipValue: '',
        tooltipValueFormatter: pass,
        tooltipTemplate: CHART_CORE_TOOLTIP_TEMPLATE_DEF,
      },
      [],
      true
    );
  }

  private calculateTextPosition() {
    const chartWrapperRect = (this.chartComponent
      .nativeElement as HTMLElement).getBoundingClientRect();
    const chartRect = (this.chartComponent.nativeElement.querySelector(
      '.highcharts-plot-background'
    ) as HTMLElement).getBoundingClientRect();
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
}
