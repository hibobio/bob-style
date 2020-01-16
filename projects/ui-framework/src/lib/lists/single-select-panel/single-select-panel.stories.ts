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
import { SelectGroupOption } from '../list.interface';
import { SingleSelectPanelModule } from './single-select-panel.module';
import { ButtonType } from '../../buttons/buttons.enum';
import { action } from '@storybook/addon-actions';
import { mockBadJobs } from '../../mock.const';
import {
  simpleUID,
  randomFromArray,
  makeArray,
} from '../../services/utils/functional-utils';

import listInterfaceDoc from '../list.interface.md';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate1 = `
<b-single-select-panel [chevronButtonText]="chevronButtonText"
                       [options]="options"
                       [panelClass]="panelClass"
                       [disabled]="disabled"
                       [readonly]="readonly"
                       (selectChange)="selectChange($event)">
</b-single-select-panel>
`;

const componentTemplate2 = `
<b-single-select-panel [options]="options"
                       [panelClass]="panelClass"
                       [disabled]="disabled"
                       [readonly]="readonly"
                       (selectChange)="selectChange($event)">
    <b-square-button [disabled]="disabled"
                     type="${ButtonType.secondary}"
                     icon="${Icons.table}">
    </b-square-button>
</b-single-select-panel>
`;

const template = `
<b-story-book-layout [title]="'Single select panel'">
  <div style="max-width: 400px;">
  ${componentTemplate1}
  &nbsp;&nbsp;
  ${componentTemplate2}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single list panel

  #### Module
  *SingleSelectPanelModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | ---
  [chevronButtonText] | string | text to be displayed in\
   chevron-button | null - can use transclude instead
  [options] | SelectGroupOptions[] | select option | null
  [disabled] | boolean | if panel is disabled | false
  [readonly] | boolean | if true, will not emit events and not allow selection | false
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

const groupCount = 7;

const jobs = mockBadJobs(5 * groupCount);

const jobTypes = randomFromArray(
  [
    'Stressful jobs',
    'Boring jobs',
    'Sad jobs',
    'Low-paid jobs',
    'Dead-end jobs',
    'Monotonous jobs',
    'Dangerous jobs',
  ],
  7
);

const optionsMock: SelectGroupOption[] = makeArray(groupCount).map(
  (group, index) => ({
    groupName: jobTypes[index],
    options: jobs.slice(index * 5, index * 5 + 5).map(option => ({
      value: option,
      id: simpleUID(option + '-'),
      selected: false,
    })),
  })
);

optionsMock[0].options[1].selected = true;

story.add(
  'Single Select Panel',
  () => {
    return {
      template,
      props: {
        chevronButtonText: text(
          'chevronButtonText',
          'Jump to section',
          'Props'
        ),
        disabled: boolean('disabled', false, 'Props'),
        readonly: boolean('readonly', false, 'Props'),
        panelClass: text('panelClass', 'some-class', 'Props'),
        options: object('options', optionsMock, 'Options'),
        selectChange: action('Single select panel change'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          ButtonsModule,
          SingleSelectPanelModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
