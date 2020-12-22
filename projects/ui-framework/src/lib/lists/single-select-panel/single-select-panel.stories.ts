import { storiesOf } from '@storybook/angular';
import { text, object, withKnobs, boolean } from '@storybook/addon-knobs';
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

const componentTemplate1 = `<b-single-select-panel [chevronButtonText]="chevronButtonText"
                         [options]="options"
                         [panelClass]="panelClass"
                         [disabled]="disabled"
                         [readonly]="readonly"
                         (selectChange)="selectChange($event)">
</b-single-select-panel>`;

const componentTemplate2 = `<b-single-select-panel [options]="options"
                         [panelClass]="panelClass"
                         [disabled]="disabled"
                         [readonly]="readonly"
                         (selectChange)="selectChange($event)">

    <b-square-button [disabled]="disabled"
                     [type]="buttonType.secondary"
                     [icon]="icons.table">
    </b-square-button>

</b-single-select-panel>`;

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

  ~~~
  ${componentTemplate1}
  ~~~

  ~~~
  ${componentTemplate2}
  ~~~

  ${selectPanelsPropsDoc}

  ${selectsSelectPanelsPropsDoc}

  ${listSelectsPropsDoc}

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

export const SSPjobsOptionsMock: SelectGroupOption[] = makeArray(
  groupCount
).map((group, index) => ({
  groupName: jobTypes[index],
  options: jobs.slice(index * 5, index * 5 + 5).map((option) => ({
    value: option,
    id: simpleUID(option + '-'),
    selected: false,
  })),
}));

SSPjobsOptionsMock[0].options[1].selected = true;

story.add(
  'Single Select Panel',
  () => {
    return {
      template,
      props: {
        icons: Icons,
        buttonType: ButtonType,
        chevronButtonText: text(
          'chevronButtonText',
          'Jump to section',
          'Props'
        ),
        disabled: boolean('disabled', false, 'Props'),
        readonly: boolean('readonly', false, 'Props'),
        panelClass: text('panelClass', 'some-class', 'Props'),
        options: object('options', SSPjobsOptionsMock, 'Options'),
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
