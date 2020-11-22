import { storiesOf } from '@storybook/angular';
import {
  text,
  object,
  withKnobs,
  boolean,
  select,
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
import { SelectMode } from '../list.enum';

// @ts-ignore: md file and not a module
import listInterfaceDoc from '../list.interface.md';
// @ts-ignore: md file and not a module
import listSelectsPropsDoc from '../lists-selects.properties.md';
// @ts-ignore: md file and not a module
import selectPanelsPropsDoc from '../select-panels.properties.md';
// @ts-ignore: md file and not a module
import selectsSelectPanelsPropsDoc from '../selects-select-panels.properties.md';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate1 = `<b-multi-select-panel [chevronButtonText]="chevronButtonText"
                        [options]="options"
                        [optionsDefault]="optionsDefault"
                        [mode]="selectMode"
                        [disabled]="disabled"
                        [readonly]="readonly"
                        [backdropClickMode]="backdropClickMode"
                        (selectChange)="selectChange($event)">
</b-multi-select-panel>`;

const componentTemplate1_notes = `<b-multi-select-panel [chevronButtonText]="chevronButtonText"
                        [options]="options"
                        [optionsDefault]="optionsDefault"
                        [mode]="selectMode"
                        [disabled]="disabled"
                        [readonly]="readonly"
                        (selectChange)="selectChange($event)">
</b-multi-select-panel>`;

const componentTemplate2 = `<b-multi-select-panel [options]="options"
                        [listActions]="{
                          clear: 'Clear selection',
                          apply: 'Lets go'
                        }"
                        [disabled]="disabled"
                        [readonly]="readonly"
                        (selectChange)="selectChange($event)">

    <b-square-button  [disabled]="disabled"
                      [type]="buttonType.secondary"
                      [icon]="icons.table">
    </b-square-button>

</b-multi-select-panel>`;

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
  *MultiSelectPanelModule*

  ~~~
  ${componentTemplate1_notes}
  ~~~

  ~~~
  ${componentTemplate2}
  ~~~

  ${selectPanelsPropsDoc}

  ${selectsSelectPanelsPropsDoc}

  ${listSelectsPropsDoc}

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
        icons: Icons,
        buttonType: ButtonType,
        chevronButtonText: text('chevronButtonText', 'Select field', 'Props'),
        selectMode: select(
          'selectMode',
          Object.values(SelectMode),
          SelectMode.classic,
          'Props'
        ),
        disabled: boolean('disabled', false, 'Props'),
        readonly: boolean('readonly', false, 'Props'),
        options: object<SelectGroupOption>('options', optionsMock, 'Options'),
        optionsDefault: object<SelectGroupOption>(
          'optionsDefault',
          optionsDef,
          'Options'
        ),
        backdropClickMode: select(
          'backdropClickMode',
          ['apply', 'cancel'],
          'apply',
          'Props'
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
