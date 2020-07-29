import { Options, ExportingMimeTypeValue, Chart } from 'highcharts';
import { ChartTypesEnum } from './chart.enum';
import { ChartCore } from './chart-core';

export class HighChartOptions implements Options {}

export type LineChartTypes =
  | ChartTypesEnum.Area
  | ChartTypesEnum.Line
  | ChartTypesEnum.Spline
  | ChartTypesEnum.Areaspline;

export interface ChartFormatterThis {
  color: string;
  y: number;
  key: number | string;
  x?: number | string;
  series?: any;
  colorIndex?: number;
  total?: number;
}

export type ChartTooltipTemplateFormatter = (
  component: ChartCore,
  chartThis: ChartFormatterThis
) => string;

export type ChartExportType = ExportingMimeTypeValue;

export enum ChartLegendPositionEnum {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}

export enum ChartLegendAlignEnum {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export enum ChartLegendVerticalAlignEnum {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

export enum ChartLegendLayoutEnum {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}
