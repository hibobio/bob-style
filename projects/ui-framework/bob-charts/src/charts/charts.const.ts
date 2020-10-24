import { ChartCore } from './chart/chart-core';
import { DonutSize } from './charts.enum';
import {
  ChartFormatterThis,
  ChartTooltipTemplateFormatter,
} from './charts.interface';

export const PIE_CHART_MIN_DONUT_WIDTH = 3;
export const PIE_CHART_LEGENT_HEIGHT = 37;
export const PIE_CHART_PIE_PADDING = 50;

// height
export const CHART_CORE_SIZE_DEFS = [500];
// height, donutInnerSize
export const PIE_CHART_SIZE_DEFS = [150, 60];

// width, inner-width
export const DONUT_SIZES = {
  [DonutSize.small]: [24, 14],
  [DonutSize.medium]: [40, 28],
  [DonutSize.large]: [145, 105],
  [DonutSize.xlarge]: [310, 188],
};

export const DONUT_DIAMETERS = {
  [DonutSize.small]: 24,
  [DonutSize.medium]: 40,
  [DonutSize.large]: 145,
  [DonutSize.xlarge]: 310,
};

export const DONUT_CHART_WTEXT_ANIM_DURATION = 400;

// height, donutInnerSize
export const DONUT_CHART_WTEXT_SIZE_DEFS = [300, 80];

export const CHART_CORE_POINTFORMAT_DEF =
  '{series.name}: <b>{point.percentage:.1f}%</b>';

export const CHART_CORE_COLORPALETTE_DEF = [
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

export const CHART_CORE_TOOLTIP_TEMPLATE_DEF: ChartTooltipTemplateFormatter = (
  component: ChartCore,
  chartPoint: ChartFormatterThis
) => `<div class="chart-tooltip">
          <div class="value" style="color:${chartPoint.color};">
            ${component.formatValue(chartPoint.y)}
          </div>
          <div class="key">${chartPoint.key}</div>
        </div>`;
