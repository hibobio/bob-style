import { storiesOf } from '@storybook/angular';
import { boolean, object, select, text, withKnobs } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { InsightsPanelModule } from './insights-panel.module';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { InsightsPanelType } from './insights-panel.enums';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs,
);

const iconTypes = Object.values(Icons);
const type = Object.values(InsightsPanelType);
const iconSizes = Object.values(IconSize);
const iconColor = Object.values(IconColor);

const template1 = `

`;

const storyTemplate = `
<b-story-book-layout [title]="'Insight Panel'">
<div>
  <b-insights-panel
        [data]="data"
        [iconSize]="iconSize"
        [iconType]="iconType"
        [maxLines]="maxLines"
        [iconColor]="iconColor"
        [isContracteble]="isContracteble"
        [type]="type"
  ></b-insights-panel>
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

story.add(
  'Insight Panel',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', type, InsightsPanelType.information),
        iconType: select('iconType', iconTypes, Icons.graph_timeline),
        iconColor: select('iconColor', iconColor, IconColor.dark),
        isContracteble: boolean('isContracteble', true),
        iconSize: select('iconSize', iconSizes, IconSize.large),
        maxLines: 3,
        data: object('data', [{
          title: 'At a glance',
          content: 'The number of leavers between Q1 2020 and Q4 2020 was highest in Kendall Roys team (13.25 per quarter), which is 73% of all company leavers. The number of leavers between Q1 2020 and Q4 2020 was highest in Kendall Roys team (13.25 per quarter), which is 73% of all company leavers. The number of leavers between Q1 2020 and Q4 2020 was highest in Kendall Roys team (13.25 per quarter), which is 73% of all company leavers. The number of leavers between Q1 2020 and Q4 2020 was highest in Kendall Roys team (13.25 per quarter), which is 73% of all company leavers. ',
        },
          {
            title: 'Spotlight',
            content: 'For 60% of teams, Q3 2020 was the quarter with the highest number of leavers.',
          },
          {
            title: 'Outliers',
            content: 'The number of leavers in Kendall Roy\'s team during Q3 2020 (10) was lower than expected from the average trend for that group.',
          },
        ]),
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
  { notes: { markdown: note } },
);
