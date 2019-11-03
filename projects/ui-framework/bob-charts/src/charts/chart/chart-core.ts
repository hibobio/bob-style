import {AfterViewInit, ChangeDetectorRef, EventEmitter, Input, NgZone, Output} from '@angular/core';
import * as Highcharts from 'highcharts';
import {Options} from 'highcharts';
import {ChartTypesEnum} from './chart.enum';
import {merge} from 'lodash';
import {simpleUID} from 'bob-style';
import {
  ChartFormatterThis,
  ChartLegendAlignEnum,
  ChartLegendLayoutEnum,
  ChartLegendPositionEnum,
  ChartLegendVerticalAlignEnum
} from './chart.interface';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);

export abstract class ChartCore implements AfterViewInit {
  @Input() abstract type: ChartTypesEnum;
  highChartRef: any;
  containerId: string = simpleUID();
  chartOptions: Options;
  options: Options;

  private formatter = (function (component) {
    return function () {
      return component.tooltipFormatter(this, component);
    };
  })(this);


  @Input() legendPosition: ChartLegendPositionEnum = ChartLegendPositionEnum.BOTTOM;
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
  @Input() tooltipValueFormatter = (val: number): number | string => val;

  constructor(
    public zone: NgZone,
    public cdr: ChangeDetectorRef
  ) {}

  tooltipFormatter(chartThis: ChartFormatterThis, component: ChartCore) {
    return `<div class="chart-tooltip">
      <div class="value" style="color:${chartThis.color};">
          ${component.preTooltipValue}${component.tooltipValueFormatter(chartThis.y)}${component.postTooltipValue}
      </div>
      <div class="key">${chartThis.key}</div>
    </div>`;
  }


  initialOptions(): void {
    this.zone.runOutsideAngular(() => {
      this.options = merge({
        colors: this.colorPalette,
        lang: {
          noData: '' // overrides no data alert
        },
        chart: {
          events: {
            render: (event) => {
              this.legendChanged.emit();
            }
          },
          height: this.height,
          type: this.type,
          backgroundColor: 'rgba(255, 255, 255, 0.0)',
          animation: {
            duration: 200,
          }
        },
        title: {
          text: this.title,
        },
        legend: this.getLegendPositioning(this.legendPosition),
        tooltip: {
          outside: true,
          useHTML: true,
          style: {
            textAlign: 'center',
            shadow: false,
            opacity: 1
          },
          formatter: this.formatter
        },
        plotOptions: {
          [this.type]: {
            animation: {},
            events: {
              afterAnimate: undefined
            },
            showInLegend: this.legend,
            dataLabels: {
              enabled: this.showDataLabels
            },
          }
        },
        credits: {
          enabled: false
        },
        series: [],
      }, this.chartOptions);
    });
  }

  ngAfterViewInit(): void {
    this.initialOptions();
    this.zone.runOutsideAngular(() => {
      this.highChartRef = Highcharts.chart(this.containerId, this.options);
    });
  }

  applyOnChange() {
    if (this.highChartRef) {
      this.cdr.markForCheck();
      this.initialOptions();

      this.zone.runOutsideAngular(() => {
        this.highChartRef.update(this.options);
      });
    }
  }
  private getLegendPositioning(position: ChartLegendPositionEnum, offset = {x: 0, y: 0}) {
    const baseLegendPositionJson = {
      [ChartLegendPositionEnum.TOP]: {
        align: ChartLegendAlignEnum.CENTER,
        verticalAlign: ChartLegendVerticalAlignEnum.TOP,
        layout: ChartLegendLayoutEnum.HORIZONTAL
      },
      [ChartLegendPositionEnum.BOTTOM]: {
        align: ChartLegendAlignEnum.CENTER,
        verticalAlign: ChartLegendVerticalAlignEnum.BOTTOM,
        layout: ChartLegendLayoutEnum.HORIZONTAL
      },
      [ChartLegendPositionEnum.RIGHT]: {
        align: ChartLegendAlignEnum.RIGHT,
        verticalAlign: ChartLegendVerticalAlignEnum.MIDDLE,
        layout: ChartLegendLayoutEnum.VERTICAL
      },
      [ChartLegendPositionEnum.LEFT]: {
        align: ChartLegendAlignEnum.LEFT,
        verticalAlign: ChartLegendVerticalAlignEnum.MIDDLE,
        layout: ChartLegendLayoutEnum.VERTICAL
      },
    };

    return {
      ...baseLegendPositionJson[position],
      x: offset.x,
      y: offset.y
    };
  }
}
