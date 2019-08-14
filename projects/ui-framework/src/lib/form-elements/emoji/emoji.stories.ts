import {storiesOf} from '@storybook/angular';
import {withKnobs} from '@storybook/addon-knobs/angular';
import {ComponentGroupType} from '../../consts';
import {StoryBookLayoutModule} from '../../story-book-layout/story-book-layout.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EmojiModule} from './emoji.module';
import {ButtonsModule} from '../../buttons-indicators/buttons/buttons.module';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
    <b-emoji style="position:fixed; right: 50%; bottom: 0; transform: translateX(50%)"
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
  Name | Type | Description | Default value
  --- | --- | --- | ---


  ~~~
  ${template}
  ~~~
`;

inputStories.add(
  'Emoji Picker',
  () => {
    return {
      template: storyTemplate,
      props: {
        emojiSelect: (emoji) => {
          alert(emoji);
        },
        toggleClick: (bool) => {
          // console.log(bool);
        }
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EmojiModule,
          ButtonsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
