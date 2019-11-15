import { storiesOf } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmojiModule } from './emoji.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TruncateTooltipModule } from '../truncate-tooltip/truncate-tooltip.module';

const story = storiesOf(ComponentGroupType.Popups, module).addDecorator(
  withKnobs
);

const template = `
    <b-emoji style="position:absolute; right: 50%; bottom: 0; transform: translateX(50%)"
    [title]="title"
    (emojiSelect)="emojiSelect($event)"
    (toggleClick)="toggleClick($event)">
      <span
        style="font-size: 40px;
        display:inline-block;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align:center;">
        😀
      </span>
    </b-emoji>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Emoji Picker'">
  <div style="max-width: 300px;">
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
  (toggleClick) | EventEmitter&lt;boolean&gt; | emits on popup open/close
  (emojiSelect) | EventEmitter&lt;Emoji&gt; | emits selected emoji

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
        emojiSelect: emoji => {
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
  { notes: { markdown: note } }
);
