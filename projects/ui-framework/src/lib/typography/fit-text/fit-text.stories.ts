import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  text,
  boolean,
  select,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { FitTextModule } from './fit-text.module';
import { mockAnimals } from '../../mock.const';
import { action } from '@storybook/addon-actions';
import { FitTextFontType } from './fit-text.component';

const story = storiesOf(ComponentGroupType.Typography, module).addDecorator(
  withKnobs
);

const displayTemplate = `<b-fit-text [text]="text"
          [type]="fontType"
          [stepped]="stepped"
          [syncMin]="syncMin"
          (changed)="onFontSizeChange($event)"></b-fit-text>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Fit Text'">
  <div style="max-width: none; display: flex; flex-direction: column; align-items: center; justify-content: center;">

    <div style="position: relative;">

     <textarea style="width: 100%; min-width: 50px; min-height: 50px; cursor: default; resize: both; height: 150px; width: 350px;" readonly title="Resize me!"></textarea>

      <span style="position: absolute; top:0; right:0; bottom:0; left:0; pointer-events: none; display: flex;">
          <b-fit-text #box1 [text]="text"
          [type]="fontType"
          [stepped]="stepped"
          [syncMin]="syncMin ? (box2.fontSize$ | async) : null"
          (changed)="fsBox1 = $event; onFontSizeChange($event)"></b-fit-text>
      </span>
    </div>

    <p>font-size: {{ (box1.fontSize$ | async) }}</p>
    <br>

    <div style="position: relative;">

     <textarea style="width: 100%; min-width: 50px; min-height: 50px; cursor: default; resize: both; height: 50px; width: 250px;" readonly title="Resize me!"></textarea>

      <span style="position: absolute; top:0; right:0; bottom:0; left:0; pointer-events: none; display: flex;">
          <b-fit-text #box2 [text]="'Renaissance'"
          [type]="fontType"
          [stepped]="stepped"
          [syncMin]="syncMin ? (box1.fontSize$ | async) : null"
          (changed)="fsBox1 = $event; onFontSizeChange($event)"></b-fit-text>
      </span>
    </div>

    <p>font-size: {{ (box2.fontSize$ | async) }}</p>

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
[syncMin] | number | connect output/subject from another fitText component to sync font-sizes (only syncs down) | &nbsp;
(changed) | EventEmitter<wbr>&lt;number&gt; | emits font-size, when changed | &nbsp;
fontSize$ | BehaviorSubject<wbr>&lt;number&gt; | holds latest font-size value | &nbsp;

`;
story.add(
  'Fit Text',
  () => ({
    template: storyTemplate,
    props: {
      text: text('text', mockAnimals(1)),
      stepped: boolean('stepped', false),
      fontType: select(
        'fontType',
        Object.values(FitTextFontType),
        FitTextFontType.display
      ),
      fsBox1: 0,
      fsBox2: 0,
      syncMin: boolean('enable syncMin', false),
      onFontSizeChange: action('fontSizeChange'),
    },
    moduleMetadata: {
      imports: [StoryBookLayoutModule, FitTextModule],
    },
  }),
  { notes: { markdown: note } }
);
