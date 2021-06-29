import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { WidgetBoxModule } from './widget-box.module';

const story = storiesOf(ComponentGroupType.Widgets, module).addDecorator(
  withKnobs
);

const template = `<b-widget-box [title]="'New joiners'">
<div header-right>some filter</div>
<b-list-layout [items]="items" content>
  <div *bListLayoutItem="let item=item">
      I'm <strong>{{ item.name }}</strong> and I'm <span [ngStyle]="{'color': item.color}">{{ item.color }}</span>
  </div>
</b-list-layout>
</b-widget-box>`;

const storyTemplate = `
<b-story-book-layout [title]="'Widget BoxWidget'">
<div style="max-width:850px; display: flex; justify-content: center;">
  <b-widget-box [title]="'New joiners'" style="width: 384px">
  <div header-right>some filter</div>
  <b-list-layout [items]="items" content>
    <div *bListLayoutItem="let item=item">
      I'm <strong>{{ item.name }}</strong> and I'm <span [ngStyle]="{'color': item.color}">{{ item.color }}</span>
    </div>
  </b-list-layout>
  </b-widget-box>
</div>
</b-story-book-layout>
`;

const note = `
  ## Widget Box

  #### Module
  *WidgetBoxModule*

  ~~~
  ${template}
  ~~~

  **Note:**
  b-widget-box uses content-projection with 2 designated slots:
  [1] header-right - can be any element with "header-right" directive
  [2] content - must be <b-list-layout> element with "content" directive

`;

story.add(
  'Widget Box',
  () => {
    return {
      template: storyTemplate,
      props: {
        items: [
          {
            name: 'Deep',
            color: 'purple',
          },
          {
            name: 'Simple',
            color: 'red',
          },
        ],
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          WidgetBoxModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: {
      timestamps: true,
      escapeHTML: false,
    },
  }
);
