import {ChangeDetectorRef, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Options, SeriesPieDataOptions} from 'highcharts';
import {ChartLegendPositionEnum} from '../chart/chart.interface';

export const ANIMATION_DURATION = 400;

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
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
  styleUrls: [
    './donut-chart-text.component.scss'
    ]
})
export class DonutChartTextComponent {
  textStyle: any;
  @Input() data: SeriesPieDataOptions[];
  @Input() name: string;
  @Input() donutInnerSize = 80;
  @Input() height = 300;
  @Input() title: string = null;
  @Input() legend = false;
  @Input() legendPosition: ChartLegendPositionEnum = ChartLegendPositionEnum.RIGHT;
  @Input() pointFormat = '{series.name}: <b>{point.percentage:.1f}%</b>';
  @Input() extraOptions: Options = {};
  @Input() preTooltipValue = '';
  @Input() postTooltipValue = '';
  @Input() colorPalette: string[] = [
    '#058DC7',
    '#50B432',
    '#ED561B',
    '#DDDF00',
    '#24CBE5',
    '#64E572',
    '#FF9655',
    '#FFF263',
    '#6AF9C4'];
  @ViewChild('chart', { read: ElementRef }) chartComponent: ElementRef;
  @ViewChild('text', { read: ElementRef }) textContainer: ElementRef;
  @Input() tooltipValueFormatter: Function = (val) => val;
  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  private calculateTextPosition() {
    const chartWrapperRect = (this.chartComponent.nativeElement as HTMLElement).getBoundingClientRect();
    const chartRect = (this.chartComponent.nativeElement
      .querySelector('.highcharts-plot-background') as HTMLElement).getBoundingClientRect();
    this.textStyle = {
      top: `${chartRect.top - chartWrapperRect.top}px`,
      left: `${chartRect.left - chartWrapperRect.left}px`,
      width: `${chartRect.width}px`,
      height: `${chartRect.height}px`,
      transition: 'none',
      opacity: 1
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
  this.textStyle = {...this.textStyle, opacity: 0,
    transition: 'all .2s cubic-bezier(.17,.13,.53,.52)'};
    debounce(() => {
      this.updateTextStyle();
    }, ANIMATION_DURATION)();
  }
}
