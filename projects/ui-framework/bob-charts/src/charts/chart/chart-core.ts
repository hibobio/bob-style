import {
  AfterViewInit,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  Directive,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { ExportingMimeTypeValue, Options, Chart } from 'highcharts';
import { ChartTypesEnum } from '../charts.enum';
import { merge } from 'lodash';
import { applyChanges, pass, simpleUID } from 'bob-style';
import {
  ChartFormatterThis,
  ChartLegendAlignEnum,
  ChartLegendLayoutEnum,
  ChartLegendPositionEnum,
  ChartLegendVerticalAlignEnum,
  ChartTooltipTemplateFormatter,
  ChartTooltipValueFormatter,
  HighChartOptions,
} from '../charts.interface';

import Boost from 'highcharts/modules/boost';
import Exporting from 'highcharts/modules/exporting';
import noData from 'highcharts/modules/no-data-to-display';
import More from 'highcharts/highcharts-more';
import {
  CHART_CORE_COLORPALETTE_DEF,
  CHART_CORE_POINTFORMAT_DEF,
  CHART_CORE_SIZE_DEFS,
  CHART_CORE_TOOLTIP_TEMPLATE_DEF,
} from '../charts.const';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class ChartCore implements OnChanges, AfterViewInit {
  constructor(public cdr: ChangeDetectorRef, public zone: NgZone) {
    Exporting(Highcharts);
    Boost(Highcharts);
    noData(Highcharts);
    More(Highcharts);
  }

  highChartRef: Chart;
  readonly containerId: string = simpleUID('bhc-', 7);
  chartOptions: Options;
  options: Options;

  protected sizeDefaults = CHART_CORE_SIZE_DEFS;

  private formatter = (function (component) {
    return function () {
      return component.tooltipFormatter(this, component);
    };
  })(this);

  @Input() abstract type: ChartTypesEnum;
  @Input() legendPosition: ChartLegendPositionEnum =
    ChartLegendPositionEnum.BOTTOM;
  @Input() preTooltipValue = '';
  @Input() postTooltipValue = '';
  @Input() colorPalette: string[] = [...CHART_CORE_COLORPALETTE_DEF];
  @Input() height = this.sizeDefaults[0];
  @Input() title: string = null;
  @Input() legend = false;
  @Input() showDataLabels = false;
  @Input() pointFormat = CHART_CORE_POINTFORMAT_DEF;
  @Input() extraOptions: HighChartOptions = {};

  @Input() tooltipValueFormatter: ChartTooltipValueFormatter = pass;
  @Input()
  tooltipTemplate: ChartTooltipTemplateFormatter = CHART_CORE_TOOLTIP_TEMPLATE_DEF;

  // tslint:disable-next-line: member-ordering
  @Output() legendChanged = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        height: this.sizeDefaults[0],
        legendPosition: ChartLegendPositionEnum.BOTTOM,
        colorPalette: [...CHART_CORE_COLORPALETTE_DEF],
        pointFormat: CHART_CORE_POINTFORMAT_DEF,
        extraOptions: {},
        preTooltipValue: '',
        postTooltipValue: '',
        tooltipValueFormatter: pass,
        tooltipTemplate: CHART_CORE_TOOLTIP_TEMPLATE_DEF,
      },
      [],
      true
    );
  }

  tooltipFormatter(chartThis: ChartFormatterThis, component: ChartCore) {
    return this.tooltipTemplate(component, chartThis);
  }

  formatValue(value: number): string {
    return `${this.preTooltipValue}${this.tooltipValueFormatter(value)}${
      this.postTooltipValue
    }`;
  }

  exportChart(type: ExportingMimeTypeValue) {
    this.highChartRef?.exportChart({ type: type }, undefined);
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
