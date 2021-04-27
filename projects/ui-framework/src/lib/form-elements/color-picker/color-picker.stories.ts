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
        showFooter: showFooter
      }"
      [value]="value"
      [label]="label"
      [placeholder]="placeholder"
      [description]="description"
      [disabled]="disabled"
      [required]="required"
      [readonly]="readonly"
      [hintMessage]="hintMessage"
      [warnMessage]="warnMessage"
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
  ${template}
  ~~~

  *Note*: Component supports only HEX color format.

  #### Properties
  Name | Type | Description | Defaults
  --- | --- | --- | ---
  [config] | ColorPickerConfig | emitOnChange, showClearButton, showFooter;<br> emitOnChange and showClearButton are only relevant if showFooter is false | showFooter:&nbsp;true,<br> showClearButton:&nbsp;true,<br> emitOnChange:&nbsp;false

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
            '',
            '#C6C6C6',
            '#FAFAFA',
            '#702727',
            '#592fb1',
            '#f339a3',
            'invalidColor',
          ],
          ''
        ),

        emitOnChange: boolean('emitOnChange', false),
        showClearButton: boolean('showClearButton', true),
        showFooter: boolean('showFooter', true),

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
