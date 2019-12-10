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

const story = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);
const template = `
<div>
  <small>Demo of all binding options</small>
  <b-pie-chart
    [data]="data"
    [preTooltipValue]="preTooltipValue"
    [postTooltipValue]="postTooltipValue"
    [donut]="donut"
    [showDataLabels]="showDataLabels"
    [legend]="legend"
    [colorPalette]="colorPalette"
    [name]="name"
    [height]="height"
    [donutWidth]="donutWidth"
    [donutInnerSize]="donutInnerSize"
    [title]="title"
    [pointFormat]="pointFormat"
    #chart
  >
  </b-pie-chart>
  <button (click)="chart.exportChart(downloadChart)">download</button>
</div>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Pie Chart'">
    ${template}
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
  donut (optional) | boolean | make pie chart donut chart | false
  showDataLabels (optional) | boolean | shows label in pie | false
  legend (optional) | boolean | shows legend | false
  colorPalette (optional) | string[] | color palette array | default array of colors
  height (optional) | number | height of chart | 500
  donutInnerSize (optional) | number | defining the inner white circle in a donut pie chart | 60
  donutWidth (optional) | number | overrides donutInnerSize by applying width of donut instead inner circle width |
  title (optional) | string | title of chart | &nbsp;
  pointFormat (optional) | string | tooltip formatter | {series.name}: <b>{point.percentage:.1f}%</b>
`;

story.add(
  'Pie chart',
  () => {
    return {
      template: storyTemplate,
      props: {
        downloadChart: select(
          'downloadChart',
          [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/svg+xml'
          ],
          'image/jpeg'),
        showDataLabels: boolean('showDataLabels', false),
        donut: boolean('donut', false),
        legend: boolean('legend', true),
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
