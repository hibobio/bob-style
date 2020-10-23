import { storiesOf } from '@storybook/angular';
import {
  boolean,
  number,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../../../src/lib/consts';
import { ChartsModule } from '../charts.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../../src/lib/story-book-layout/story-book-layout.module';
import { LINE_CHART_DATA_MOCK } from '../chart.mock';
import { ChartLegendPositionEnum } from '../chart/chart.interface';
import { DonutSize } from '../charts.enum';

const story = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);

const tooltipTemplate =
  '<div class="chart-tooltip">\n' +
  '\t<div class="value" style="color:${chartPoint.color};">\n' +
  '\t\t${component.formatValue(chartPoint.y)}\n' +
  '\t</div>\n' +
  '\t<div class="key">${chartPoint.key}</div>\n' +
  '</div>';

const template = `<b-pie-chart
        [donutSize]="donutSize"
        [data]="data"
        [tooltipTemplate]="tooltipTemplate"
        [preTooltipValue]="preTooltipValue"
        [postTooltipValue]="postTooltipValue"
        [donut]="donut"
        [showDataLabels]="showDataLabels"
        [extraOptions]="extraOptions"
        [legend]="legend"
        [legendPosition]="legendPosition"
        [colorPalette]="colorPalette"
        [name]="name"
        [height]="height"
        [donutWidth]="donutWidth"
        [donutInnerSize]="donutInnerSize"
        [title]="title"
        [pointFormat]="pointFormat"
        #chart>
  </b-pie-chart>
  <br>
  <button (click)="chart.exportChart(downloadChart)">download</button>`;

const storyTemplate = `
<b-story-book-layout [title]="'Pie Chart'">
  <div>
    ${template}
  </div>
</b-story-book-layout>
`;
// tslint:disable:max-line-length
const note = `

  ## Applies to all types of charts

  ### Tooltips
  Name | Type | Description | Default value
  --- | --- | --- | ---
  preTooltipValue | string | presented before tooltip value | ''
  postTooltipValue | string | presented after tooltip value | ''
  tooltipTemplate | function (component, point) | returns html string for tooltip | * See default tooltip template down
  pointFormat (optional) | string | tooltip formatter | {series.name}: <b>{point.percentage:.1f}%</b>

  #### Tooltip default template

  ~~~
  ${tooltipTemplate}
  ~~~


  ### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  *name | string | name of series | &nbsp;
  *data | | series data array for chart | &nbsp;
  showDataLabels (optional) | boolean | shows label in pie | false
  legend (optional) | boolean | shows legend | false
  colorPalette (optional) | string[] | color palette array | default array of colors
  height (optional) | number | height of chart | 500
  title (optional) | string | title of chart | &nbsp;
  legendPosition (optional) | ChartLegendPositionEnum | where the legend should be set relative to the chart | ChartLegendPositionEnum.BOTTOM
  extraOptions (optional) | HighChartOptions | extra highcharts options for customize options that are not currently supported with other inputs | {}


  ### Methods
  Name | Type | Description | Default value
  --- | --- | --- | ---
  formatValue | (number) => string) | apply value formatter and adds pre, post tooltip values | &nbsp;
  valueFormatter | (number) => string) | format of value number i.e make 30000 30,000 or 30k | val => 'val';
  exportChart | (type: ChartExportType) => void | download chart image by type (svg, pdf, jpeg, png mime types. i.e 'application/pdf' or 'image/svg+xml') | jpeg

  ## Pie chart only
  #### Module
  *ChartModule*
  from <u>'bob-style/bob-charts'</u>

  \`\`\`
  import { ChartModule } from 'bob-style/bob-charts';
  \`\`\`


  ~~~
  ${template}
  ~~~

  #### Pie Chart Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [donut]  boolean | make pie chart donut chart | false
  [donutInnerSize]  | number | defining the inner white circle in a donut pie chart | 60
  [donutWidth] | number | overrides donutInnerSize by applying width of donut instead inner circle width | null
  [donutSize] | DonutSize | donut size preset | &nbsp;
`;
// tslint:enable:max-line-length
story.add(
  'Pie chart',
  () => {
    return {
      template: storyTemplate,
      props: {
        tooltipTemplate: (component, point) => {
          console.log('point: ', point);
          return `<b>${point.key}</b> - ${component.formatValue(point.y)}`;
        },
        donutSize: select('donutSize', [0, ...Object.values(DonutSize)], 0),
        downloadChart: select(
          'downloadChart',
          ['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml'],
          'image/jpeg'
        ),
        showDataLabels: boolean('showDataLabels', false),
        donut: boolean('donut', false),
        legend: boolean('legend', true),
        extraOptions: object('extraOptions', {}),
        legendPosition: select(
          'legendPosition',
          Object.values(ChartLegendPositionEnum),
          ChartLegendPositionEnum.BOTTOM
        ),
        name: text('name', 'employees'),
        preTooltipValue: text('preTooltipValue', ''),
        postTooltipValue: text('postTooltipValue', ' PEOPLE'),
        title: text('title', ''),
        height: number('height', 200),
        donutInnerSize: number('donutInnerSize', 60),
        donutWidth: number('donutWidth', 0),
        data: object('data', LINE_CHART_DATA_MOCK),
        colorPalette: object('colorPalette', [
          '#CC2E4E',
          '#87233D',
          '#DB8962',
          '#FEA54A',
          '#FECC4A',
          '#8F4A67',
          '#D2728A',
          '#D295A4',
          '#E0ACAC',
          '#BF8A78',
          '#C0755A',
          '#866161',
          '#663E4E',
          '#574285',
          '#6969C6',
          '#556E8A',
          '#789BC2',
          '#9BC7FA',
          '#6DC3BC',
          '#82D9B1',
          '#959595',
          '#616161',
          '#313131',
        ]),
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, ChartsModule],
      },
    };
  },
  { notes: { markdown: note } }
);
