import {
  AfterViewInit,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import * as Highcharts from 'highcharts';
import {Options} from 'highcharts';
import {ChartTypesEnum} from './chart.enum';
import {merge} from 'lodash';
import {simpleUID} from '../../services/utils/functional-utils';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

let component;

export class ChartCore implements AfterViewInit, OnChanges {
  type: ChartTypesEnum;
  highChartRef: any;
  containerId: string = simpleUID();
  options: Options;
  firstTimeAfterAnimate = true;

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
  @Input() height = 500;
  @Input() title: string = null;
  @Input() legend = false;
  @Input() showDataLabels = false;
  @Input() pointFormat = '{series.name}: <b>{point.percentage:.1f}%</b>';
  @Input() extraOptions: Options = {};
  @Output() legendChanged = new EventEmitter();

  constructor(
    public zone: NgZone,
    public cdr: ChangeDetectorRef,
  ) {
    component = this;
  }

  initialOptions(): void {
    this.options = merge({
      chart: {
        height: this.height,
        type: this.type,
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
        animation: {
          duration: 200,
          // easing: function(t) { return t; }
        }
      },
      title: {
        text: this.title,
      },
      tooltip: {
        outside: true,
        useHTML: true,
        style: {
          textAlign: 'center',
          shadow: false,
          opacity: 1
        },
        formatter: function (tooltip) {
          return `<div class="chart-tooltip">
                <div class="value" style="color:${this.color};">
                    ${component.preTooltipValue}${this.y}${component.postTooltipValue}
                </div>
                <div class="key">${this.key}</div>
                </div>`;
        }
      },
      plotOptions: {
        [this.type]: {
          animation: {
          },
          events: {
            afterAnimate: undefined
          },
          showInLegend: this.legend,
          dataLabels: {
            enabled: this.showDataLabels
          },
          // tooltip: {
          //   pointFormat: this.pointFormat,
          // }
        }
      },
      credits: {
        enabled: false
      },
      series: [],
    }, this.extraOptions);
    if (this.legend && this.legendChanged && this.firstTimeAfterAnimate) {
      this.options.plotOptions[this.type].events.afterAnimate = (event) => {
        this.firstTimeAfterAnimate = false;
        this.legendChanged.emit(this.highChartRef.legend.legendHeight);
      };
    }
  }

  ngAfterViewInit(): void {
    this.initialOptions();
    this.zone.runOutsideAngular(() => {
      Highcharts.setOptions({
        colors: this.colorPalette
      });
      this.highChartRef = Highcharts.chart(this.containerId, this.options);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyOnChange();
  }

  applyOnChange() {
    if (this.highChartRef) {
      this.cdr.markForCheck();
      this.initialOptions();
      // window.requestAnimationFrame(() => {
        this.highChartRef.update(this.options);
      // });
    }
  }
}
