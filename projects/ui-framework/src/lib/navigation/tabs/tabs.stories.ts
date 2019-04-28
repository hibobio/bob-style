import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { TabsModule } from './tabs.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { Tab } from './tabs.interface';

const inputStories = storiesOf(ComponentGroupType.Navigation, module).addDecorator(withKnobs);

const tabs: Tab[] = [
  {
    label: 'tab 1'
  },
  {
    label: 'tab 2'
  },
  {
    label: 'tab 3'
  }
];
const template = `
<b-tabs [tabs]="tabs"
        [onSelectedTabChange]="onSelectedTabChange"
        [selectedIndex]="selectedIndex">
</b-tabs>`;

const storyTemplate = `
<b-story-book-layout [title]="'Tabs'">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Tabs Element
  #### Module
  *TabsModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  tabs | Tabs[] | tabs metadata
  onSelectedTabChange | function | function for the change tab event
  selectedIndex | number | the selected tab index 0-n

  ~~~
  ${template}
  ~~~
`;
inputStories.add(
  'Tabs',
  () => {
    return {
      template: storyTemplate,
      props: {
        tabs: object<Tab>('tabs', tabs),
        onSelectedTabChange: action(),
        selectedIndex: number('selectedIndex', 0, 0)
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, TabsModule, StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
