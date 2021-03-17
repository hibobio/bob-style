import { storiesOf } from '@storybook/angular';
import {
  boolean,
  withKnobs,
  select,
} from '@storybook/addon-knobs';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
// @ts-ignore: md file and not a module
import inputElemsPropsDoc from '../input.properties.md';
import { FormElementSize } from '../form-elements.enum';
import { FormElementsCommonProps } from '../form-elements.stories.common';
import { ColorPickerModule } from './color-picker.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
  <b-colorpicker
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
  [focusOnInit]="focusOnInit">
</b-colorpicker>
`;


const storyTemplate = `
<b-story-book-layout [title]="'Input'">
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
        value: select('value', ['#C6C6C6', '#FAFAFA', '#702727', '#592fb1', '#f339a3'], '#C6C6C6'),
        ...FormElementsCommonProps('Input label', 'Input placeholder'),
        showCharCounter: boolean('showCharCounter', true),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, ColorPickerModule, StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
