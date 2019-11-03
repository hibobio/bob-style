import {storiesOf} from '@storybook/angular';
import {select, boolean, number, object, text, withKnobs} from '@storybook/addon-knobs/angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChartsModule} from '../../charts.module';
import {ComponentGroupType} from '../../../../../src/lib/consts';
import {StoryBookLayoutModule} from '../../../../../src/lib/story-book-layout/story-book-layout.module';
import {MULTI_BAR_CHART_CATEGORIES, MULTI_BAR_CHART_DATA_MOCK} from '../../chart.mock';
import {ChartLegendPositionEnum} from '../../chart/chart.interface';

const story = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);
const template = `
<div>
  <b-stacked-bar-chart
    [data]="data"
    [showDataLabels]="showDataLabels"
    [legendPosition]="legendPosition"
    [categories]="categories"
    [preTooltipValue]="preTooltipValue"
    [postTooltipValue]="postTooltipValue"
    [legend]="legend"
    [colorPalette]="colorPalette"
    [name]="name"
    [height]="height"
    [title]="title"
    [pointFormat]="pointFormat"
  >
  </b-stacked-bar-chart>
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

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  *name | string | name of series | none
  *data | | series data array for chart | none
  legend (optional) | boolean | shows legend | false
  colorPalette (optional) | string[] | color palette array | default array of colors
  height (optional) | number | height of chart | 500
  title (optional) | string | title of chart | none
  pointFormat (optional) | string | tooltip formatter | {series.name}: <b>{point.percentage:.1f}%</b>
`;

story.add(
  'Stacked bar chart',
  () => {
    return {
      template: storyTemplate,
      props: {
        showDataLabels: boolean('showDataLabels', false),
        legendPosition: select('legendPosition',
          Object.values(ChartLegendPositionEnum),
          ChartLegendPositionEnum.BOTTOM),
        legend: boolean('legend', true),
        name: text('name', 'employees'),
        preTooltipValue: text('preTooltipValue', ''),
        postTooltipValue: text('postTooltipValue', ' PEOPLE'),
        title: text('title', ''),
        height: number('height', 200),
        data: object('data', MULTI_BAR_CHART_DATA_MOCK),
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
        ])
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          ChartsModule
        ]
      }
    };
  },
  {notes: {markdown: note}}
);
