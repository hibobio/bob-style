import { storiesOf } from '@storybook/angular';
import {
  object,
  select,
  boolean,
  withKnobs,
  number,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeesShowcaseModule } from './employees-showcase.module';
import { AvatarSize } from '../avatar/avatar.enum';
import zipObject from 'lodash/zipObject';
import {
  EMPLOYEE_SHOWCASE_MOCK,
  EMPLOYEE_SHOWCASE_OPTIONS_MOCK,
} from './employees-showcase.mock';
import { SelectGroupOption } from '../../lists/list.interface';

const story = storiesOf(ComponentGroupType.Avatar, module).addDecorator(
  withKnobs
);

const employeesMock = EMPLOYEE_SHOWCASE_MOCK;

const sizeOptionsKeys = Object.values(AvatarSize).filter(
  key => typeof key === 'string'
) as string[];
const sizeOptionsValues = Object.values(AvatarSize).filter(
  key => typeof key === 'number'
) as number[];
const sizeOptions = zipObject(sizeOptionsKeys, sizeOptionsValues);

const template = `
  <b-employees-showcase
            [employees]="employees"
            [avatarSize]="avatarSize"
            [min]="min"
            [max]="max"
            [showMoreIcon]="showMoreIcon"
            [expandOnClick]="expandOnClick"
            [doShuffle]="doShuffle"
            [inverseStack]="inverseStack"
            [fadeOut]="fadeOut"
            [zoomOnHover]="zoomOnHover"
            [readonly]="readonly"
            (selectChange)="selectChange($event)"
            (clicked)="onAvatarClick($event)">
  </b-employees-showcase>
`;

const note = `
  ## Employees Showcase
  #### Module
  *EmployeesShowcaseModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [employees] | <s>EmployeeShowcase[]</s> / SelectGroupOption[] | Employees list. \
  EmployeeShowcase[] interface is deprecated\
   in favor of Select/list compatible SelectGroupOption[] (that can have badges &\
     icons in AvatarImage prefixcomponent object) | []
  [avatarSize] | AvatarSize | avatar size | 'mini'
  [min] | number | minimum number of avatars to show | 3
  [max] | number | maximum number of avatars to show \
  (values > 30 are not allowed and will be cut to 15). probably more aggressive limiting will boost overal page\
   performace. consider limiting to no more than 10 | 15
  [expandOnClick] | boolean | expands panel on click | true
  [showMoreIcon] | boolean | show the counter / 3 dots \
  circle - only valid for avatar size < medium; will be disabled if [fadeOut] is true) | true
  [doShuffle] | boolean | will shuffle and show random\
   avatars that dont fit - only if avatar size > medium.\
    this is resource intensive, so disabled by default  | <u>false</u>
  [inverseStack] | boolean | the 'front', uppermost avatar \
  will be on the left, and not on the right, as in defauult mode | false
  [fadeOut] | boolean | make avatars fade out, from front to back | false
  [zoomOnHover] | boolean | bring avatar to front and zoom on hover | false
  [readonly] | boolean | will display avatars select panel in readonly mode (no selection possible) | false
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | list select change<br>\
  **Note** if there are no observers of (selectChange) event,\
   the select/list will be displayed in readonly mode  | &nbsp;


  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Employees Showcase'">
<div style="max-width: 500px">
    ${template}
</div>
</b-story-book-layout>
`;

story.add(
  'Employees Showcase',
  () => {
    return {
      template: storyTemplate,
      props: {
        avatarSize: select(
          'avatarSize',
          sizeOptions,
          AvatarSize.small,
          'Props'
        ),
        min: number('min', 3, {}, 'Props'),
        max: number('max', 10, {}, 'Props'),
        expandOnClick: boolean('expandOnClick', true, 'Props'),
        showMoreIcon: boolean('showMoreIcon', true, 'Props'),
        doShuffle: boolean('doShuffle', false, 'Props'),
        inverseStack: boolean('inverseStack', false, 'Props'),
        fadeOut: boolean('fadeOut', false, 'Props'),
        zoomOnHover: boolean('zoomOnHover', false, 'Props'),
        readonly: boolean('readonly', false, 'Props'),

        // employees: object<EmployeeShowcase>('employees', EMPLOYEE_SHOWCASE_MOCK),
        employees: object<SelectGroupOption>(
          'employees',
          EMPLOYEE_SHOWCASE_OPTIONS_MOCK,
          'Data'
        ),

        selectChange: action('Showcase list change'),
        onAvatarClick: action('Avatar clicked'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EmployeesShowcaseModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
