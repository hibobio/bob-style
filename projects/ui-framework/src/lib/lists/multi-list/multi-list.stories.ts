import { storiesOf } from '@storybook/angular';
import { withKnobs, object, boolean } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { ButtonsModule } from '../../buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { MultiListModule } from './multi-list.module';
import { SelectGroupOption } from '../list.interface';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { optionsMock, optionsMockDef } from './multi-list.mock';
import { cloneDeep } from 'lodash';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-multi-list #list [options]="options"
              [optionsDefault]="optionsDefault"
              [showSingleGroupHeader]="showSingleGroupHeader"
              [startWithGroupsCollapsed]="startWithGroupsCollapsed"
              (selectChange)="selectChange($event)">

      <b-text-button footerAction *ngIf="options.length>1"
              [text]="list.allGroupsCollapsed ? 'Expand' : 'Collapse'"
              (clicked)="list.toggleCollapseAll()">
      </b-text-button>

</b-multi-list>
`;

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

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [options] | SelectGroupOption[] | model of selection group | &nbsp;
  [optionsDefault] |  SelectGroupOption[] | default options. \
  if present, the Clear button (if enabled) will be replaced with Reset button, that will set the state \
  to optionsDefault | &nbsp;
  [showSingleGroupHeader] | boolean | displays single group with group header | false
  [startWithGroupsCollapsed] | boolean | if should start with groups closed | true
  [maxHeight] | number | component max height | 352 (8 rows)
  [listActions] | ListFooterActions / string | enable/disable footer action buttons\
   (clear, apply, reset). If you provide a string, \
   it will be used for button text, instead of default. | { clear:&nbsp;true, apply:&nbsp;false }
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | emits ListChange | &nbsp;
  &lt;elem footerAction&gt; | ng-content | element with attribute \`footerAction\` will be placed in the footer | &nbsp;

  ~~~
  ${template}
  ~~~
`;

const options = cloneDeep(optionsMock);
const optionsDef = cloneDeep(optionsMockDef);

story.add(
  'Multi list',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action('Multi list change'),
      showSingleGroupHeader: boolean('showSingleGroupHeader', true, 'Props'),
      startWithGroupsCollapsed: boolean(
        'startWithGroupsCollapsed',
        true,
        'Props'
      ),
      options: object<SelectGroupOption>('options', options, 'Options'),
      optionsDefault: object<SelectGroupOption>(
        'optionsDefault',
        optionsDef,
        'Options'
      ),
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
      entryComponents: [AvatarComponent],
    },
  }),
  { notes: { markdown: note } }
);
