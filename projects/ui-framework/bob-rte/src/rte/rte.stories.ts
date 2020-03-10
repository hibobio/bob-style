import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { values } from 'lodash';
import { BlotType, RTEType } from './rte.enum';
import { mentionsOptions, placeholderMock } from './rte.mocks';
import { ComponentGroupType } from '../../../src/lib/consts';
import { dedupeArray } from '../../../src/lib/services/utils/functional-utils';
import { SelectGroupOption } from '../../../src/lib/lists/list.interface';
import { StoryBookLayoutModule } from '../../../src/lib/story-book-layout/story-book-layout.module';
import { RichTextEditorModule } from './rte.module';
import { mockText } from '../../../src/lib/mock.const';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

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

<div><br class="222"></div> <span><br></span> <div><br></div>

<h1><em>Hooray!</em></h1>

<p><br>
 {{root##%%firstName}} is {{work##%%title}} of the month!
 </p>

<p>More details at: https://longlink.com/gohere/thenthere/onemore/page#hash?query=bigBen</p>

<div><br></div>

<h2>Here's an important list of things to remember:</h2>

<ul>
  <li> <br> <br>
  Watch artist <a href="https://www.youtube.com/watch?v=k2JPwJuM8fE" \
  mention-employee-id="777">@Jim lee</a> drawing \
  <span style="font-size: 18px;">🦇👨 & 🐱👩</span> from his studio
  <a href="https://www.youtube.com/watch?v=k2JPwJuM8fE" \
  target="_blank">here!</a></li>
  <li>All <b>bold</b> and <u>underline</u> emphasis.</li>
  <li>танцуй пока молодой <span style="font-size: 18px;">💃</span></li>
  <li>אם תרצו אין זו אגדה</li>
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
      [maxChars]="maxChars"
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
  [type] | RTEType | theme: primary (white bg, border), secondary \
  (transparent bg, no borders), tertiary (grey bg, no borders) | primary
  [value] | string | html content to be placed inside editor | &nbsp;
  [controls] | BlotType[] | array of toolbar controls \
  (check BlotType enum for all possible controls). \
  Defaults to all controls. Pass empty array to disable all controls | all
  [disableControls] | BlotType[] | array of toolbar controls to disable.\
   <u>Hint:</u> if you need to disable 1-2 controls from the default set,\
    dont set [controls], just pass controls you want disabled in [disableControls] instead. | []
  [options] | FroalaOptions | <u>Experimental!</u> additional options\
   for Froala editor. [See Docs](https://www.froala.com/wysiwyg-editor/docs/options). \
   Try \`{ toolbarInline:true }\` to get inline toolbar (regular toolbar will be hidden)
  [minChars] | number | minimum (plain) text length | 0
  [maxChars] | number | maximum (plain) text length | &nbsp;
  [minHeight] | number | minimum height of editor (including toolbar). \
  Set to **0** to disable min-height | 185
  [maxHeight] | number | maximum height of editor (including toolbar). \
  Set to **0** to disable max-height | 350
  [label] | string | label text (above editor) | &nbsp;
  [placeholder] | string | placeholder text (inside editor) | &nbsp;
  [description] | string | description text (icon tooltip) | &nbsp;
  [hideLabelOnFocus] | boolean | if true label text will be used as placeholder | false
  [disabled] | boolean | disables editor | false
  [required] | boolean | adds * to placeholder | false
  [hintMessage] | string | adds a hint message below editor | &nbsp;
  [warnMessage] | string | adds a warning message below editor | &nbsp;
  [errorMessage] | string | adds 'invalid' style, \
  hides hint/warn message and displays error message below editor | &nbsp;
  [translation] | RteTranslation | translations for button titles, etc | RTE-TRANSLATION-DEF
  (changed) | EventEmitter<wbr>&lt;string&gt; | emits in text change | &nbsp;
  (focused) | EventEmitter<wbr>&lt;string&gt; | emits latest value on editor focus | &nbsp;
  (blurred) | EventEmitter<wbr>&lt;string&gt; | emits latest value on editor blur | &nbsp;

  ----------------

  #### Mentions properties
  Name | Type | Description | default
  --- | --- | --- | ---
  [mentionsList] | RteMentionsOption[] | pass an array of \
  { avatar, displayName, link, attributes? } \
  objects for mentions functionality | &nbsp;

  <strong>Important!</strong>   \`\`\`.link  \`\`\` should be a full \
  url of ee profile;   \`\`\`.avatar  \`\`\` should be ee avatar url, \
  from <u>EmployeeAvatarService<wbr>.getOptimizedAvatarImage</u> (size mini); \
  \`\`\`.attributes  \`\`\` object can contain any attributes to be added to the mention link.

  Example of mentionsList data:

  \`\`\`
  [{
    "displayName": "Violeta Audia",
    "link": "/employee-profile?id=2134005328281338492",
    "avatar": "https://randomuser.me/api/portraits/women/32.jpg",
    "attributes": {
      "mention-employee-id": "2134005328281338492",
      "class": "employee-mention"
    }
  }]
  \`\`\`


  ----------------

  #### Placeholders properties
  Name | Type | Description
  --- | --- | ---
  [placeholderList] | SelectGroupOption[] | Single-List-compatible options model.

  <strong>Important!</strong> Each group must have a \`\`\`key \`\`\`,\
   and each option's   \`\`\`id \`\`\` must be in format \`\`\`GroupKey/OptionId\`\`\`.

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

story.add(
  'Rich text editor',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', values(RTEType), RTEType.primary, 'Props'),

        placeholder: text('placeholder', 'Compose an epic...', 'Props'),
        label: text('label', 'Edit rich textor', 'Props'),
        hideLabelOnFocus: boolean('hideLabelOnFocus', false, 'Props'),
        description: text('description', mockText(30), 'Props'),

        minChars: number('minChars', 20, {}, 'Props'),
        maxChars: number('maxChars', undefined, {}, 'Props'),
        minHeight: number('minHeight', 185, {}, 'Props'),
        maxHeight: number('maxHeight', 350, {}, 'Props'),

        disabled: boolean('disabled', false, 'Props'),
        required: boolean('required', true, 'Props'),

        hintMessage: text(
          'hintMessage',
          'This field should contain something',
          'Props'
        ),
        warnMessage: text('warnMessage', '', 'Props'),
        errorMessage: text('errorMessage', '', 'Props'),

        controls: array('controls', controlsDef, '\n', 'Props'),
        disableControls: array(
          'disableControls',
          disableControlsDef,
          '\n',
          'Props'
        ),

        value: text('value', value, 'Props'),
        placeholderList: object<SelectGroupOption>(
          'options',
          placeholderMock,
          'Data'
        ),
        mentionsList: object('mentionsList', mentionsOptions, 'Data'),

        change: action('Value changed'),
        focus: action('Editor focused'),
        blur: action('Editor blurred'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          RichTextEditorModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: {
      escapeHTML: false,
    },
  }
);
