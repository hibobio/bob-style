import {ChangeDetectorRef, Component, Input, OnChanges} from '@angular/core';
import {Options, SeriesPieDataOptions} from 'highcharts';

@Component({
  selector: 'b-donut-text-chart',
  templateUrl: './donut-chart-text.component.html',
  styleUrls: [
    './donut-chart-text.component.scss'
    ]
})
export class DonutChartTextComponent implements OnChanges {
  textStyle: any;
  @Input() data: Array<(number|[string, (number|null)]|null|SeriesPieDataOptions)>;
  @Input() name: string;
  @Input() donutInnerSize = 80;
  @Input() height = 250;
  @Input() title: string = null;
  @Input() legend = false;
  @Input() pointFormat = '{series.name}: <b>{point.percentage:.1f}%</b>';
  @Input() extraOptions: Options = {};
  @Input() preTooltipValue = '';
  @Input() postTooltipValue = '';
  @Input() tooltipValueFormatter: Function = (val) => val;
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
  constructor(
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnChanges(): void {
      setTimeout(() => {
        this.setTextStyle();
      });
  }

  private setTextStyle () {
    const donutSize = this.maxDonutTextSize();
    this.textStyle = {
      lineHeight: `${donutSize}px`,
      width: `${donutSize}px`,
      height: `${donutSize}px`
    };
    if (this.cdr && !this.cdr['destroyed']) {
      this.cdr.detectChanges();
    }
  }

  updatePosition($event) {
    setTimeout(() => {
      if (this.legend) {
        this.textStyle = {
          ...this.textStyle,
          ...{transform: `translateY(-${($event / 2) + 9}px)`}
        };
        if (this.cdr && !this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      }
    });
  }

  private maxDonutTextSize() {
    return Math.min(Math.abs(this.donutInnerSize) + 1, Math.abs(this.height) - 50);
  }
}
