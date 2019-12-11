import { storiesOf } from '@storybook/angular';
import { number, object, withKnobs, } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EyeCandyModule } from '../eye-candy.module';
import { makeArray } from 'bob-style';

const story = storiesOf(ComponentGroupType.EyeCandy, module).addDecorator(
  withKnobs
);

const template = `
  <b-confetti #confetti
              [colors]="colors"
              [numberOfConfetti]="numberOfConfetti">
  </b-confetti>
  <button (click)="confetti.fireConfetti(pos)">Party!</button>
`;

const note = `
  ## Confetti

  #### Module
  *EyeCandyModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [avatarImages] | string[] | Array of image urls | []
  [centerAvatarImage] | string | the avatar to be displayed in center | null
  [speed] | number | avatar movement speed is around value | 4

  ~~~
  ${ template }
  ~~~

`;

const storyTemplate = `
<b-story-book-layout [title]="'Confetti'" style=" background: rgb(247,247,247);">
  <div style="
        position: relative;
        top: 0;
        left: 0;
        width: 90%;
        height: 400px;
        max-width: none;
  ">
    ${ template }
  </div>

</b-story-book-layout>
`;

const pos: { x: number, y: number }[] = makeArray(5).map(
  () => ({
    x: Math.random() * document.documentElement.clientWidth,
    y: Math.random() * document.documentElement.clientHeight,
  }));

const toAdd = () => ({
  template: storyTemplate,
  props: {
    colors: object('colors', ['#000000', '#CCCCCC', '#FF0000']),
    numberOfConfetti: number('numberOfConfetti', 20),
    pos: object('pos', pos),
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, BrowserAnimationsModule, EyeCandyModule]
  }
});

story.add('Confetti', toAdd, { notes: { markdown: note } });
