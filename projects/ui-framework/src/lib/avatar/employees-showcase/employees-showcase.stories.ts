import { storiesOf } from '@storybook/angular';
import {
  object,
  select,
  boolean,
  withKnobs,
  number,
} from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeesShowcaseModule } from './employees-showcase.module';
import { AvatarSize } from '../avatar/avatar.enum';
import { zipObject } from 'lodash';
import {
  EMPLOYEE_SHOWCASE_MOCK,
  EMPLOYEE_SHOWCASE_OPTIONS_MOCK,
} from './employees-showcase.mock';
import { SelectGroupOption } from '../../lists/list.interface';
import { EmployeeShowcase } from './employees-showcase.interface';
import { cloneDeepSimpleObject } from '../../services/utils/functional-utils';
import { cloneDeep } from 'lodash';
import { ScrollingModule } from '@angular/cdk/scrolling';

const story = storiesOf(ComponentGroupType.Avatar, module).addDecorator(
  withKnobs
);

const sizeOptionsKeys = Object.values(AvatarSize).filter(
  (key) => typeof key === 'string'
) as string[];
const sizeOptionsValues = Object.values(AvatarSize).filter(
  (key) => typeof key === 'number'
) as number[];
const sizeOptions = zipObject(sizeOptionsKeys, sizeOptionsValues);

const template1 = `
  <b-employees-showcase
            [employees]="employees"
            [avatarSize]="avatarSize"
            [min]="min"
            [max]="max"
            [showTotal]="showTotal"
            [showTotalLabel]="showTotalLabel"
            [expandOnClick]="expandOnClick"
            [inverseStack]="inverseStack"
            [fadeOut]="fadeOut"
            [zoomOnHover]="zoomOnHover"
            [readonly]="readonly"
            [hasBackdrop]="hasBackdrop || undefined"
            (selectChange)="selectChange($event)">
  </b-employees-showcase>
`;

const template1ForNotes = `
  <b-employees-showcase
            [employees]="employees"
            [avatarSize]="avatarSize"
            [min]="min"
            [max]="max"
            [showTotal]="showTotal"
            [showTotalLabel]="showTotalLabel"
            [expandOnClick]="expandOnClick"
            [inverseStack]="inverseStack"
            [fadeOut]="fadeOut"
            [zoomOnHover]="zoomOnHover"
            [readonly]="readonly"
            (selectChange)="selectChange($event)">
  </b-employees-showcase>
`;

const template2 = `
  <b-employees-showcase
            [employees]="employeeOptions"
            [avatarSize]="avatarSizes.small"
            [min]="3"
            [max]="8"
            [showTotal]="true"
            [expandOnClick]="true"
            [inverseStack]="true"
            [fadeOut]="true"
            [zoomOnHover]="false"
            [readonly]="true"
            [hasBackdrop]="hasBackdrop || undefined">
  </b-employees-showcase>
`;

const template3 = `
  <b-employees-showcase
            [employees]="employees.slice().reverse()"
            [avatarSize]="avatarSizes.mini"
            [min]="3"
            [max]="6"
            [showTotal]="true"
            [expandOnClick]="true"
            [inverseStack]="false"
            [fadeOut]="false"
            [zoomOnHover]="false"
            [readonly]="true"
            [hasBackdrop]="hasBackdrop || undefined">
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
  [showTotal] | boolean | show the total counter circle \
   - only valid for avatar size < medium; will be disabled if [fadeOut] is true) | true
  [showTotalLabel] | boolean | show total text ("Total: X") to the right of the showcase | false
  [inverseStack] | boolean | the 'front', uppermost avatar \
  will be on the left, and not on the right, as in defauult mode | false
  [fadeOut] | boolean | make avatars fade out, from front to back | false
  [zoomOnHover] | boolean | bring avatar to front and zoom on hover | false
  [readonly] | boolean | will display avatars select panel in readonly mode (no selection possible) | false
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | list select change<br>\
  **Note** if there are no observers of (selectChange) event,\
   the select/list will be displayed in readonly mode  | &nbsp;
  (selectPanelOpened) | EventEmitter<wbr>&lt;void&gt; | emits when select panel opens (on showcase click) | &nbsp;
  (selectPanelClosed) | EventEmitter<wbr>&lt;void&gt; | emits when select panel closes | &nbsp;

  ~~~
  ${template1ForNotes}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Employees Showcase'" cdkScrollable class="content-wrapper" style="background: rgb(247,247,247); overflow: auto; max-height: 100vh; min-height: 0;">

<div style="max-width: 500px; text-align: left; min-height: 130vh;">
    ${template1}

    <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">

    <h4>SelectGroupOption[] - AvtarImage component with badges; <br>
    avatarSize small, inverseStack, fadeOut, readonly</h4>
    ${template2}

    <h4>avatarSize mini, readonly</h4>
    ${template3}


</div>
</b-story-book-layout>
`;

story.add(
  'Employees Showcase',
  () => {
    return {
      template: storyTemplate,
      props: {
        avatarSizes: AvatarSize,
        avatarSize: select(
          'avatarSize',
          sizeOptions,
          AvatarSize.medium,
          'Props'
        ),
        min: number('min', 1, {}, 'Props'),
        max: number('max', 5, {}, 'Props'),
        expandOnClick: boolean('expandOnClick', true, 'Props'),
        showTotal: boolean('showTotal', true, 'Props'),
        showTotalLabel: boolean('showTotalLabel', false, 'Props'),
        inverseStack: boolean('inverseStack', false, 'Props'),
        fadeOut: boolean('fadeOut', false, 'Props'),
        zoomOnHover: boolean('zoomOnHover', false, 'Props'),
        readonly: boolean('readonly', false, 'Props'),
        hasBackdrop: boolean('hasBackdrop', false, 'Props'),

        employees: object<EmployeeShowcase[]>(
          'employees',
          cloneDeepSimpleObject(EMPLOYEE_SHOWCASE_MOCK),
          'Data'
        ),
        employeeOptions: object<SelectGroupOption>(
          'employeeOptions',
          cloneDeep(EMPLOYEE_SHOWCASE_OPTIONS_MOCK),
          'Data'
        ),
        clone: cloneDeepSimpleObject,

        selectChange: action('Showcase list change'),
        onAvatarClick: action('Avatar clicked'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EmployeesShowcaseModule,
          ScrollingModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
