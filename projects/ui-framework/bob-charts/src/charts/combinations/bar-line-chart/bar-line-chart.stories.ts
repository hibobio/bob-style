import { storiesOf } from '@storybook/angular';
import {
  select,
  boolean,
  number,
  object,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentGroupType } from '../../../../../src/lib/consts';
import { StoryBookLayoutModule } from '../../../../../src/lib/story-book-layout/story-book-layout.module';
import { ChartsModule } from '../../charts.module';
import {
  COMBINED_BAR_CHART_DATA_MOCK,
  MULTI_BAR_CHART_CATEGORIES,
} from '../../chart.mock';
import { ChartLegendPositionEnum } from '../../chart/chart.interface';

const story = storiesOf(
  `${ComponentGroupType.Charts}.Combinations`,
  module
).addDecorator(withKnobs);
const template = `
<div>
  <b-bar-line-chart
    [data]="data"
    [legendPosition]="legendPosition"
    [showDataLabels]="showDataLabels"
    [preTooltipValue]="preTooltipValue"
    [postTooltipValue]="postTooltipValue"
    [categories]="categories"
    [legend]="legend"
    [colorPalette]="colorPalette"
    [name]="name"
    [height]="height"
    [title]="title"
    [pointFormat]="pointFormat"
  >
  </b-bar-line-chart>
</div>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Combination - bar / line Chart'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Combination Chart

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
  *name | string | name of series | none
  *data | | series data array for chart | none
  donut (optional) | boolean | make pie chart donut chart | false
  legend (optional) | boolean | shows legend | false
  colorPalette (optional) | string[] | color palette array | default array of colors
  height (optional) | number | height of chart | 500
  title (optional) | string | title of chart | none
  pointFormat (optional) | string | tooltip formatter | {series.name}: <b>{point.percentage:.1f}%</b>
`;

story.add(
  'Bar/line chart',
  () => {
    return {
      template: storyTemplate,
      props: {
        legend: boolean('legend', true),
        legendPosition: select(
          'legendPosition',
          Object.values(ChartLegendPositionEnum),
          ChartLegendPositionEnum.BOTTOM
        ),
        showDataLabels: boolean('showDataLabels', false),
        name: text('name', 'employees'),
        preTooltipValue: text('preTooltipValue', ''),
        postTooltipValue: text('postTooltipValue', ' PEOPLE'),
        title: text('title', ''),
        height: number('height', 200),
        data: object('data', COMBINED_BAR_CHART_DATA_MOCK),
        categories: object('categories', MULTI_BAR_CHART_CATEGORIES),
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
