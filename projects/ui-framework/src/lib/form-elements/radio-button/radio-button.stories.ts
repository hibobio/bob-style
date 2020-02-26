import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  object,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RadioButtonModule } from './radio-button.module';
import { values } from 'lodash';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { RadioDirection } from './radio-button.enum';

import formElemsPropsDoc from '../form-elements.properties.md';

const direction = values(RadioDirection);
const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-radio-button [radioConfig]="options"
                [value]="value"
                [label]="label"
                [direction]="direction"
                [disabled]="disabled"
                [required]="required"
                [readonly]="readonly"
                [hintMessage]="hintMessage"
                [warnMessage]="warnMessage"
                [errorMessage]="errorMessage"
                (radioChange)="radioChange($event)">
</b-radio-button>
`;

const stroyTemplate = `
<b-story-book-layout [title]="'Radio Buttons'">
    ${template}
</b-story-book-layout>`;

const note = `
  ## Radio Button Element
  #### Module
  *RadioButtonModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [radioConfig] | RadioConfig[] | list of RadioConfig ({id, label}) objects
  [value] | RadioConfig | selected option
  [direction] | RadioDirection | column or row, default=row
  (radioChange) | EventEmitter<wbr>&lt;string/number&gt; | fired on radio change, returns option ID

  ${formElemsPropsDoc}

`;

story.add(
  'Radio Button',
  () => {
    return {
      template: stroyTemplate,
      props: {
        value: object('value', { id: 0 }),
        direction: select('direction', direction, direction.row),

        label: text('label', 'Radio label'),
        required: boolean('required', false),
        disabled: boolean('disabled', false),
        readonly: boolean('readonly', false),

        hintMessage: text('hintMessage', 'Useful hint'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),

        radioChange: action('radioChange'),

        options: object('radioConfig', [
          { id: 0, label: 'Option one' },
          { id: 1, label: 'Option two' },
          { id: 2, label: 'Option three' },
        ]),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          RadioButtonModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
