import {storiesOf} from '@storybook/angular';
import {number, boolean, object, text, withKnobs} from '@storybook/addon-knobs/angular';
import {ComponentGroupType} from '../../consts';
import {StoryBookLayoutModule} from '../../story-book-layout/story-book-layout.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChartsModule} from '../charts.module';
import {TypographyModule} from '../../typography/typography.module';
import {NUMBER_OF_EMPLOYEES, PIE_CHART_DATA_MOCK} from '../pie-chart/pie-chart.mock';
const story = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);


const template = `
  <b-donut-text-chart
    [colorPalette]="colorPalette"
    [data]="data"
    [legend]="legend"
    [height]="height"
    [preTooltipValue]="preTooltipValue"
    [postTooltipValue]="postTooltipValue"
    [name]="name"
    [tooltipValueFormatter]="tooltipValueFormatter"
    [donutInnerSize]="donutInnerSize"
  >
    <b-display-3 style="color: #9d9c9c;">
      {{text}}
    </b-display-3>
  </b-donut-text-chart>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Donut Chart With Text'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Donut Text Chart

  #### Module
  *ChartModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---

`;

story.add(
  'Donut text chart',
  () => {
    return {
      template: storyTemplate,
      props: {
        tooltipValueFormatter: (tooltipValue) => {
          // custom value formatter suffix number pipe example
          if (isNaN(tooltipValue)) {
            return null;
          }
          if (tooltipValue === null) {
            return null;
          }
          if (tooltipValue === 0) {
            return null;
          }
          let abs = Math.abs(tooltipValue as number);
          const rounder = Math.pow(10, 1);
          const isNegative = tooltipValue < 0;
          let key = '';

          const powers = [
            { key: 'q', value: Math.pow(10, 15) },
            { key: 't', value: Math.pow(10, 12) },
            { key: 'b', value: Math.pow(10, 9) },
            { key: 'm', value: Math.pow(10, 6) },
            { key: 'k', value: 1000 }
          ];

          for (let i = 0; i < powers.length; i++) {
            let reduced = abs / powers[i].value;
            reduced = Math.round(reduced * rounder) / rounder;
            if (reduced >= 1) {
              abs = reduced;
              key = powers[i].key;
              break;
            }
          }
          return (isNegative ? '-' : '') + abs + key;
        },
        text: text('text', NUMBER_OF_EMPLOYEES + ''),
        name: text('name', 'employees'),
        legend: boolean('legend', false),
        height: number('height', 200),
        preTooltipValue: text('preTooltipValue', ''),
        postTooltipValue: text('postTooltipValue', ' PEOPLE'),
        donutInnerSize: number('donutInnerSize', 100),
        data: object('data', PIE_CHART_DATA_MOCK),
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
          ChartsModule,
          TypographyModule
        ]
      }
    };
  },
  {notes: {markdown: note}}
);
