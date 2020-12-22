import { storiesOf } from '@storybook/angular';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { FitTextModule } from './fit-text.module';
import { mockAnimals, mockCities, mockThings } from '../../mock.const';
import { action } from '@storybook/addon-actions';
import { FitTextFontType } from './fit-text.component';
import { randomNumber } from '../../services/utils/functional-utils';

const story = storiesOf(ComponentGroupType.Typography, module).addDecorator(
  withKnobs
);

const displayTemplate = `<b-fit-text [text]="text"
          [type]="fontType"
          [stepped]="stepped"
          [syncMin]="syncMin"
          [disableAnimation]="disableAnimation"
          (changed)="onFontSizeChange($event)"></b-fit-text>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Fit Text'">
<style>
  .container {
    max-width: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .box {
    position: relative;
  }
  .resizer {
    min-width: 50px;
    min-height: 50px;
    cursor: default;
    resize: both;
    overflow: hidden;
  }
  .fit-text-wrapper {
    position: absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    pointer-events: none;
    display: flex;
  }
</style>
  <div class="container">

    <div class="box">
     <textarea #resizer1 class="resizer"
      [style.width]="width1+'px'"
      [style.maxHeight]="width1+'px'"
      [style.minHeight]="(fsBox1 ? fsBox1 + 16 : 50)+'px'"
      [style.minWidth]="(fsBox1 && rText1 ? max((fsBox1 * rText1.length / 1.6), 50) : 50) + 'px'"
      rows="1"
      readonly title="Resize me!"></textarea>

      <span class="fit-text-wrapper">
        <b-fit-text #box1 [text]="rText1 || text1"
          [type]="fontType"
          [stepped]="stepped"
          [syncMin]="syncMin ? ([fsBox2,fsBox3]) : null"
          [disableAnimation]="disableAnimation"
          (changed)="fsBox1 = $event; onFontSizeChange($event)"></b-fit-text>
      </span>
    </div>

    <p>font-size: {{ (box1.fontSize$ | async) }}</p>
    <br>

    <div class="box">
     <textarea #resizer2 class="resizer"
      [style.width]="width2+'px'"
      [style.maxHeight]="width2+'px'"
      [style.minHeight]="(fsBox2 ? fsBox2 + 16 : 50)+'px'"
      [style.minWidth]="(fsBox2 && rText2 ? max((fsBox2 * rText2.length / 1.6), 50) : 50) + 'px'"
      rows="1"
      readonly title="Resize me!"></textarea>

      <span class="fit-text-wrapper">
        <b-fit-text #box2 [text]="rText2 || text2"
          [type]="fontType"
          [stepped]="stepped"
          [syncMin]="syncMin ? ([fsBox1,fsBox3]) : null"
          [disableAnimation]="disableAnimation"
          (changed)="fsBox2 = $event; onFontSizeChange($event)"></b-fit-text>
      </span>
    </div>

    <p>font-size: {{ (box2.fontSize$ | async) }}</p>

    <div class="box">
     <textarea #resizer3 class="resizer"
      [style.width]="width3+'px'"
      [style.maxHeight]="width3+'px'"
      [style.minHeight]="(fsBox3 ? fsBox3 + 16 : 50)+'px'"
      [style.minWidth]="(fsBox3 && rText3 ? max((fsBox3 * rText3.length / 1.6), 50) : 50) + 'px'"
      rows="1"
      readonly title="Resize me!"></textarea>

      <span class="fit-text-wrapper">
        <b-fit-text #box3 [text]="rText3 || text3"
          [type]="fontType"
          [stepped]="stepped"
          [syncMin]="syncMin ? ([fsBox1,fsBox2]) : null"
          [disableAnimation]="disableAnimation"
          (changed)="fsBox3 = $event; onFontSizeChange($event)"></b-fit-text>
      </span>
    </div>

    <p>font-size: {{ (box3.fontSize$ | async) }}</p>

    <br>
    <div class="flx">

      <button class="mrg-8" (click)="rText1 = mockCities(1); rText2 = mockAnimals(1); rText3 = mockThings(1); width1 = randomNumber(100,400); width2 = randomNumber(100,400); width3 = randomNumber(100,400); resizer1.style.removeProperty('height'); resizer2.style.removeProperty('height'); resizer3.style.removeProperty('height');" type="button">
      Gimme something
      </button>

      <button class="mrg-8" (click)="rText1 = randomNumber(10,99)+'%'; rText2 = randomNumber(1,99)+'%'; rText3 = randomNumber(100,999); width1 = randomNumber(100,400); width2 = randomNumber(100,400); width3 = randomNumber(100,400); resizer1.style.removeProperty('height'); resizer2.style.removeProperty('height'); resizer3.style.removeProperty('height');" type="button">
      ...but with numbers
      </button>

    </div>

  </div>
</b-story-book-layout>
`;

const note = `
## Fit Text
Fits text to container width (1 line)

#### Module: *FitTextModule*

~~~
${displayTemplate}
~~~

#### Properties
Name | Type | Description | default value
--- | --- | --- | ---
[text] | string | text to display | &nbsp;
[type] | FitTextFontType | font-family type | 'display'
[stepped] | boolean | if false, the font-size is fully rsponsive; <br>if true - will choose closest from bob's system font-sizes (min 11px, max 42px) | false
[syncMin] | number / number[] | will set font-size to the minimum between current font-size and provided number(s). Use this to sync font-sizes between fitText components (only syncs down) <br>(see below for example) | &nbsp;
[disableAnimation] | boolean | disables transitions between font-sizes | false
(changed) | EventEmitter<wbr>&lt;number&gt; | emits font-size, when changed | &nbsp;
fontSize$ | BehaviorSubject<wbr>&lt;number&gt; | holds latest font-size value | &nbsp;

#### syncMin example

~~~
<b-fit-text [text]="text1"
          [syncMin]="[fsBox2,fsBox3]"
          (changed)="fsBox1 = $event;"></b-fit-text>

<b-fit-text [text]="text2"
          [syncMin]="[fsBox1,fsBox3]"
          (changed)="fsBox2 = $event;"></b-fit-text>

<b-fit-text [text]="text3"
          [syncMin]="[fsBox1,fsBox2]"
          (changed)="fsBox3 = $event;"></b-fit-text>
~~~


`;
story.add(
  'Fit Text',
  () => ({
    template: storyTemplate,
    props: {
      text1: mockAnimals(1),
      text2: 'Renaissance',
      text3: mockThings(1),
      width1: 350,
      width2: 250,
      width3: 350,
      mockThings: mockThings,
      mockAnimals: mockAnimals,
      mockCities: mockCities,
      randomNumber: randomNumber,
      max: Math.max,
      min: Math.min,
      stepped: boolean('stepped', false),
      fontType: select(
        'fontType',
        Object.values(FitTextFontType),
        FitTextFontType.display
      ),
      disableAnimation: boolean('disableAnimation', false),
      syncMin: boolean('enable syncMin', false),
      onFontSizeChange: action('fontSizeChange'),
    },
    moduleMetadata: {
      imports: [StoryBookLayoutModule, FitTextModule],
    },
  }),
  { notes: { markdown: note } }
);
