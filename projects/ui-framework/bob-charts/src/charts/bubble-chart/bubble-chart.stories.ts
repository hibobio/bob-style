import { storiesOf } from '@storybook/angular';
import {
  boolean,
  number,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentGroupType } from '../../../../src/lib/consts';
import { StoryBookLayoutModule } from '../../../../src/lib/story-book-layout/story-book-layout.module';
import { ChartsModule } from '../charts.module';
import { BUBBLE_CHART_CATEGORIES_MOCK, BUBBLE_CHART_DATA_MOCK } from '../chart.mock';
import { ChartLegendPositionEnum } from '../charts.interface';

const story = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);
const template = `<b-bubble-chart
        [data]="data"
        [preTooltipValue]="preTooltipValue"
        [postTooltipValue]="postTooltipValue"
        [showDataLabels]="showDataLabels"
        [legend]="legend"
        [legendPosition]="legendPosition"
        [colorPalette]="colorPalette"
        [height]="height"
        [title]="title"
        [pointFormat]="pointFormat"
        [xLabels]="xLabels"
        [yLabels]="yLabels"
        [xSize]="xSize"
        [ySize]="ySize"
        [xTitle]="xTitle"
        [yTitle]="yTitle"
        [color]="color"
        #chart>
</b-bubble-chart>
<button (click)="chart.exportChart(downloadChart)">download</button>`;

const storyTemplate = `
<b-story-book-layout [title]="'Bubble Chart'">
    <div>${template}</div>
</b-story-book-layout>
`;

const note = `
  ## Bubble Chart

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
  legend (optional) | boolean | shows legend | false
  height (optional) | number | height of chart | 500
  title (optional) | string | title of chart | &nbsp;
  pointFormat (optional) | string | tooltip formatter | {series.name}: <b>{point.percentage:.1f}%</b>
  xLabels | string[] | x series labels |
  yLabels | string[] | y series labels |
  xTitle | string | x series title |
  yTitle | string | y series title |
  xSize | number | x series size |
  ySize | number | y series size |
  color | string | bubbles color | #A4C9EF
`;

story.add(
  'Bubble chart',
  () => {
    return {
      template: storyTemplate,
      props: {
        downloadChart: select(
          'downloadChart',
          ['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml'],
          'image/jpeg'
        ),
        legend: boolean('legend', true),
        legendPosition: select(
          'legendPosition',
          Object.values(ChartLegendPositionEnum),
          ChartLegendPositionEnum.BOTTOM
        ),
        name: text('name', 'bubbles'),
        showDataLabels: boolean('showDataLabels', false),
        preTooltipValue: text('preTooltipValue', ''),
        postTooltipValue: text('postTooltipValue', ''),
        title: text('title', ''),
        height: number('height', 200),
        xTitle: text('xTitle', ''),
        yTitle: text('yTitle', ''),
        xSize: number('xSize', 3),
        ySize: number('ySize', 3),
        xLabels: object('xLabels', BUBBLE_CHART_CATEGORIES_MOCK),
        yLabels: object('yLabels', BUBBLE_CHART_CATEGORIES_MOCK),
        color: text('color', '#A4C9EF'),
        data: object('data', BUBBLE_CHART_DATA_MOCK),
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, BrowserAnimationsModule, ChartsModule],
      },
    };
  },
  { notes: { markdown: note } }
);
