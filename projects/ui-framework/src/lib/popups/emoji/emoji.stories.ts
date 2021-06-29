import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ButtonsModule } from '../../buttons/buttons.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TruncateTooltipModule } from '../truncate-tooltip/truncate-tooltip.module';
import { EmojiModule } from './emoji.module';

const story = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `
    <b-emoji [title]="title"
      (emojiSelect)="emojiSelect($event)"
      (toggleClick)="toggleClick($event)">

        <span style="font-size: 40px;">
          😀
        </span>

    </b-emoji>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Emoji Picker'">
  <div style="max-width: 300px; position: relative; height: 50vh; display: flex; align-items: flex-end; justify-content: center;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Emoji picker

  #### Module
  *EmojiModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [title] | string | popup title
  (toggleClick) | EventEmitter<wbr>&lt;boolean&gt; | emits on popup open/close
  (emojiSelect) | EventEmitter<wbr>&lt;Emoji&gt; | emits selected emoji

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Emoji Picker',
  () => {
    return {
      template: storyTemplate,
      props: {
        title: text('title', 'Add Reaction'),
        emojiSelect: (emoji) => {
          alert(JSON.stringify(emoji));
        },
        toggleClick: () => {},
      },
      moduleMetadata: {
        imports: [
          TruncateTooltipModule,
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EmojiModule,
          ButtonsModule,
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
