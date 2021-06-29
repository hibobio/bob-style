import { cloneDeep } from 'lodash';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import {
  boolean,
  number,
  object,
  select,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { ButtonsModule } from '../../buttons/buttons.module';
import { ComponentGroupType } from '../../consts';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { SelectMode } from '../list.enum';
import { SelectGroupOption } from '../list.interface';
// @ts-ignore: md file and not a module
import listInterfaceDoc from '../list.interface.md';
// @ts-ignore: md file and not a module
import listSelectsPropsDoc from '../lists-selects.properties.md';
// @ts-ignore: md file and not a module
import listsPropsDoc from '../lists.properties.md';
import { optionsMock, optionsMockDef } from './multi-list.mock';
import { MultiListModule } from './multi-list.module';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-multi-list #list [options]="options$ | async"
              [optionsDefault]="optionsDefault"
              [showSingleGroupHeader]="showSingleGroupHeader"
              [startWithGroupsCollapsed]="startWithGroupsCollapsed"
              [min]="min"
              [max]="max"
              [mode]="selectMode"
              [readonly]="readonly"
              [size]="size"
              (selectChange)="selectChange($event)">

      <b-text-button footerAction *ngIf="options.length>1"
              [text]="list.allGroupsCollapsed ? 'Expand' : 'Collapse'"
              (clicked)="list.toggleCollapseAll()">
      </b-text-button>

</b-multi-list>
`;

const templateForNotes = `<b-multi-list [options]="options"
              [optionsDefault]="optionsDefault"
              [showSingleGroupHeader]="showSingleGroupHeader"
              [startWithGroupsCollapsed]="startWithGroupsCollapsed"
              [readonly]="readonly"
              (selectChange)="selectChange($event)">

      <b-text-button footerAction
        [text]="'Action'">
      </b-text-button>

</b-multi-list>`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi list'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Multi list

  #### Module
  *MultiListModule*

  ~~~
  ${templateForNotes}
  ~~~

  ${listSelectsPropsDoc}

  ${listsPropsDoc}

  ${listInterfaceDoc}
`;

const options: SelectGroupOption[] = cloneDeep(optionsMock);
const optionsDef = cloneDeep(optionsMockDef);

if (options.length > 1) {
  options[2].description = `Are we human
Or are we dancer?
My sign is vital
My hands are cold
And I'm on my knees
Looking for the answer
Are we human
Or are we dancer?`;
  options[4].description = 'Sit amet en ipsum';
  options[6].description = 'Lorem Dolor sit amet en psium';
}

const options$ = of(options).pipe(delay(1000));

story.add(
  'Multi list',
  () => ({
    template: storyTemplate,
    props: {
      selectMode: select(
        'selectMode',
        Object.values(SelectMode),
        SelectMode.classic,
        'Props'
      ),
      selectChange: action('Multi list change'),
      showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
      startWithGroupsCollapsed: boolean(
        'startWithGroupsCollapsed',
        true,
        'Props'
      ),
      min: number('min', 0, {}, 'Props'),
      max: number('max', 0, {}, 'Props'),
      readonly: boolean('readonly', false, 'Props'),
      options: object<SelectGroupOption[]>('options', options, 'Options'),
      optionsDefault: object<SelectGroupOption>(
        'optionsDefault',
        optionsDef,
        'Options'
      ),

      size: select(
        'size',
        Object.values(FormElementSize),
        FormElementSize.regular,
        'Props'
      ),

      options$: options$,
    },
    moduleMetadata: {
      imports: [
        MultiListModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        AvatarModule,
      ],
      entryComponents: [AvatarImageComponent],
    },
  }),
  {
    notes: { markdown: note },
    knobs: {
      timestamps: true,
      escapeHTML: false,
    },
  }
);
