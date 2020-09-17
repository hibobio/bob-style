import { storiesOf } from '@storybook/angular';
import {
  object,
  withKnobs,
  text,
  boolean,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MultiListAndChipsOptionsMock,
  MultiListAndAvatarChipsOptionsMock,
} from './multi-list-and-chips.mock';
import { MultiListAndChipsModule } from './multi-list-and-chips.module';
import { action } from '@storybook/addon-actions';
import { RadioButtonModule } from '../../form-elements/radio-button/radio-button.module';
import { Icons } from '../../icons/icons.enum';
import { number } from '@storybook/addon-knobs';

// @ts-ignore: md file and not a module
import listInterfaceDoc from '../../lists/list.interface.md';
// @ts-ignore: md file and not a module
import listSelectsPropsDoc from '../../lists/lists-selects.properties.md';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const listOpts = MultiListAndChipsOptionsMock;
const avatarListOpts = MultiListAndAvatarChipsOptionsMock;

const template = `<b-multi-list-and-chips
        [options]="options || listOpts"
        [listLabel]="listLabel"
        [chipsLabel]="chipsLabel"
        [showSingleGroupHeader]="showSingleGroupHeader"
        [startWithGroupsCollapsed]="startWithGroupsCollapsed"
        [min]="min"
        [max]="max"
        [emptyState]="emptyStateConfig"
        (selectChange)="onSelectChange($event)">
  </b-multi-list-and-chips>`;

const note = `
  ## Multi List And Chips

  #### Module
  *MultiListAndChipsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [listLabel] | string | label text for the Multi List component | &nbsp;
  [chipsLabel] | string | label text for the Chips List component | &nbsp;
  [emptyState] | EmptyStateConfig | config for the EmptyStateComponent to\
   be displayed when no options are selected | &nbsp;
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | emits on list change | &nbsp;

  ${listSelectsPropsDoc}

  ${listInterfaceDoc}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi List And Chips'" style=" background: rgb(247,247,247);">
  <div style="max-width:900px;">
    ${template}

    <br><br>
    <b-radio-button [radioConfig]="[
        {id: 1, label: 'Hobbies'},
        {id: 2, label: 'People'}
      ]"
      [value]="{id: 1}"
      (radioChange)="options = $event === 1 ? listOpts : avatarListOpts">
    </b-radio-button>
  </div>
</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    listLabel: text('chipsLabel', 'Select fields', 'Props'),
    chipsLabel: text('listLabel', 'Selected fields', 'Props'),
    showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
    startWithGroupsCollapsed: boolean(
      'startWithGroupsCollapsed',
      true,
      'Props'
    ),
    min: number('min', 0, {}, 'Props'),
    max: number('max', 0, {}, 'Props'),
    listOpts: object('listOpts', listOpts, 'Data'),
    avatarListOpts: object('avatarListOpts', avatarListOpts, 'Data'),
    emptyStateConfig: object(
      'emptyStateConfig',
      {
        text:
          'Choose a life. Choose a job. Choose a career. Choose a family. Choose a fucking big television.',
        icon: Icons.toDos_link,
      },
      'Props'
    ),

    onSelectChange: action('ListChange'),
  },
  moduleMetadata: {
    imports: [
      MultiListAndChipsModule,
      StoryBookLayoutModule,
      BrowserAnimationsModule,
      RadioButtonModule,
    ],
  },
});

story.add('Multi List And Chips', toAdd, { notes: { markdown: note } });

story2.add('Multi List And Chips', toAdd, { notes: { markdown: note } });
