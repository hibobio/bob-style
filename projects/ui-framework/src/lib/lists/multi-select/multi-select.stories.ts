import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  object,
  boolean,
  select,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { MultiSelectModule } from './multi-select.module';
import { SelectGroupOption } from '../list.interface';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { mockText } from '../../mock.const';
import { cloneDeep } from 'lodash';
import { optionsMock, optionsMockDef } from '../multi-list/multi-list.mock';
import { ListModelService } from '../list-service/list-model.service';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { SelectMode } from '../list.enum';
import { SSPjobsOptionsMock } from '../single-select-panel/single-select-panel.stories';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { number } from '@storybook/addon-knobs';
import { MultiSelectComponent } from './multi-select.component';
import { FormElementsCommonProps } from '../../form-elements/form-elements.stories.common';

// @ts-ignore: md file and not a module
import listInterfaceDoc from '../list.interface.md';
// @ts-ignore: md file and not a module
import listSelectsPropsDoc from '../lists-selects.properties.md';
// @ts-ignore: md file and not a module
import selectsPropsDoc from '../selects.properties.md';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../../form-elements/form-elements.properties.md';
// @ts-ignore: md file and not a module
import selectsSelectPanelsPropsDoc from '../selects-select-panels.properties.md';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-multi-select #bms [value]="value"
                [options]="optns === 'plain' ? options_plain : options_avatars"
                [optionsDefault]="optionsDefault"
                [mode]="selectMode"
                [label]="label"
                [placeholder]="placeholder || undefined"
                [description]="description"
                [showSingleGroupHeader]="showSingleGroupHeader"
                [startWithGroupsCollapsed]="startWithGroupsCollapsed"
                [min]="min"
                [max]="max"
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
                (changed)="selectValueChange($event)"
                (selectModified)="selectModified($event)"
                (selectCancelled)="selectCancelled($event)">

    <b-text-button footerAction
        [text]="'Action'">
    </b-text-button>
</b-multi-select>

<br><br>
<button (click)="logData(bms)" type="button">log</button>
`;

const templateForNotes = `<b-multi-select [value]="value"
                [options]="options"
                [optionsDefault]="optionsDefault"
                [label]="label"
                [placeholder]="placeholder"
                [description]="description"
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

</b-multi-select>`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi select'">
  <div style="max-width: 350px;">
    ${template}
  </div>

</b-story-book-layout>
`;

const note = `
  ## Multi Select

  #### Module
  *MultiSelectModule*

  ~~~
  ${templateForNotes}
  ~~~

  #### MultiSelect properties
  Name | Type | Description | Default
  --- | --- | --- | ---
  [value] | (number / string)[] | array of selected options's IDs.<br>\
   If present, the \`.selected\` props of \`[options]\` will be ignored, \
   and instead \`[value]\` will be used to select options | &nbsp;
  (selectModified) | EventEmitter<wbr>&lt;ListChange&gt; | emits ListChange - on every option change.<br>\
  **Note:** In most cases, it's better to use \`(selectChange)\` or \`(changed)\`, \
  that emit on Apply (see doc below) | &nbsp;
  (selectCancelled) | EventEmitter<wbr>&lt;ListChange&gt; | emits ListChange - on Cancel. \
  Only relevant if you use \`(selectModified)\` | &nbsp;

  ${listSelectsPropsDoc}

  ${selectsPropsDoc}

  ${selectsSelectPanelsPropsDoc}

  ${formElemsPropsDoc}

  ${listInterfaceDoc}
`;

const options = ListModelService.prototype.selectAll<SelectGroupOption>(
  cloneDeep(optionsMock)
);
const optionsDef = cloneDeep(optionsMockDef);

const toAdd = () => ({
  template: storyTemplate,
  props: {
    logData: (bms: MultiSelectComponent) => {
      console.log('Options:', bms['options']);
      console.log('Value (Selected IDs):', bms['value']);
      console.log(
        'Selected Group Options:',
        bms['listChangeSrvc']
          .getListChange(bms.options, bms.value)
          .getSelectedGroupOptions()
      );
    },
    value: select(
      'value',
      [
        [
          options[2].options[0].id,
          options[1].options[2].id,
          options[3].options[3].id,
          options[2].options[2].id,
        ],
        [
          options[3].options[1].id,
          options[1].options[3].id,
          options[2].options[2].id,
          options[4].options[0].id,
        ],
        [
          options[3].options[3].id,
          options[1].options[2].id,
          options[4].options[0].id,
          options[2].options[1].id,
        ],
      ],
      [
        options[2].options[0].id,
        options[1].options[2].id,
        options[3].options[3].id,
        options[2].options[2].id,
      ],
      'Props'
    ),

    showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
    startWithGroupsCollapsed: boolean(
      'startWithGroupsCollapsed',
      true,
      'Props'
    ),
    selectMode: select(
      'selectMode',
      Object.values(SelectMode),
      SelectMode.classic,
      'Props'
    ),
    min: number('min', 0, {}, 'Props'),
    max: number('max', 0, {}, 'Props'),

    ...FormElementsCommonProps('Multi select', '', mockText(30), 'Props'),

    size: select(
      'size',
      Object.values(FormElementSize),
      FormElementSize.regular,
      'Props'
    ),

    optns: select(
      'options',
      ['plain', 'with avatars'],
      'with avatars',
      'Options'
    ),
    options_plain: SSPjobsOptionsMock,
    options_avatars: object<SelectGroupOption>(
      'options data',
      options,
      'Options'
    ),
    optionsDefault: optionsDef,
    opened: action('Panel opened'),
    closed: action('Panel closed'),
    selectChange: action('Change Applied'),
    selectValueChange: action('Value (Selected IDs)'),
    selectModified: action('Options modified'),
    selectCancelled: action('Changes Cancelled'),
  },
  moduleMetadata: {
    imports: [
      MultiSelectModule,
      ButtonsModule,
      TypographyModule,
      BrowserAnimationsModule,
      StoryBookLayoutModule,
      AvatarModule,
    ],
    entryComponents: [AvatarImageComponent],
  },
});

story.add('Multi select', toAdd, { notes: { markdown: note } });
story2.add('Multi select', toAdd, { notes: { markdown: note } });
