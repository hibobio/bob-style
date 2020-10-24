import { storiesOf } from '@storybook/angular';
import { number, object, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EyeCandyModule } from '../eye-candy.module';
import { action } from '@storybook/addon-actions';
import { makeArray } from '../../services/utils/functional-utils';

const story = storiesOf(ComponentGroupType.EyeCandy, module).addDecorator(
  withKnobs
);

const template = `
  <b-confetti #confetti
              [colors]="colors"
              [numberOfConfetti]="numberOfConfetti"
              (complete)="onComplete()">
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
  [colors] | string[] | Array of colors in hex | []
  [numberOfConfetti] | number | number of confetti generated from each pos | 20
  [pos] | { x: number, y: number }[] | coords the confetti are generated from | null
  (complete) | callback when the last confetti is out of page & the requestAnimationFrame is canceled

  ~~~
  ${template}
  ~~~

`;

const storyTemplate = `
<b-story-book-layout [title]="'Confetti'" style=" background: rgb(247,247,247);">
    ${template}
</b-story-book-layout>
`;

const pos: { x: number; y: number }[] = makeArray(5).map(() => ({
  x: Math.random() * document.documentElement.clientWidth,
  y: Math.random() * document.documentElement.clientHeight,
}));

const toAdd = () => ({
  template: storyTemplate,
  props: {
    colors: object('colors', ['#000000', '#CCCCCC', '#FF0000']),
    numberOfConfetti: number('numberOfConfetti', 20),
    pos: object('pos', pos),
    onComplete: action('confetti complete'),
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, BrowserAnimationsModule, EyeCandyModule],
  },
});

story.add('Confetti', toAdd, { notes: { markdown: note } });
