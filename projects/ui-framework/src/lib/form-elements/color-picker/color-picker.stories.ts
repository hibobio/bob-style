import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
import { FormElementsCommonProps } from '../form-elements.stories.common';
// @ts-ignore: md file and not a module
import inputElemsPropsDoc from '../input.properties.md';
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
  (changed)="onChange($event)">
</b-colorpicker>`;

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
        value: select(
          'value',
          [null, '#C6C6C6', '#FAFAFA', '#702727', '#592fb1', '#f339a3'],
          null
        ),
        ...FormElementsCommonProps('Input label', 'Input placeholder'),
        showCharCounter: boolean('showCharCounter', true),
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
