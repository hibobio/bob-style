import { storiesOf } from '@storybook/angular';
import {
  object,
  select,
  boolean,
  withKnobs,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeesShowcaseModule } from './employees-showcase.module';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import zipObject from 'lodash/zipObject';
import { EMPLOYEE_SHOWCASE_MOCK } from './employees-showcase.mock';

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
            [expandOnClick]="expandOnClick"
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
  [employees] | EmployeeShowcase[] | employees list | []
  [avatarSize] | AvatarSize | avatar size | 'mini'
  [expandOnClick] | boolean | expands panel on click | true
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | list select change | &nbsp;
  (clicked) | EventEmitter<wbr>&lt;EmployeeShowcase&gt; | emits when avatar is clicked | &nbsp;

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
        avatarSize: select('avatarSize', sizeOptions, AvatarSize.medium),
        expandOnClick: boolean('expandOnClick', true),
        employees: object<EmployeeShowcase>('employees', employeesMock),
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
