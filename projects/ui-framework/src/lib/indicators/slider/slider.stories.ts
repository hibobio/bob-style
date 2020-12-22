import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  withKnobs,
  number,
  boolean,
} from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SliderModule } from './slider.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);
const template = `
<b-slider [value]="value"
          [min]="min"
          [max]="max"
          [step]="step"
          [disabled]="disabled"
          [showLabel]="showLabel"
          [readOnly]="readOnly"
          [labelSymbol]="labelSymbol"
          (progressChange)="progressChange($event)">
</b-slider>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Slider'">
  <div style="max-width: 400px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Slider Element
  #### Module
  *SliderModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [value] | number | Current slider value | 0
  [min] | number | Minimum value of the slider | 0
  [max] | number | Maximum value of the slider | 100
  [step] | number | Step for each slider change | 1
  [showLabel] | boolean | Show the value label with symbol | true
  [disabled] | boolean | Disabled mode | false
  [readOnly] | boolean | Set slider to read only | false
  [labelSymbol] | string | The symbol for the label | '%'
  (progressChange) | EventEmitter<wbr>&lt;MatSliderChange&gt; | Progress change event | &nbsp;

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Slider',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: number('value', 30),
        min: number('min', 0),
        max: number('max', 100),
        step: number('step', 1),
        showLabel: boolean('showLabel', true),
        disabled: boolean('disabled', false),
        readOnly: boolean('readOnly', false),
        labelSymbol: text('labelSymbol', '%'),
        progressChange: action('progressChange'),
      },
      moduleMetadata: {
        imports: [SliderModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
