import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { FormElementSize } from '../form-elements.enum';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
import { FormElementsCommonProps } from '../form-elements.stories.common';
import { COLOR_PICKER_DEFAULT } from './color-picker.const';
import { ColorPickerModule } from './color-picker.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `<form [formGroup]="form">
<b-colorpicker
      formControlName="colorPicker"
      [config]="{
        emitOnChange: emitOnChange,
        showClearButton: showClearButton,
        showFooter: showFooter,
        defaultValue: defaultValue === 'null' ? null : defaultValue
      }"
      [value]="value === 'null' ? null : value"
      [label]="label"
      [placeholder]="placeholder"
      [description]="description"
      [isDisabled]="disabled"
      [required]="required"
      [readonly]="readonly"
      [hideLabelOnFocus]="hideLabelOnFocus"
      [focusOnInit]="focusOnInit"
      [hintMessage]="hintMessage"
      [warnMessage]="warnMessage"
      [errorMessage]="errorMessage"
      [size]="size"
      (changed)="onChange($event)">
</b-colorpicker></form>

<div>
  <h4 class="mrg-0">formGroup valueChanges:</h4>
  <p class="mrg-0">{{ form.valueChanges|async|json }}</p>
</div>

`;

const templateForNotes = `<b-colorpicker
      [config]="config"
      [value]="value"
      [label]="label"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [hintMessage]="hintMessage"
      [errorMessage]="errorMessage"
      [size]="size"
      (changed)="onChange($event)">
</b-colorpicker>`;

const storyTemplate = `
<b-story-book-layout [title]="'ColorPicker'">
  <div style="max-width: 300px; text-align: left; min-height: 60vh; display: flex; flex-direction: column; justify-content:space-between;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## ColorPicker Element
  #### Module
  *ColorPickerModule* or *FormElementsModule*

  ~~~
  ${templateForNotes}
  ~~~

  *Note*: Component supports only HEX color format.

  #### Properties
  Name | Type | Description | Defaults
  --- | --- | --- | ---
  [config] | ColorPickerConfig | emitOnChange, showClearButton, showFooter, defaultValue; <p style="margin-top:8px; margin-bottom:8px">\`emitOnChange\` and \`showClearButton\` are only relevant if \`showFooter\` is false.</p> \`defaultValue\` can be used to provide any string (that can also be a hex color) to be used instead of \`null\` (white color) for default/empty value | showFooter:&nbsp;true,<br> showClearButton:&nbsp;true,<br> emitOnChange:&nbsp;false,<br>defaultValue:&nbsp;null

  ${formElemsPropsDoc}
`;
story.add(
  'Color Picker',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: select(
          'value',
          [
            'null',
            '#9D9D9D',
            '#E52C51',
            '#4b95ec',
            '#592fb1',
            '#ff8100',
            '#9368bf',
            'invalidColor',
            COLOR_PICKER_DEFAULT,
          ],
          '#9368bf'
        ),

        emitOnChange: boolean('emitOnChange', false),
        showClearButton: boolean('showClearButton', true),
        showFooter: boolean('showFooter', true),
        defaultValue: select(
          'defaultValue',
          ['null', '#ff8100', COLOR_PICKER_DEFAULT],
          '#ff8100'
        ),

        ...FormElementsCommonProps('Pick a color', COLOR_PICKER_DEFAULT),

        size: select(
          'size',
          Object.values(FormElementSize),
          FormElementSize.regular
        ),

        onChange: action('change'),

        form: new FormGroup({ colorPicker: new FormControl('#9368bf') }),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          ColorPickerModule,
          StoryBookLayoutModule,
          ReactiveFormsModule,
          FormsModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: {
      timestamps: true,
      escapeHTML: false,
    },
  }
);
