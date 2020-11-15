import { storiesOf } from '@storybook/angular';
import { withKnobs, object, boolean } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SingleListModule } from './single-list.module';
import { SelectGroupOption } from '../list.interface';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { optionsMock } from './single-list.mock';
import { cloneDeep } from 'lodash';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';

// @ts-ignore: md file and not a module
import listInterfaceDoc from '../list.interface.md';
// @ts-ignore: md file and not a module
import listSelectsPropsDoc from '../lists-selects.properties.md';
// @ts-ignore: md file and not a module
import listsPropsDoc from '../lists.properties.md';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-single-list #list [options]="options"
               [showSingleGroupHeader]="showSingleGroupHeader"
               [startWithGroupsCollapsed]="startWithGroupsCollapsed"
               [showNoneOption]="showNoneOption"
               [readonly]="readonly"
               (selectChange)="selectChange($event)">

      <b-text-button footerAction *ngIf="options.length>1"
              [text]="list.allGroupsCollapsed ? 'Expand' : 'Collapse'"
              (clicked)="list.toggleCollapseAll()">
      </b-text-button>

</b-single-list>
`;

const templateForNotes = `<b-single-list [options]="options"
               [showSingleGroupHeader]="showSingleGroupHeader"
               [startWithGroupsCollapsed]="startWithGroupsCollapsed"
               [showNoneOption]="showNoneOption"
               [readonly]="readonly"
               (selectChange)="selectChange($event)">

      <b-text-button footerAction
        [text]="'Action'">
    </b-text-button>

</b-single-list>`;

const storyTemplate = `
<b-story-book-layout [title]="'Single list'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single list

  #### Module
  *SingleListModule*

  ~~~
  ${templateForNotes}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [showNoneOption] | boolean | show -None- list option | false

  ${listSelectsPropsDoc}

  ${listsPropsDoc}

  ${listInterfaceDoc}
`;

const options = cloneDeep(optionsMock);

options[1].options[1].selected = true;
options[1].options[3].disabled = true;
options[1].description = 'How I wish, how I wish you were here...';
options[3].description = 'We are just two lost souls swimming in a fishbowl year after year';

story.add(
  'Single list',
  () => ({
    template: storyTemplate,
    props: {
      showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
      startWithGroupsCollapsed: boolean(
        'startWithGroupsCollapsed',
        true,
        'Props'
      ),
      showNoneOption: boolean('showNoneOption', false, 'Props'),
      readonly: boolean('readonly', false, 'Props'),
      options: object<SelectGroupOption>('options', options, 'Options'),

      selectChange: action('Single list change'),
    },
    moduleMetadata: {
      imports: [
        SingleListModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        AvatarModule,
      ],
      entryComponents: [AvatarImageComponent],
    },
  }),
  { notes: { markdown: note } }
);
