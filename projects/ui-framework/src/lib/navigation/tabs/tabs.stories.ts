import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { number, object, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { AvatarBadge } from '../../avatar/avatar/avatar.enum';
import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { mockHobbies } from '../../mock.const';
import { makeArray, simpleUID } from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TabsType } from './tabs.enum';
import { Tab } from './tabs.interface';
import { TabsModule } from './tabs.module';

const story = storiesOf(ComponentGroupType.Navigation, module).addDecorator(
  withKnobs
);

const tabs: Tab[] = makeArray(15).map(() => ({
  label: mockHobbies(1),
  key: simpleUID(),
}));

tabs[1].badge = AvatarBadge.error;

const template = `<b-tabs
    [tabs]="tabs"
    [type]="type"
    [selectedIndex]="selectedIndex"
    [controlled]="false"
    (selectClick)="selectClick($event)"
    (selectChange)="selectChange($event)">
</b-tabs>`;

const storyTemplate = `
<b-story-book-layout [title]="'Tabs'">
  <div style="max-width: 900px; min-width: 0;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Tabs Element
  #### Module
  *TabsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [tabs] | Tab[] | tabs metadata | &nbsp;
  [type] | TabsType | tabs style | 'primary
  [selectedIndex] | number | the selected tab index | &nbsp;
  [controlled] | boolean | set to true to <u>disable</u> automatic tab change on click (when u need to control it from outside) | false
  (selectClick) | EventEmitter<wbr>&lt;TabChangeEvent&gt; | emits Tab and tab index, when tab was clicked.<br>**Note:** This output is mostly usefull when setting \`\`\`[controlled]="true"\`\`\` | &nbsp;
  (selectChange) | EventEmitter<wbr>&lt;TabChangeEvent&gt; | emits Tab and tab index, when tab was changed<br>**Note:** In most cases, use this output. | &nbsp;


  #### interface: Tab
  Name | Type | Description | Default
  --- | --- | ---
  label | string | tab title
  key? | string | tab id - **Note**: this will also be added as css class to the tab (for tracking)
  badge? | AvatarBadge / BadgeConfig | tab badge
`;
const selectClick = action('selectClick');
story.add(
  'Tabs',
  () => {
    return {
      template: storyTemplate,
      props: {
        tabs: object<Tab[]>('tabs', tabs),
        type: select('type', Object.values(TabsType), TabsType.primary),
        selectClick: function (e) {
          this.selectedIndex = e.index;
          selectClick(e);
        },
        selectChange: action('selectChange'),
        selectedIndex: number('selectedIndex', undefined),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, TabsModule, StoryBookLayoutModule],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
