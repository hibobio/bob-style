// tslint:disable

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { values } from 'lodash';
import { BlotType, RTEType } from './rte.enum';
import { mentionsOptions, placeholderMock } from './rte.mocks';
import { ComponentGroupType } from '../../../src/lib/consts';
import { dedupeArray } from '../../../src/lib/services/utils/functional-utils';
import { SelectGroupOption } from '../../../src/lib/form-elements/lists/list.interface';
import { StoryBookLayoutModule } from '../../../src/lib/story-book-layout/story-book-layout.module';
import { RichTextEditorModule } from './rte.module';
import { mockText } from '../../../src/lib/mock.const';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const disableControlsDef = [];
const controlsDef = dedupeArray(Object.values(BlotType)).filter(
  cntrl => !disableControlsDef.includes(cntrl)
);

const value = `<br><br> <br><br> <span> <br> </span> <div><br></div> <span><br></span>

<div>
  <span style="color: red;">Hello</span> http://Google.com!
  Some <em>funky</em> <strong>bold</strong> text
  of <span style="font-size: 18px;">large 🔍</span> size.
</div>

<div><br></div> <span><br></span> <div><br></div>

<h1><em>Hooray!</em></h1>

<p><br>
 {{root/firstName}} is {{work/title}} of the month!
 </p>

<p>More details at: https://longlink.com/gohere/thenthere/onemore/page#hash?query=bigBen</p>

<div><br></div>

<h2>Here's an important list of things to remember:</h2>

<ul>
  <li> <br> <br>
  don't trust the <span style="font-size: 18px;">👩</span> <a href="https://www.youtube.com/watch?v=h3SD_oBOx7g" target="_blank" class="employee-mention" mention-employee-id="666">@Bitch</a> in apartment 23</li>
  <li>don't eat the <u>yellow</u> snow</li>
  <li>танцуй пока молодой <span style="font-size: 18px;">💃</span></li>
  <li>אמור לא לסמים</li>
  <li style="direction: rtl; text-align: right;">beware the <a class="employee-mention" href="https://youtu.be/hOHvMqAgcmc?t=11" mention-employee-id="777">@Right Hook</a></li>
</ul>

<div><br></div> <span><br></span>
`;

const template = `
  <b-rich-text-editor
      [value]="value"
      [type]="type"
      [label]="label"
      [placeholder]="placeholder"
      [hideLabelOnFocus]="hideLabelOnFocus"
      [description]="description"
      [controls]="controls"
      [disableControls]="disableControls"
      [mentionsList]="mentionsList"
      [placeholderList]="placeholderList"
      [minChars]="minChars"
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
<b-story-book-layout [title]="'Rich text editor'" style="background-color: rgb(237,237,237);">
  <div>
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Rich text editor

  #### Module
  *RichTextEditorModule*
  from <u>'bob-style/bob-rte'</u>

  \`\`\`
  import { RichTextEditorModule, RTEType, BlotType, RteMentionsOption } from 'bob-style/bob-rte';
  \`\`\`


  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | default
  --- | --- | --- | ---
  [type] | RTEType | theme: primary (white bg, border), secondary (transparent bg, no borders), tertiary (grey bg, no borders) | primary
  [label] | string | label text (above editor) | &nbsp;
  [placeholder] | string | placeholder text (inside editor) | &nbsp;
  [description] | string | description text (icon tooltip) | &nbsp;
  [hideLabelOnFocus] | boolean | if true label text will be used as placeholder | false
  [value] | string | html content to be placed inside editor | &nbsp;
  [controls] | BlotType[] | array of toolbar controls (check BlotType enum for all possible controls). Defaults to all controls. Pass empty array to disable all controls | all
  [minChars] | number | minimum (plain) text length | 0
  [maxChars] | number | maximum (plain) text length | &nbsp;
  [minHeight] | number | minimum height of editor (including toolbar). Set to **0** to disable min-height | 185
  [maxHeight] | number | maximum height of editor (including toolbar). Set to **0** to disable max-height | 350
  [disabled] | boolean | disables editor | false
  [required] | boolean | adds * to placeholder | false
  [hintMessage] | string | adds a hint message below editor | &nbsp;
  [warnMessage] | string | adds a warning message below editor | &nbsp;
  [errorMessage] | string | adds 'invalid' style, hides hint/warn message and displays error message below editor | &nbsp;
  (changed) | EventEmitter&lt;string&gt; | emits in text change | &nbsp;
  (focused) | EventEmitter&lt;string&gt; | emits latest value on editor focus | &nbsp;
  (blurred) | EventEmitter&lt;string&gt; | emits latest value on editor blur | &nbsp;


  #### Mentions properties
  Name | Type | Description | default
  --- | --- | --- | ---
  [mentionsList] | RteMentionsOption[] | pass an array of { avatar, displayName, link } objects for mentions functionality | &nbsp;

  <strong>Important!</strong>   \`\`\`.link  \`\`\` should be a full url of ee profile;   \`\`\`.avatar  \`\`\` should be ee avatar url, from EmployeeAvatarService.getOptimizedAvatarImage (size mini);

  #### Placeholders properties
  Name | Type | Description | default
  --- | --- | --- | ---
  [placeholderList] | SelectGroupOption[] | Single-List-compatible options model.

  <strong>Important!</strong> Each group must have a   \`\`\`key  \`\`\`, and each option's   \`\`\`id \`\`\` must be in format \`\`\`GroupKey/OptionId\`\`\`.

  Example of placeholderList data:

  \`\`\`
  [{
    "groupName": "Basic info",
    "key": "root",
    "options": [
      {
        "id": "root/firstName",
        "value": "First name"
      }
    ]
  }]
  \`\`\`


`;

inputStories.add(
  'Rich text editor (NEW!)',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(RTEType), RTEType.primary),
        placeholder: text('placeholder', 'Compose an epic...'),
        label: text('label', 'Edit rich textor'),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false),
        description: text('description', mockText(30)),

        minChars: number('minChars', 20),
        maxChars: number('maxChars', 500),
        minHeight: number('minHeight', 185),
        maxHeight: number('maxHeight'),
        disabled: boolean('disabled', false),
        required: boolean('required', true),
        hintMessage: text('hintMessage', 'This field should contain something'),
        warnMessage: text('warnMessage', ''),
        errorMessage: text('errorMessage', ''),
        controls: array('controls', controlsDef, '\n'),
        disableControls: array('disableControls', disableControlsDef, '\n'),
        value: text('value', value),
        placeholderList: object<SelectGroupOption>('options', placeholderMock),
        mentionsList: object('mentionsList', mentionsOptions),
        change: action('Value changed'),
        focus: action('Editor focused'),
        blur: action('Editor blurred')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
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
