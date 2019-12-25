import { storiesOf } from '@storybook/angular';
import {
  text,
  object,
  withKnobs,
  boolean,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { Icons } from '../../icons/icons.enum';
import { MultiSelectPanelModule } from './multi-select-panel.module';
import { ButtonType } from '../../buttons/buttons.enum';
import { action } from '@storybook/addon-actions';
import {
  selectOptionsMock,
  selectOptionsMockDef,
} from './multi-select-panel.mock';
import { cloneDeep } from 'lodash';
import { SelectGroupOption } from '../list.interface';

import listInterfaceDoc from '../list.interface.md';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate1 = `
<b-multi-select-panel [chevronButtonText]="chevronButtonText"
                      [disabled]="disabled"
                      [options]="options"
                      [optionsDefault]="optionsDefault"
                      (selectChange)="selectChange($event)">
</b-multi-select-panel>
`;

const componentTemplate2 = `
<b-multi-select-panel [options]="options"
                      [disabled]="disabled"
                      [listActions]="{
                        clear: 'Clear selection',
                        apply: 'Lets go'
                      }"
                      (selectChange)="selectChange($event)">
    <b-square-button  [disabled]="disabled"
                      type="${ButtonType.secondary}"
                      icon="${Icons.table}">
    </b-square-button>
</b-multi-select-panel>
`;

const template = `
<b-story-book-layout [title]="'Multi select panel'">
  <div style="max-width: 400px;">
  ${componentTemplate1}
  &nbsp;&nbsp;
  ${componentTemplate2}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Multi list panel

  #### Module
  *MultiListMenuModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | ---
  [chevronButtonText] | string | text to be displayed in chevron-button | null - can use transclude instead
  [options] | SelectGroupOptions[] | select option | &nbsp;
  [optionsDefault] |  SelectGroupOption[] | default options. \
  if present, the Clear button (if enabled) will be replaced with Reset button, that will set the state \
  to optionsDefault | &nbsp;
  [listActions] | ListFooterActions / string | enable/disable footer action buttons\
   (clear, apply, reset). If you provide a string, \
   it will be used for button text, instead of default. | { clear:&nbsp;true, apply:&nbsp;true }
  [disabled] | boolean | if panel is disabled | false
  (selectChange) | ListChange | output on select change | &nbsp;
  (opened) | EventEmitter<wbr>&lt;OverlayRef&gt; | Emits panel Opened event | &nbsp;
  (closed) | EventEmitter<wbr>&lt;void&gt; | Emits panel Closed event | &nbsp;

  ~~~
  ${componentTemplate1}
  ~~~

  ~~~
  ${componentTemplate2}
  ~~~


  ${listInterfaceDoc}
`;

const optionsMock = cloneDeep(selectOptionsMock);

const optionsDef = cloneDeep(selectOptionsMockDef);

optionsMock[0].options[1].selected = true;

story.add(
  'Multi Select Panel',
  () => {
    return {
      template,
      props: {
        chevronButtonText: text('chevronButtonText', 'Select field', 'Props'),
        disabled: boolean('disabled', false, 'Props'),
        options: object<SelectGroupOption>('options', optionsMock, 'Options'),
        optionsDefault: object<SelectGroupOption>(
          'optionsDefault',
          optionsDef,
          'Options'
        ),
        selectChange: action('Multi select panel change'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          ButtonsModule,
          MultiSelectPanelModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
