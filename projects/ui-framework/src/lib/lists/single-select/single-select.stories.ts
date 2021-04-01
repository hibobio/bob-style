import { cloneDeep } from 'lodash';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { boolean, object, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ComponentGroupType } from '../../consts';
import { FormElementSize } from '../../form-elements/form-elements.enum';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../../form-elements/form-elements.properties.md';
import { FormElementsCommonProps } from '../../form-elements/form-elements.stories.common';
import { Icons } from '../../icons/icons.enum';
import { mockText } from '../../mock.const';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { ListModelService } from '../list-service/list-model.service';
import { SelectGroupOption } from '../list.interface';
// @ts-ignore: md file and not a module
import listInterfaceDoc from '../list.interface.md';
// @ts-ignore: md file and not a module
import listSelectsPropsDoc from '../lists-selects.properties.md';
// @ts-ignore: md file and not a module
import selectsSelectPanelsPropsDoc from '../selects-select-panels.properties.md';
// @ts-ignore: md file and not a module
import selectsPropsDoc from '../selects.properties.md';
import { optionsMock } from '../single-list/single-list.mock';
import { SingleSelectModule } from './single-select.module';

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
                 [placeholder]="placeholder || undefined"
                 [description]="description"
                 [showNoneOption]="showNoneOption"
                 [ghost]="ghost"
                 [showSingleGroupHeader]="showSingleGroupHeader"
                 [startWithGroupsCollapsed]="startWithGroupsCollapsed"
                 [defaultIcon]="defaultIcon"
                 [disabled]="disabled"
                 [required]="required"
                 [readonly]="readonly"
                 [hintMessage]="hintMessage"
                 [errorMessage]="errorMessage"
                 [size]="size"
                 [focusOnInit]="focusOnInit"
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
                 [ghost]="ghost"
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
  [ghost] | boolean | displays single select without input frame around (minimal footprint)<br>\
  **Note:** If \`[required]\` is true, \`[showNoneOption]\` will automatically set to false | true

  ${listSelectsPropsDoc}

  ${selectsPropsDoc}

  ${selectsSelectPanelsPropsDoc}

  ${formElemsPropsDoc}

  ${listInterfaceDoc}
`;

const options = ListModelService.prototype.selectAll(cloneDeep(optionsMock));
options[2].options[3].disabled = true;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    value: select(
      'value',
      [
        options[2].options[0].id,
        options[2].options[2].id,
        options[3].options[3].id,
        options[4].options[2].id,
      ],
      options[2].options[2].id,
      'Props'
    ),

    showNoneOption: boolean('showNoneOption', true, 'Props'),
    ghost: boolean('ghost', false, 'Props'),
    showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
    startWithGroupsCollapsed: boolean(
      'startWithGroupsCollapsed',
      true,
      'Props'
    ),

    defaultIcon: select('defaultIcon', [null, Icons.person], null, 'Props'),

    ...FormElementsCommonProps('Single select', '', mockText(30), 'Props'),

    size: select(
      'size',
      Object.values(FormElementSize),
      FormElementSize.regular,
      'Props'
    ),

    optionsNotes: object<SelectGroupOption[]>('options', options, 'Options'),

    options: options,

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
