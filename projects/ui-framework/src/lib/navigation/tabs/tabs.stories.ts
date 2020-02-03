import { storiesOf } from '@storybook/angular';
import {
  number,
  object,
  select,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { TabsModule } from './tabs.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { Tab } from './tabs.interface';
import { TabsType } from './tabs.enum';

const story = storiesOf(ComponentGroupType.Navigation, module).addDecorator(
  withKnobs
);

const tabs: Tab[] = [
  {
    label: 'Add new hire',
    key: 'add.new.hire',
  },
  {
    label: 'Employee changes',
    key: 'employee.changes',
  },
  {
    label: 'Leave',
    key: 'leave',
  },
  {
    label: 'Termination',
  },
];
const template = `
<b-tabs
  [controlled]="true"
  [tabs]="tabs"
  [type]="type"
  [selectedIndex]="selectedIndex"
  (selectClick)="selectClick($event)"
  (selectChange)="selectChange($event)">
</b-tabs>`;

const storyTemplate = `
<b-story-book-layout [title]="'Tabs'">
  <div style="max-width: 900px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Tabs Element
  #### Module
  *TabsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [tabs] | Tabs[] | tabs metadata
  [type] | TabsType | tabs style (defaults to 'primary')
  [selectedIndex] | number | the selected tab index 0-n
  (selectClick) | MatTabChangeEvent | event contains the index (number) and the matTab
  (selectChange) | MatTabChangeEvent | event contains the index (number) and the matTab

  ~~~
  ${template}
  ~~~
`;
const selectClick = action('selectClick');
story.add(
  'Tabs',
  () => {
    return {
      template: storyTemplate,
      props: {
        tabs: object<Tab>('tabs', tabs),
        type: select('type', Object.values(TabsType), TabsType.primary),
        selectClick: function(e) {
          this.selectedIndex = e.index;
          selectClick(e);
        },
        selectChange: action('selectChange'),
        selectedIndex: number('selectedIndex', 0, 0),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, TabsModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
