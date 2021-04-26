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
// @ts-ignore: md file and not a module
import inputElemsPropsDoc from '../input.properties.md';
import { COLOR_PICKER_DEFAULT } from './color-picker.const';
import { ColorPickerModule } from './color-picker.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `<b-colorpicker
  [value]="value"
  [label]="label"
  [placeholder]="placeholder"
  [description]="description"
  [hideLabelOnFocus]="hideLabelOnFocus"
  [disabled]="disabled"
  [required]="required"
  [readonly]="readonly"
  [hintMessage]="hintMessage"
  [warnMessage]="warnMessage"
  [errorMessage]="errorMessage"
  [focusOnInit]="focusOnInit"
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

  *Note*: Component for selecting the color in the HEX format by the color picker dropdown, or properly via the input.
  Can be used inside the forms.

  ${inputElemsPropsDoc}

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
        ...FormElementsCommonProps('Input label', COLOR_PICKER_DEFAULT),
        showCharCounter: boolean('showCharCounter', true),
        onChange: action('change'),

        size: select(
          'size',
          Object.values(FormElementSize),
          FormElementSize.regular
        ),
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
