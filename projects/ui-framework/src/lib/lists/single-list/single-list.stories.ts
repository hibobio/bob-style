import { storiesOf } from '@storybook/angular';
import { withKnobs, object, boolean, select } from '@storybook/addon-knobs';
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
import { SwitchToggleModule } from '../../indicators/switch-toggle/switch-toggle.module';

// @ts-ignore: md file and not a module
import listInterfaceDoc from '../list.interface.md';
// @ts-ignore: md file and not a module
import listSelectsPropsDoc from '../lists-selects.properties.md';
// @ts-ignore: md file and not a module
import listsPropsDoc from '../lists.properties.md';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FormElementSize } from '../../form-elements/form-elements.enum';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-single-list #list [options]="options$ | async"
               [showSingleGroupHeader]="showSingleGroupHeader"
               [startWithGroupsCollapsed]="startWithGroupsCollapsed"
               [showNoneOption]="showNoneOption"
               [readonly]="readonly"
               [size]="size"
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

const options: SelectGroupOption[] = cloneDeep(optionsMock);

options[2].options[1].selected = true;
options[2].options[3].disabled = true;
options[2].description = 'How I wish, how I wish you were here...';
options[3].description =
  'We are just two lost souls swimming in a fishbowl year after year';

const options$ = of(options).pipe(delay(1000));

story.add(
  'Single list',
  () => ({
    template: storyTemplate,
    props: {
      showSingleGroupHeader: boolean('showSingleGroupHeader', false, 'Props'),
      startWithGroupsCollapsed: boolean(
        'startWithGroupsCollapsed',
        true,
        'Props'
      ),
      showNoneOption: boolean('showNoneOption', false, 'Props'),
      readonly: boolean('readonly', false, 'Props'),
      options: object<SelectGroupOption[]>('options', options, 'Options'),

      size: select(
        'size',
        Object.values(FormElementSize),
        FormElementSize.regular,
        'Props'
      ),

      selectChange: action('Single list change'),

      options$: options$,
    },
    moduleMetadata: {
      imports: [
        SingleListModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        AvatarModule,
        SwitchToggleModule,
      ],
      entryComponents: [],
    },
  }),
  { notes: { markdown: note } }
);
