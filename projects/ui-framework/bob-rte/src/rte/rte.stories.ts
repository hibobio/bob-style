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
import { BlotType, RTEType, RTEMode } from './rte.enum';
import { mentionsOptions, placeholderMock, rteMockHtml } from './rte.mocks';
import { ComponentGroupType } from '../../../src/lib/consts';
import { dedupeArray } from '../../../src/lib/services/utils/functional-utils';
import { SelectGroupOption } from '../../../src/lib/lists/list.interface';
import { StoryBookLayoutModule } from '../../../src/lib/story-book-layout/story-book-layout.module';
import { RichTextEditorModule } from './rte.module';
import { mockText } from '../../../src/lib/mock.const';
import { xssMock } from '../../../src/lib/services/utils/xss.mock';
import { FormElementsCommonProps } from '../../../src/lib/form-elements/form-elements.stories.common';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const disableControlsDef = [];
const controlsDef = dedupeArray(Object.values(BlotType)).filter(
  (cntrl) => !disableControlsDef.includes(cntrl)
);

const value = rteMockHtml;

const template = `<b-rich-text-editor
      [value]="html === 'rich text' ? rteMockHtml : xssTest"
      [type]="type"
      [mode]="mode"
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
      (blurred)="blur($event)"
      [focusOnInit]="focusOnInit">
  </b-rich-text-editor>`;

const notesTemplate = `<b-rich-text-editor
      [value]="value"
      [label]="label"
      [placeholder]="placeholder"
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
      [errorMessage]="errorMessage"
      [focusOnInit]="focusOnInit"
      (changed)="change($event)"
      (blurred)="blur($event)">
</b-rich-text-editor>`;

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
  ${notesTemplate}
  ~~~

  #### Properties
  Name | Type | Description | default
  --- | --- | --- | ---
  [type] | RTEType | theme: primary (white bg, border), secondary \
  (transparent bg, no borders), tertiary (grey bg, no borders) | primary
  [mode] | RTEMode | html (default), plantext (outputs simple string without formatting or styles, not html) or htmlInlineCSS (embeds some inline styles to be used in email) | html
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
  (changed) | EventEmitter<wbr>&lt;string&gt; | emits in text change | &nbsp;
  (focused) | EventEmitter<wbr>&lt;string&gt; | emits latest value on editor focus | &nbsp;
  (blurred) | EventEmitter<wbr>&lt;string&gt; | emits latest value on editor blur | &nbsp;

  **Note about type 'singleLine':**
  This displays RTE as a regular 1 line input - without toolbar and with no support for any styles, BUT with support for Placeholders. Also, it will output plain string, not html (and convert any incoming html to string)!

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
        html: select('value', ['rich text', 'xss test'], 'rich text', 'Props'),

        type: select('type', values(RTEType), RTEType.primary, 'Props'),
        mode: select('mode', values(RTEMode), RTEMode.html, 'Props'),

        rteMockHtml: text('html', rteMockHtml, 'Data'),
        xssTest: xssMock,

        ...FormElementsCommonProps(
          'Edit rich textor',
          'Compose an epic...',
          mockText(30),
          'Props'
        ),

        minChars: number('minChars', 20, {}, 'Props'),
        maxChars: number('maxChars', 0, {}, 'Props'),
        minHeight: number('minHeight', 185, {}, 'Props'),
        maxHeight: number('maxHeight', 350, {}, 'Props'),

        controls: array('controls', controlsDef, '\n', 'Props'),
        disableControls: array(
          'disableControls',
          disableControlsDef,
          '\n',
          'Props'
        ),

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
