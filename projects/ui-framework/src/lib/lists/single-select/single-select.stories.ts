import { storiesOf } from '@storybook/angular';
import {
  boolean,
  object,
  text,
  withKnobs,
  select,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SingleSelectModule } from './single-select.module';
import { SelectGroupOption } from '../list.interface';
import { mockText } from '../../mock.const';
import { optionsMock } from '../single-list/single-list.mock';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { cloneDeep } from 'lodash';
import { ListModelService } from '../list-service/list-model.service';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-single-select [options]="options"
                 [value]="[value]"
                 [label]="label"
                 [placeholder]="placeholder"
                 [description]="description"
                 [showSingleGroupHeader]="showSingleGroupHeader"
                 [startWithGroupsCollapsed]="startWithGroupsCollapsed"
                 [disabled]="disabled"
                 [required]="required"
                 [errorMessage]="errorMessage"
                 [hintMessage]="hintMessage"
                 (selectChange)="selectChange($event)"
                 (changed)="selectValueChange($event)">
    <b-text-button footerAction
      [text]="'Click Me!'">
    </b-text-button>
</b-single-select>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single select'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single Select

  #### Module
  *SingleSelectModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [options] | SelectGroupOption[] | model of selection group | &nbsp;
  [showSingleGroupHeader] | boolean | displays single group with group header | false
  [startWithGroupsCollapsed] | boolean | if should start with groups closed | true
  [showNoneOption] | boolean | displays the no-selection option | true
  [listActions] | ListFooterActions / string | enable/disable footer action buttons\
   (clear, apply, reset). If you provide a string, \
   it will be used for button text, instead of default. | { clear:&nbsp;false, apply:&nbsp;false }
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | emits ListChange | &nbsp;
  (changed) | EventEmitter<wbr>&lt;string/number&gt; | emits selected option ID | &nbsp;
  &lt;elem footerAction&gt; | ng-content | element with attribute \`footerAction\` will be placed in the footer | &nbsp;
  [label] | string | label text | &nbsp;
  [description] | string | description text (above icon) | &nbsp;
  [placeholder] | string | placeholder text | &nbsp;
  [disabled] | boolean | is field disabled | &nbsp;
  [required] | boolean | is field required | &nbsp;
  [hintMessage] | text | hint text | &nbsp;
  [errorMessage] | text | error text | &nbsp;

  ~~~
  ${template}
  ~~~
`;

const options = ListModelService.prototype.selectAll(cloneDeep(optionsMock));
options[0].options[1].value =
  'some other very long text and some more words to have ellipsis and tooltip';
options[0].options[3].disabled = true;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    value: select(
      'value',
      [
        options[0].options[0].id,
        options[1].options[2].id,
        options[3].options[3].id,
        options[0].options[2].id,
      ],
      options[0].options[2].id,
      'Props'
    ),

    showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
    startWithGroupsCollapsed: boolean(
      'startWithGroupsCollapsed',
      true,
      'Props'
    ),

    label: text('label', 'label text', 'Props'),
    description: text('description', mockText(30), 'Props'),
    placeholder: text('placeholder', 'placeholder text', 'Props'),
    disabled: boolean('disabled', false, 'Props'),
    required: boolean('required', false, 'Props'),
    hintMessage: text(
      'hintMessage',
      'This field should contain something',
      'Props'
    ),
    errorMessage: text('errorMessage', '', 'Props'),

    options: object<SelectGroupOption>('options', options, 'Options'),

    selectChange: action('Single select change'),
    selectValueChange: action('Value (Selected IDs)'),
  },
  moduleMetadata: {
    imports: [
      SingleSelectModule,
      ButtonsModule,
      TypographyModule,
      BrowserAnimationsModule,
      StoryBookLayoutModule,
      AvatarModule,
    ],
    entryComponents: [AvatarComponent],
  },
});

story.add('Single select', toAdd, { notes: { markdown: note } });
story2.add('Single select', toAdd, { notes: { markdown: note } });
