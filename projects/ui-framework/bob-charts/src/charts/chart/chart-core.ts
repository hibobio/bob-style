import {
  AfterViewInit,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  Directive,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Chart, ExportingMimeTypeValue, Options } from 'highcharts';
import { ChartTypesEnum } from './chart.enum';
import { merge } from 'lodash';
import { simpleUID } from 'bob-style';
import {
  ChartFormatterThis,
  ChartLegendAlignEnum,
  ChartLegendLayoutEnum,
  ChartLegendPositionEnum,
  ChartLegendVerticalAlignEnum,
  HighChartOptions,
} from './chart.interface';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const Exporting = require('highcharts/modules/exporting');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Exporting(Highcharts);
Boost(Highcharts);
noData(Highcharts);
More(Highcharts);

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class ChartCore implements AfterViewInit {
  @Input() abstract type: ChartTypesEnum;
  highChartRef: Chart;
  containerId: string = simpleUID();
  chartOptions: Options;
  options: Options;
  private formatter = (function (component) {
    return function () {
      return component.tooltipFormatter(this, component);
    };
  })(this);

  @Input() legendPosition: ChartLegendPositionEnum =
    ChartLegendPositionEnum.BOTTOM;
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
    '#6AF9C4',
  ];
  @Input() height = 500;
  @Input() title: string = null;
  @Input() legend = false;
  @Input() showDataLabels = false;
  @Input() pointFormat = '{series.name}: <b>{point.percentage:.1f}%</b>';
  @Input() extraOptions: HighChartOptions = {};
  @Output() legendChanged = new EventEmitter();
  @Input() tooltipTemplate = <ChartTooltipTemplateFormatter>(
    component: ChartCore,
    chartPoint: ChartFormatterThis
  ) => `<div class="chart-tooltip">
      <div class="value" style="color:${chartPoint.color};">
          ${component.formatValue(chartPoint.y)}
      </div>
      <div class="key">${chartPoint.key}</div>
    </div>`;
  @Input() tooltipValueFormatter = (val: number): number | string => val;

  constructor(public cdr: ChangeDetectorRef, public zone: NgZone) {}

  tooltipFormatter(chartThis: ChartFormatterThis, component: ChartCore) {
    return this.tooltipTemplate(component, chartThis);
  }

  formatValue(value: number): string {
    return `${this.preTooltipValue}${this.tooltipValueFormatter(value)}${
      this.postTooltipValue
    }`;
  }

  exportChart(type: ExportingMimeTypeValue) {
    (this.highChartRef as any).exportChart({
      type: type,
    });
  }

  initialOptions(): void {
    this.options = merge(
      {
        colors: this.colorPalette,
        chart: {
          events: {
            render: (event) => {
              this.legendChanged.emit();
            },
          },
          height: this.height,
          type: this.type,
          backgroundColor: 'rgba(255, 255, 255, 0.0)',
          animation: {
            duration: 200,
          },
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
            opacity: 1,
          },
          formatter: this.formatter,
        },
        plotOptions: {
          [this.type]: {
            animation: {},
            events: {
              afterAnimate: undefined,
            },
            showInLegend: this.legend,
            dataLabels: {
              enabled: this.showDataLabels,
            },
          },
        },
        credits: {
          enabled: false,
        },
        series: [],
        exporting: {
          enabled: false,
        },
      },
      this.chartOptions,
      this.extraOptions
    );
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
        this.highChartRef.update(this.options, true, true);
      });
    }
  }
  private getLegendPositioning(
    position: ChartLegendPositionEnum,
    offset = { x: 0, y: 0 }
  ) {
    const baseLegendPositionJson = {
      [ChartLegendPositionEnum.TOP]: {
        align: ChartLegendAlignEnum.CENTER,
        verticalAlign: ChartLegendVerticalAlignEnum.TOP,
        layout: ChartLegendLayoutEnum.HORIZONTAL,
      },
      [ChartLegendPositionEnum.BOTTOM]: {
        align: ChartLegendAlignEnum.CENTER,
        verticalAlign: ChartLegendVerticalAlignEnum.BOTTOM,
        layout: ChartLegendLayoutEnum.HORIZONTAL,
      },
      [ChartLegendPositionEnum.RIGHT]: {
        align: ChartLegendAlignEnum.RIGHT,
        verticalAlign: ChartLegendVerticalAlignEnum.MIDDLE,
        layout: ChartLegendLayoutEnum.VERTICAL,
      },
      [ChartLegendPositionEnum.LEFT]: {
        align: ChartLegendAlignEnum.LEFT,
        verticalAlign: ChartLegendVerticalAlignEnum.MIDDLE,
        layout: ChartLegendLayoutEnum.VERTICAL,
      },
    };

    return {
      ...baseLegendPositionJson[position],
      x: offset.x,
      y: offset.y,
    };
  }
}
