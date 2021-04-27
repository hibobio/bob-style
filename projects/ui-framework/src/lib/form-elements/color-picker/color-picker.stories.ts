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

const template = `<b-colorpicker
      [config]="{
        emitOnChange: emitOnChange,
        showClearButton: showClearButton,
<<<<<<< HEAD
        showFooter: showFooter,
        defaultValue: defaultValue === 'null' ? null : defaultValue
      }"
      [value]="value === 'null' ? null : value"
=======
        showFooter: showFooter
      }"
      [value]="value"
>>>>>>> Pavel/ more work on color-picker (#2068)
      [label]="label"
      [placeholder]="placeholder"
      [description]="description"
      [disabled]="disabled"
      [required]="required"
      [readonly]="readonly"
      [hideLabelOnFocus]="hideLabelOnFocus"
      [focusOnInit]="focusOnInit"
      [hintMessage]="hintMessage"
      [warnMessage]="warnMessage"
      [errorMessage]="errorMessage"
      [size]="size"
      (changed)="onChange($event)">
</b-colorpicker>`;

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
  <div style="max-width: 300px;">
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
<<<<<<< HEAD
  [config] | ColorPickerConfig | emitOnChange, showClearButton, showFooter, defaultValue; <p style="margin-top:8px; margin-bottom:8px">\`emitOnChange\` and \`showClearButton\` are only relevant if \`showFooter\` is false.</p> \`defaultValue\` can be used to provide any string to be used instead of \`null\` for empty value | showFooter:&nbsp;true,<br> showClearButton:&nbsp;true,<br> emitOnChange:&nbsp;false,<br>defaultValue:&nbsp;null
=======
  [config] | ColorPickerConfig | emitOnChange, showClearButton, showFooter;<br> emitOnChange and showClearButton are only relevant if showFooter is false | showFooter:&nbsp;true,<br> showClearButton:&nbsp;true,<br> emitOnChange:&nbsp;false
>>>>>>> Pavel/ more work on color-picker (#2068)

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
            '#C6C6C6',
            '#FAFAFA',
            '#702727',
            '#592fb1',
            '#f339a3',
            'invalidColor',
            COLOR_PICKER_DEFAULT,
          ],
          'null'
        ),

        emitOnChange: boolean('emitOnChange', false),
        showClearButton: boolean('showClearButton', true),
        showFooter: boolean('showFooter', true),
<<<<<<< HEAD
        defaultValue: select(
          'defaultValue',
          ['null', '#ff962b', COLOR_PICKER_DEFAULT],
          'null'
        ),
=======
>>>>>>> Pavel/ more work on color-picker (#2068)

        ...FormElementsCommonProps('Pick a color', COLOR_PICKER_DEFAULT),

        size: select(
          'size',
          Object.values(FormElementSize),
          FormElementSize.regular
        ),

        onChange: action('change'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          ColorPickerModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
