import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { values } from 'lodash';
import { TypographyModule } from '../../typography/typography.module';
import { RichTextEditorModule } from './rte.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlotType, RTEType } from './rte-core/rte.enum';
import { SelectGroupOption } from '../lists/list.interface';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const value = `<div> <span style="color: red;">Hello</span> <a href="http://www.google.com">World</a>!</div>
<div>Some <em>initial</em> <strong>bold</strong> text</div> {{/work/title}}`;

const template = `
  <b-rich-text-editor
      [type]="type"
      [label]="label"
      [placeholder]="placeholder"
      [value]="value"
      [controls]="controls"
      [disableControls]="disableControls"
      [placeholderList]="placeholderList"
      [minHeight]="minHeight"
      [maxHeight]="maxHeight"
      [disabled]="disabled"
      [required]="required"
      [hintMessage]="hintMessage"
      [warnMessage]="warnMessage"
      [errorMessage]="errorMessage"
      (changed)="change($event)"
      (focused)="focus($event)"
      (blurred)="blur($event)">
  </b-rich-text-editor>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Rich text editor'" style="background-color: rgb(247,247,247);">
  <div style="padding: 30px; height: 100%;">
    <div style="max-width:600px; margin:auto;">
      ${template}
    </div>
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
  label | string | label text (above editor) | none (optional)
  placeholder | string | placeholder text (inside editor. if only label is present, it will be treated as placeholder) | none (optional)
  value | string | html content to be placed inside editor | none (optional)
  controls | BlotType[] | array of toolbar controls (check BlotType enum for all possible controls). Defaults to all controls. Pass empty array to disable all controls | all
  minHeight | number | minimum height of editor (including toolbar). Set to null or 0 to disable min-height | 185 (optional)
  maxHeight | number | maximum height of editor (including toolbar). Set to null to disable max-height | 295 (optional)
  disabled | boolean | disables editor | false (optional)
  required | boolean | adds * to placeholder | false (optional)
  hintMessage | string | adds a hint message below editor | none (optional)
  warnMessage | string | adds a warning message below editor | none (optional)
  errorMessage | string | adds 'invalid' style, hides hint/warn message and displays error message below editor | none (optional)
  sendChangeOn | RTEchangeEvent | When to transmit value changes - on change (every keystroke) or on blur | blur (optional)
  changed | function | change event handler (event transmits latest change: {body,plainText}) |
  focused | function | focus event handler (event transmits latest change: {body,plainText}) |
  blurred | function | blur event handler (event transmits latest change: {body,plainText}) |
  /content/ | any | pass content to transclude any custom controls/etc to toolbar |


`;

const placeholderMock = [
  {
    groupName: 'Basic Info - header',
    options: [
      {
        displayName: 'First name',
        id: '/root/firstName',
        value: 'First name'
      },
      {
        displayName: 'title',
        id: '/work/title',
        category: 'Work',
        value: 'title'
      }
    ]
  }
];

const disableControlsDef = [BlotType.align, BlotType.direction];
const controlsDef = values(BlotType).filter(
  cntrl => !disableControlsDef.includes(cntrl)
);

inputStories.add(
  'Rich text editor',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(RTEType), RTEType.primary),
        placeholder: text('placeholder', 'Compose an epic...'),
        label: text('label', 'Edit rich textor'),
        value: text('value', value),
        controls: array('controls', controlsDef, '\n'),
        disableControls: array('disableControls', disableControlsDef, '\n'),
        placeholderList: object<SelectGroupOption>('options', placeholderMock),
        minHeight: number('minHeight', 200),
        maxHeight: number('maxHeight', 400),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
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
