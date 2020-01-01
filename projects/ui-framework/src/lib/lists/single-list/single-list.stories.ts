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

import listInterfaceDoc from '../list.interface.md';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-single-list #list [options]="options"
               (selectChange)="selectChange($event)"
               [showSingleGroupHeader]="showSingleGroupHeader"
               [showNoneOption]="showNoneOption">

      <b-text-button footerAction *ngIf="options.length>1"
              [text]="list.allGroupsCollapsed ? 'Expand' : 'Collapse'"
              (clicked)="list.toggleCollapseAll()">
      </b-text-button>

</b-single-list>
`;

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

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [options] | SelectGroupOption[] | model of selection group | &nbsp;
  [optionsDefault] |  SelectGroupOption[] | default options. \
  if present, the Clear button (if enabled) will be replaced with Reset button, that will set the state \
  to optionsDefault | &nbsp;
  [showSingleGroupHeader] | boolean | displays single group with group header | false
  [showNoneOption] | boolean | show -None- list option | false
  [maxHeight] | number | component max height | 352 (8 rows)
  [listActions] | ListFooterActions / string | enable/disable footer action buttons\
   (clear, apply, reset). If you provide a string, \
   it will be used for button text, instead of default. | { clear:&nbsp;false, apply:&nbsp;false }
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | emits ListChange | &nbsp;
  &lt;elem footerAction&gt; | ng-content | element with attribute \`footerAction\` will be placed in the footer | &nbsp;

  ~~~
  ${template}
  ~~~

  ${listInterfaceDoc}
`;

const options = cloneDeep(optionsMock);

options[0].options[1].selected = true;
options[0].options[3].disabled = true;

story.add(
  'Single list',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action('Single list change'),
      showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
      showNoneOption: boolean('showNoneOption', false, 'Props'),
      options: object<SelectGroupOption>('options', options, 'Options'),
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
