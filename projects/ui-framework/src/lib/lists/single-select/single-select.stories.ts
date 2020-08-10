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
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { cloneDeep } from 'lodash';
import { ListModelService } from '../list-service/list-model.service';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';

import listInterfaceDoc from '../list.interface.md';
import selectsPropsDoc from '../selects.properties.md';
import formElemsPropsDoc from '../../form-elements/form-elements.properties.md';
import listSelectsPropsDoc from '../lists-selects.properties.md';
import selectsSelectPanelsPropsDoc from '../selects-select-panels.properties.md';
import { FormElementSize } from '../../form-elements/form-elements.enum';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-single-select [value]="[value]"
                 [options]="options"
                 [label]="label"
                 [placeholder]="placeholder"
                 [description]="description"
                 [showNoneOption]="showNoneOption"
                 [showSingleGroupHeader]="showSingleGroupHeader"
                 [startWithGroupsCollapsed]="startWithGroupsCollapsed"
                 [disabled]="disabled"
                 [required]="required"
                 [readonly]="readonly"
                 [hintMessage]="hintMessage"
                 [errorMessage]="errorMessage"
                 [size]="size"
                 (opened)="opened()"
                 (closed)="closed()"
                 (selectChange)="selectChange($event)"
                 (changed)="selectValueChange($event)">

      <b-text-button footerAction
          [text]="'Action'">
      </b-text-button>
</b-single-select>
`;

const templateForNotes = `<b-single-select [value]="[value]"
                 [options]="options"
                 [label]="label"
                 [placeholder]="placeholder"
                 [description]="description"
                 [showNoneOption]="showNoneOption"
                 [showSingleGroupHeader]="showSingleGroupHeader"
                 [startWithGroupsCollapsed]="startWithGroupsCollapsed"
                 [disabled]="disabled"
                 [required]="required"
                 [readonly]="readonly"
                 [hintMessage]="hintMessage"
                 [errorMessage]="errorMessage"
                 (selectChange)="selectChange($event)"
                 (changed)="selectValueChange($event)">

      <b-text-button footerAction
          [text]="'Action'">
      </b-text-button>

</b-single-select>`;

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

  ~~~
  ${templateForNotes}
  ~~~

  #### SingleSelect properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [value] | number / string | selected option's ID.<br>\
   If present, the \`.selected\` props of \`[options]\` will be ignored, \
   and instead \`[value]\` will be used to select option | &nbsp;
  [showNoneOption] | boolean | displays the no-selection option.<br>\
  **Note:** If \`[required]\` is true, \`[showNoneOption]\` will automatically set to false | true

  ${listSelectsPropsDoc}

  ${selectsPropsDoc}

  ${selectsSelectPanelsPropsDoc}

  ${formElemsPropsDoc}

  ${listInterfaceDoc}
`;

const options = ListModelService.prototype.selectAll(cloneDeep(optionsMock));
options[1].options[3].disabled = true;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    value: select(
      'value',
      [
        options[1].options[0].id,
        options[2].options[2].id,
        options[3].options[3].id,
        options[1].options[2].id,
      ],
      options[1].options[2].id,
      'Props'
    ),

    showNoneOption: boolean('showNoneOption', true, 'Props'),
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
    readonly: boolean('readonly', false, 'Props'),
    hintMessage: text(
      'hintMessage',
      'This field should contain something',
      'Props'
    ),
    errorMessage: text('errorMessage', '', 'Props'),
    size: select(
      'size',
      Object.values(FormElementSize),
      FormElementSize.regular,
      'Props'
    ),

    options: object<SelectGroupOption>('options', options, 'Options'),

    opened: action('Panel opened'),
    closed: action('Panel closed'),
    selectChange: action('Change Applied'),
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
    entryComponents: [AvatarImageComponent],
  },
});

story.add('Single select', toAdd, { notes: { markdown: note } });
story2.add('Single select', toAdd, { notes: { markdown: note } });
