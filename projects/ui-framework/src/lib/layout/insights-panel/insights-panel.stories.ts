import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import {
  boolean,
  number,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { Icons } from '../../icons/icons.enum';
import { mockText } from '../../mock.const';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { InsightsPanelType } from './insights-panel.enum';
import { InsightsPanelModule } from './insights-panel.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const type = Object.values(InsightsPanelType);

const template1 = `
  <b-insights-panel
        [type]="type"
        [data]="data"
        [config]="{
          collapsible:collapsible,
          icon:icon,
          maxLines:maxLines,
          expandButtonText:expandButtonText,
          readMoreLinkText:readMoreLinkText
        }"
        [expanded]="expanded"
        (expanded)="onExpand($event ? 'yes' : 'no')"
  ></b-insights-panel>
`;

const templateForNotes = `
  <b-insights-panel
        [type]="type"
        [data]="data"
        [config]="config"
        [expanded]="expanded"
        (expanded)="onExpand($event)"
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

  ~~~
  ${templateForNotes}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [type] | InsightsPanelType | type (information, warning, error, success)
  [config] | InsightsPanelConfig | panel config
  [data] | InsightsPanelData[] | insights data
  [expanded] | boolean | control expanded/collapsed state
  (expanded) | EventEmitter<wbr>&lt;boolean&gt; | emits on expanded/collapsed state change

  #### interface: InsightsPanelConfig
  Name | Type | Description
  --- | --- | ---
  collapsible? | boolean | if panel is collapsible
  icon? | Icons | default icon for the section header
  maxLines? | number | max lines of section content before 'View more' link is shown
  expandButtonText? | string | text for the expand/collapse button
  readMoreLinkText? | string | text for the 'View more' link
  headingClass, sectionClass |string / string[] / object | custom content & heading classes - support what ngClass binding supports
  headingStyle, sectionStyle | object | custom content & heading css styles - support what ngStyle supports

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
        type: select('type', type, InsightsPanelType.information, 'Props'),
        expanded: boolean('expanded', false, 'Props'),
        collapsible: boolean('collapsible', true, 'Props'),
        icon: select(
          'icon',
          [
            Icons.graph_timeline,
            Icons.analytics,
            Icons.analytics_alt,
            Icons.chart,
            Icons.chart_area,
            Icons.chart_bar_horiz,
            Icons.chart_bar_vert,
            Icons.chart_donut,
            Icons.chart_line,
          ],
          Icons.graph_timeline,
          'Props'
        ),
        maxLines: number('maxLines', 3, {}, 'Props'),
        expandButtonText: text('expandButtonText', 'Insights', 'Props'),
        readMoreLinkText: text('readMoreLinkText', 'Read More', 'Props'),
        data: data,
        dataNotes: object('data', data, 'Data'),
        onExpand: action('expanded'),
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
