import { storiesOf } from '@storybook/angular';
import { number, object, withKnobs } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EyeCandyModule } from '../eye-candy.module';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.EyeCandy, module).addDecorator(
  withKnobs
);

const template = `
  <b-snow #snow
          [numberOfFlakes]="numberOfFlakes"
          [snowDuration]="snowDuration"
          (complete)="onComplete()">
  </b-snow>
  <button (click)="snow.makeSnow()">let it snow!</button>
`;

const note = `
  ## Snow

  #### Module
  *EyeCandyModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [numberOfFlakes] | number | number of snow flakes to be rendered on page | 120
  [snowDuration] | number | amount of time after each no new flakes will be generated | 30,000
  (complete) | callback when the last snow flake is out of page & the requestAnimationFrame is canceled

  ~~~
  ${template}
  ~~~

`;

const storyTemplate = `
<b-story-book-layout [title]="'Snow'" style=" background: #000;">
    ${template}
</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    numberOfFlakes: number('numberOfFlakes', 120),
    snowDuration: number('snowDuration', 30 * 1000),
    onComplete: action('snow complete'),
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, BrowserAnimationsModule, EyeCandyModule],
  },
});

story.add('Snow', toAdd, { notes: { markdown: note } });
