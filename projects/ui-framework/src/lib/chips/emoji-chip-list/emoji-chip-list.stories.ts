import { storiesOf } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmojiChipListModule } from './emoji-chip-list.module';
import { EmojiChip } from './emoji-chip-list.interface';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const template = `<b-emoji-chip-list
    [chips]="chips"
    (chipClicked)="chipClicked($event)">
</b-emoji-chip-list>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Emoji Chip List'">
  <div>
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Emoji Chip List

  #### Module
  *EmojiChipListModule*

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [valueFormatter] | Function | number formatter function
  [chips] | EmojiChip[] | list of emoji chips
  (chipClicked) | EventEmitter<wbr>&lt;EmojiChip&gt; | emits on chip click

  ~~~
  ${template}
  ~~~

  #### interface EmojiChip
  Name | Type | Description
  --- | --- | ---
  emoji | string | emoji code
  tooltip? | string | tooltip text
  number? | number / string | reactions counter
  selected? | boolean | mark as selected
`;

const mock: EmojiChip[] = [
  '1F600',
  '1F45F',
  '1F452',
  '1F3A9',
  '1F393',
  '1F451',
  '1F392',
  '1F45D',
].map((emoji, idx) => ({
  emoji: emoji,
  tooltip: `emoji number ${idx + 1}`,
  number: Math.ceil(Math.random() * 500),
  ...(idx === 0 ? { selected: true } : {}),
}));

story.add(
  'Emoji chip list',
  () => ({
    template: storyTemplate,
    props: {
      chipClicked: action('chip clicked'),
      chips: object('chips', mock),
    },
    moduleMetadata: {
      imports: [
        StoryBookLayoutModule,
        BrowserAnimationsModule,
        EmojiChipListModule,
      ],
    },
  }),
  { notes: { markdown: note } }
);
