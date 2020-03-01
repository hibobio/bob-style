import { storiesOf, moduleMetadata } from '@storybook/angular';
import { object, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';

// @ts-ignore
import * as readme from './README.md';

import { EmojiChipListComponent } from './emoji-chip-list.component';
import { ComponentGroupType } from '../../consts';
import { EmojiFromCodePipe } from './emoji-from-code.pipe';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';

const storyTemplate = `
<b-story-book-layout [title]="'Emoji Chip List'">
  <div>
    <b-emoji-chip-list
    [chips]="chips"
    (chipClicked)="chipClicked($event)"
    ></b-emoji-chip-list>
  </div>
</b-story-book-layout>
`;

storiesOf(ComponentGroupType.Chips, module)
  .addDecorator(withKnobs)
  .addDecorator(
    moduleMetadata({
      declarations: [EmojiChipListComponent, EmojiFromCodePipe],
      imports: [
        StoryBookLayoutModule,
        MatTooltipModule,
        BrowserAnimationsModule,
      ],
      providers: [],
      schemas: [],
    })
  )
  .add(
    'Emoji chip list',
    () => ({
      template: storyTemplate,
      props: {
        chipClicked: action('chip clicked'),
        chips: object(
          'chips',
          [
            '1F600',
            '1F45F',
            '1F452',
            '1F3A9',
            '1F393',
            '1F451',
            '1F392',
            '1F45D',
          ].map((emoji, idx) => {
            return {
              emoji: emoji,
              tooltip: `emoji number ${idx + 1}`,
              number: Math.ceil(Math.random() * 500),
            };
          })
        ),
      },
    }),
    {
      notes: {
        markdown: readme.default,
        markdownOptions: {
          breaks: true,
        },
      },
    }
  );
