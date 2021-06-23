import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ChartsModule } from '../../../../bob-charts/src/charts/charts.module';
import { ComponentGroupType } from '../../consts';
import { ContentTemplateModule } from '../../services/utils/contentTemplate.directive';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { LabelValueModule } from '../../typography/label-value/label-value.module';
import {
  summaryInsightsDataMock,
  summaryInsightsDataMock2,
} from './summary-insights.mock';
import { SummaryInsightsModule } from './summary-insights.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const ex2code = `<b-summary-insights [data]="data"
    class="bg-grey-100 rounded pad-16
                brd-0 spread">`;

const template1 = `<b-summary-insights
    [data]="data">

    <ng-container *contentTemplate="let data=data; name:'item'">
      <b-donut-text-chart
          [donutSize]="data?.donutSize"
          [data]="data?.data"
          [name]="data?.name"
          [legend]="false">
            <span>{{data?.text}}</span>
      </b-donut-text-chart>
      <b-label-value class="mrg-l-12"
                [labelValue]="data?.labelValue"
                type="10"
                swap="true">
      </b-label-value>
    </ng-container>

</b-summary-insights>

<b-summary-insights
    class="bg-grey-100 rounded pad-16 brd-0 spread mrg-t-32"
    [data]="data2">

    <ng-container *contentTemplate="let data=data;">
      <h4 class="b-display-3 mrg-b-16">
        {{ data.title }}
      </h4>
      <p class="mrg-0 pre-wrap">{{ data.text}}</p>
    </ng-container>

</b-summary-insights>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Summary Insights'">
  <div style="text-align:left; max-width:800px; display: flex; flex-direction: column;">
    ${template1}

     <br>
      <textarea style="resize: none;padding: 0;height: 85px;width: 100%;border: 0;background: transparent; margin-left: auto;max-width: 360px;" readonly disabled [value]="ex2code">
      </textarea>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Summary Insights
  #### Module
  *SummaryInsightsModule*

  (also import <u>ContentTemplateModule</u> to use <u>contentTemplates</u> for label-value's info-tooltips)

  ~~~
  ${template1}
  ~~~

  **Note**<br> Customize b-summary-insights with atomic classes:<br>
  - You can modify the column gap with \`gap-X\` classes (where X is number, dividable by 8 from 0 to 48)<br>
  - You can remove separators with \`brd-0\` class.<br>
  - Make items 'grow' with \`spread\` class.
  <br>

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [data] | SummaryInsight[] | summary items


  #### interface: SummaryInsight
  Name | Type | Description
  --- | --- | ---
  type | SummaryInsightType | selects item type
  data | LabelValue / ProgressBar / ProgressDonut | for descriptions of interfaces see related components

  #### example data

~~~
[
    {
      "type": "LabelValue",
      "data": {
        "label": "05:32",
        "value": "Conditioner",
        "type": "6",
        "labelStyle": {
          "fontWeight": 600
        },
        "valueDescription": {
          "useContentTemplate": true,
          "title": "Info-tooltip title",
          "text": "Info-tooltip text",
        },
        "labelDescription": false
      }
    },
    {
      "type": "ProgressDonut",
      "data": {
        "data": {
          "value": 30,
          "headerTextPrimary": "30%",
          "headerTextSecondary": "Leg warmers",
          "color": "#154156"
        }
      }
    },
    {
      "type": "ProgressBar",
      "data": {
        "data": {
          "value": 57,
          "headerTextPrimary": "Keyboard",
          "color": "#776926"
        }
      }
    }
]
~~~

`;

story.add(
  'Summary Insights',
  () => {
    return {
      template: storyTemplate,
      props: {
        data: object('data', summaryInsightsDataMock),
        data2: object('data2', summaryInsightsDataMock2),
        ex2code: ex2code,
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          SummaryInsightsModule,
          ContentTemplateModule,
          ChartsModule,
          LabelValueModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
