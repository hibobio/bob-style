import { storiesOf } from '@storybook/angular';
import {
  select,
  number,
  boolean,
  object,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../../../src/lib/consts';
import { StoryBookLayoutModule } from '../../../../src/lib/story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from '../charts.module';
import { TypographyModule } from 'bob-style';
import { LINE_CHART_DATA_MOCK, NUMBER_OF_EMPLOYEES } from '../chart.mock';
import { ChartLegendPositionEnum } from '../charts.interface';
import { DonutSize } from '../charts.enum';
const story = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);

const template = `<b-donut-text-chart
        [donutSize]="donutSize"
        [donutInnerSize]="donutInnerSize"
        [height]="height"
        [colorPalette]="colorPalette"
        [legendPosition]="legendPosition"
        [data]="data"
        [name]="name"
        [legend]="legend"
        [preTooltipValue]="preTooltipValue"
        [postTooltipValue]="postTooltipValue"
        [tooltipValueFormatter]="tooltipValueFormatter">
        <span>
          {{text}}
        </span>
  </b-donut-text-chart>`;

const storyTemplate = `
<b-story-book-layout [title]="'Donut Chart With Text (Pie chart)'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Donut Text Chart  (Pie chart)

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

  See <a href="https://hibobio.github.io/bob-style/?path=/info/components-charts--pie-chart">Pie Chart notes</a>

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
            { key: 'k', value: 1000 },
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

        donutSize: select(
          'donutSize',
          [0, ...Object.values(DonutSize)],
          0,
          'Props'
        ),
        donutInnerSize: number('donutInnerSize', 0, {}, 'Props'),
        height: number('height', 0, [], 'Props'),

        text: text('text', NUMBER_OF_EMPLOYEES + '', 'Props'),
        name: text('name', 'employees', 'Props'),
        legend: boolean('legend', false, 'Props'),

        legendPosition: select(
          'legendPosition',
          Object.values(ChartLegendPositionEnum),
          ChartLegendPositionEnum.BOTTOM,
          'Props'
        ),

        preTooltipValue: text('preTooltipValue', '', 'Props'),
        postTooltipValue: text('postTooltipValue', ' PEOPLE', 'Props'),

        data: object('data', LINE_CHART_DATA_MOCK, 'Data'),

        colorPalette: object(
          'colorPalette',
          [
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
          ],
          'Data'
        ),
      },

      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          ChartsModule,
          TypographyModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
