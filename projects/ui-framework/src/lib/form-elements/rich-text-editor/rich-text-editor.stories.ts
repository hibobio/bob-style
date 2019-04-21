import { storiesOf } from '@storybook/angular';
import {
  text,
  select,
  boolean,
  withKnobs,
  array,
  number
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { values } from 'lodash';
import { TypographyModule } from '../../typography/typography.module';
import { RichTextEditorModule } from './rich-text-editor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RTEType, RTEControls, RTEchangeEvent } from './rich-text-editor.enum';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const value = `
  <div>Hello World!</div>
  <div>Some initial <strong>bold</strong> text</div>
`;

const template = `
  <b-rich-text-editor
      [type]="type"
      [label]="label"
      [value]="value"
      [controls]="controls"
      [minHeight]="minHeight"
      [maxHeight]="maxHeight"
      [disabled]="disabled"
      [required]="required"
      [hintMessage]="hintMessage"
      [errorMessage]="errorMessage"
      [sendChangeOn]="sendChangeOn"
      (changed)="change($event)"
      (focused)="focus($event)"
      (blurred)="blur($event)">
    Some custom toolbar thing
  </b-rich-text-editor>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Rich text editor'">
  <div style="padding: 30px; background-color: rgb(0,0,0,0.1); height: 100%;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Rich text editor

  #### Module
  *RichTextEditorModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | default
  --- | --- | --- | ---
  type | RTEType | primary (white bg, border) or secondary (transparent bg, no borders) | primary
  label | string | placeholder text | none (optional)
  value | string | html content to be placed inside editor | none (optional)
  controls | RTEControls[] | array of toolbar controls. Possible controls: size, bold, italic, underline, link, list, align, dir. Defaults to all controls. Pass empty array to disable all controls. | all
  minHeight | number | minimum height of editor (including toolbar). Set to null or 0 to disable min-height | 185 (optional)
  maxHeight | number | maximum height of editor (including toolbar). Set to null to disable max-height | 295 (optional)
  disabled | boolean | disables editor | false (optional)
  required | boolean | adds * to placeholder | false (optional)
  hintMessage | string | adds a hint message below editor | none (optional)
  errorMessage | string | adds 'invalid' style, hides hint message and displays error message below editor | none (optional)
  sendChangeOn | RTEchangeEvent | When to transmit value changes - on change (every keystroke) or on blur | blur (optional)
  changed | function | change event handler (event transmits latest change: {body,plainText}) |
  focused | function | focus event handler (event transmits latest change: {body,plainText}) |
  blurred | function | blur event handler (event transmits latest change: {body,plainText}) |
  /content/ | any | pass content to transclude any custom controls/etc to toolbar |


`;

inputStories.add(
  'Rich text editor',
  () => {
    return {
      template: storyTemplate,
      props: {
        sendChangeOn: select(
          'type',
          values(RTEchangeEvent),
          RTEchangeEvent.blur
        ),
        type: select('type', values(RTEType), RTEType.primary),
        label: text('label', 'Compose an epic...'),
        value: text('value', value),
        controls: array('controls', values(RTEControls), '\n'),
        minHeight: number('minHeight', 200),
        maxHeight: number('maxHeight', 400),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        errorMessage: text('errorMessage', ''),
        change: action('Something has changed'),
        focus: action('Editor focused'),
        blur: action('Editor blurred')
      },
      moduleMetadata: {
        imports: [
          FormsModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          TypographyModule,
          StoryBookLayoutModule,
          RichTextEditorModule
        ]
      }
    };
  },
  {
    notes: { markdown: note },
    knobs: {
      escapeHTML: false
    }
  }
);
