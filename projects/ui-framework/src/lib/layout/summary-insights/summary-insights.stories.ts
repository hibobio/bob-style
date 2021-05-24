import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { ContentTemplateModule } from '../../services/utils/contentTemplate.directive';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import {
  summaryInsightsDataMock,
  summaryInsightsDataMock2,
} from './summary-insights.mock';
import { SummaryInsightsModule } from './summary-insights.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template1 = `<b-summary-insights
    [data]="data">
</b-summary-insights>

<b-summary-insights
    class="bg-grey-100 rounded pad-16 brd-0 flex-grow mrg-t-32"
    [data]="data2">

    <ng-container *contentTemplate="let data=data">
      <h4 class="b-display-3 mrg-b-16">
        {{ data.title }}
      </h4>
      <p class="mrg-0 pre-wrap">{{ data.text}}</p>
    </ng-container>
</b-summary-insights>`;

const storyTemplate = `
<b-story-book-layout [title]="'Summary Insights'">
  <div style="text-align:left; max-width:800px">
    ${template1}
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
          "iconSize": "small",
          "iconColor": "normal"
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
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          SummaryInsightsModule,
          ContentTemplateModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
