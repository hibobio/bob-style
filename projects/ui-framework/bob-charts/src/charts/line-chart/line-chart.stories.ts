import { storiesOf } from '@storybook/angular';
import {
  boolean,
  number,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentGroupType } from '../../../../src/lib/consts';
import { StoryBookLayoutModule } from '../../../../src/lib/story-book-layout/story-book-layout.module';
import { ChartsModule } from '../charts.module';
import { LINE_CHART_DATA_MOCK } from '../chart.mock';
import { ChartTypesEnum } from '../chart/chart.enum';
import { ChartLegendPositionEnum } from '../chart/chart.interface';

const story = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);
const template = `<b-line-chart
        [data]="data"
        [type]="type"
        [preTooltipValue]="preTooltipValue"
        [postTooltipValue]="postTooltipValue"
        [showDataLabels]="showDataLabels"
        [legend]="legend"
        [legendPosition]="legendPosition"
        [colorPalette]="colorPalette"
        [name]="name"
        [height]="height"
        [title]="title"
        [pointFormat]="pointFormat"
        #chart>
</b-line-chart>
<button (click)="chart.exportChart(downloadChart)">download</button>`;

const storyTemplate = `
<b-story-book-layout [title]="'Line Chart'">
    <div>${template}</div>
</b-story-book-layout>
`;

const note = `
  ## Single Chart

  #### Module
  *ChartModule*
  from <u>'bob-style/bob-charts'</u>

  \`\`\`
  import { ChartModule } from 'bob-style/bob-charts';
  \`\`\`

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  *name | string | name of series | &nbsp;
  *data | | series data array for chart | &nbsp;
  type | ChartTypesEnum - (Area, Line, Spline) | the type of line chart | ChartTypesEnum.Line
  legend (optional) | boolean | shows legend | false
  colorPalette (optional) | string[] | color palette array | default array of colors
  height (optional) | number | height of chart | 500
  title (optional) | string | title of chart | &nbsp;
  pointFormat (optional) | string | tooltip formatter | {series.name}: <b>{point.percentage:.1f}%</b>
`;

story.add(
  'Line chart',
  () => {
    return {
      template: storyTemplate,
      props: {
        downloadChart: select(
          'downloadChart',
          ['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml'],
          'image/jpeg'
        ),
        type: select(
          'type',
          [
            ChartTypesEnum.Line,
            ChartTypesEnum.Spline,
            ChartTypesEnum.Area,
            ChartTypesEnum.Areaspline,
          ],
          ChartTypesEnum.Line
        ),
        legend: boolean('legend', true),
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
