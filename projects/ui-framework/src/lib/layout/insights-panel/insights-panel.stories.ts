import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { object, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { Icons } from '../../icons/icons.enum';
import { mockText } from '../../mock.const';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { InsightsPanelType } from './insights-panel.enums';
import { InsightsPanelModule } from './insights-panel.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const type = Object.values(InsightsPanelType);

const template1 = `
  <b-insights-panel
        [type]="type"
        [data]="data"
        [config]="config"
  ></b-insights-panel>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Insight Panel'">
  <div style="justify-content: flex-end;display: flex;">
    ${template1}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Insights Panel
  #### Module
  *InsightsPanelModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  text | string | text to be displayed in divider | null

  ~~~
  ${template1}
  ~~~
`;

const data = [
  {
    title: 'At a glance',
    content: `The number of leavers between <strong>Q1 2020</strong> and <strong>Q4 2020</strong> was highest in Kendall Roys team (13.25 per quarter), which is 73% of all company leavers. ${mockText(
      50
    )}`,
    icon: Icons.analytics,
  },
  {
    title: 'Spotlight',
    content:
      'For 60% of teams, <strong>Q3 2020</strong> was the quarter with the highest number of leavers.',
  },
  {
    title: 'Outliers',
    content:
      "The number of leavers in Kendall Roy's team during <strong>Q3 2020</strong> (10) was lower than expected from the average trend for that group.",
  },
];

story.add(
  'Insight Panel',
  () => {
    return {
      template: storyTemplate,
      props: {
        config: object('config', {
          collapsible: true,
          icon: Icons.graph_timeline,
          expandButtonText: 'INSIGHTS',
          maxLines: 3,
        }),
        type: select('type', type, InsightsPanelType.information),
        data: data,
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          InsightsPanelModule,
          TypographyModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
