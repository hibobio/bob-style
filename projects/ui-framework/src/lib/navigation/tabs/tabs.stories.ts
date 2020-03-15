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
import { makeArray, simpleUID } from '../../services/utils/functional-utils';
import { mockHobbies } from '../../mock.const';

const story = storiesOf(ComponentGroupType.Navigation, module).addDecorator(
  withKnobs
);

const tabs: Tab[] = makeArray(15).map(() => ({
  label: mockHobbies(1),
  key: simpleUID(),
}));

const template = `
<b-tabs
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

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [tabs] | Tab[] | tabs metadata
  [type] | TabsType | tabs style (defaults to 'primary')
  [selectedIndex] | number | the selected tab index
  (selectClick) | EventEmitter<wbr>&lt;TabChangeEvent&gt; | emits Tab and tab index, when tab was clicked
  (selectChange) | EventEmitter<wbr>&lt;TabChangeEvent&gt; | emits Tab and tab index, when tab was changed

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
        selectedIndex: number('selectedIndex', 0),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, TabsModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
