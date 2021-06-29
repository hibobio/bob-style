import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ButtonsModule } from '../../buttons/buttons.module';
import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { CompactSearchModule } from './compact-search.module';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `
<b-compact-search [value]="value"
                  (searchChange)="searchChange($event)"
                  (searchFocus)="searchFocus($event)">
</b-compact-search>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Compact Search'" style="background-color:#faf7f2;">
  <div style="display: flex; align-items: center;">
    ${template}

    <b-button class="mrg-l-16" type="secondary" disabled="true">Click on the 🔍 icon</b-button>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Compact Search Element

  #### Module
  *SingleListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [value] | string | input value | &nbsp;
  (searchFocus) | EventEmitter<wbr>&lt;string&gt;  | emits on input focus | &nbsp;
  (searchChange) | EventEmitter<wbr>&lt;string&gt;  | emits on input value change | &nbsp;

  ~~~
  ${template}
  ~~~
`;
story.add(
  'Compact Search',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: text('value', ''),

        searchChange: action('searchChange'),
        searchFocus: action('searchFocus'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          CompactSearchModule,
          StoryBookLayoutModule,
          ButtonsModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
