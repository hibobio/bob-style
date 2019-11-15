import { storiesOf } from '@storybook/angular';
import {
  text,
  object,
  withKnobs,
  boolean,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { Icons } from '../../../icons/icons.enum';
import { MultiSelectPanelModule } from './multi-select-panel.module';
import { ButtonType } from '../../../buttons/buttons.enum';
import { action } from '@storybook/addon-actions';
import { selectOptionsMock } from './multi-select-panel.mock';
import { cloneDeep } from 'lodash';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate1 = `
<b-multi-select-panel [chevronButtonText]="chevronButtonText"
                      [disabled]="disabled"
                      [options]="options"
                      (selectChange)="selectChange($event)">
</b-multi-select-panel>
`;

const componentTemplate2 = `
<b-multi-select-panel [options]="options"
                      [disabled]="disabled"
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
  [options] | SelectGroupOptions[] | select option | null
  [disabled] | boolean | if panel is disabled | false
  (selectChange) | ListChange | output on select change
  (opened) | EventEmitter&lt;OverlayRef&gt; | Emits panel Opened event | none
  (closed) | EventEmitter&lt;void&gt; | Emits panel Closed event | none

  ~~~
  ${componentTemplate1}
  ~~~

  ~~~
  ${componentTemplate2}
  ~~~
`;

const optionsMock = cloneDeep(selectOptionsMock);

optionsMock[0].options[1].selected = true;

story.add(
  'Multi list panel',
  () => {
    return {
      template,
      props: {
        chevronButtonText: text('chevronButtonText', 'Select field'),
        disabled: boolean('disabled', false),
        options: object('options', optionsMock),
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
