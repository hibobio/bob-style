import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, withKnobs, number, boolean} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { SliderModule } from './slider.module';

  const sliderStories = storiesOf('Buttons & Indicators', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);
const template = `
  <b-slider
    [value]="value"
    [min]="min"
    [max]="max"
    [step]="step"
    [disabled]="disabled"
    [showLabel]="showLabel"
    [labelSymbol]="labelSymbol"
    (progressChange)="progressChange($event)">
  </b-slider>
`;
const note = `
  ## Slider Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  value | number | Current slider value | 0 (optional)
  min | number | Minimum value of the slider | 0 (optional)
  max | number | Maximum value of the slider | 100 (optional)
  step | number | Step for each slider change | 1 (optional)
  disabled | boolean | Disabled mode | false (optional)
  showLabel | boolean | Show the value label with symbol | true (optional)
  labelSymbol | string | The symbol for the label | '%' (optional)
  progressChange | EventEmitter | Progress change callback |

  ~~~
  ${template}
  ~~~
`;

sliderStories.add(
  'Slider',
  () => {
    return {
      template,
      props: {
        value: number('value', 0),
        min: number('min', 0),
        max: number('max', 100),
        step: number('step', 1),
        disabled: boolean('disabled', false),
        showLabel: boolean('showLabel', true),
        labelSymbol: text('labelSymbol', '%'),
        progressChange: action(),
      },
      moduleMetadata: {
        imports: [SliderModule]
      }
    };
  },
  { notes: { markdown: note }  }
);
