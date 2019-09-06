import { storiesOf } from '@storybook/angular';
import { object, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeesShowcaseModule } from './employees-showcase.module';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import zipObject from 'lodash/zipObject';
import { EMPLOYEE_SHOWCASE_MOCK } from './employees-showcase.mock';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const avatarStories = storiesOf(ComponentGroupType.Avatar, module).addDecorator(
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
            (selectChange)="selectChange($event)">
  </b-employees-showcase>
`;

const note = `
  ## Employees Showcase
  #### Module
  *EmployeesShowcaseModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  employees | EmployeeShowcase[] | employees list | []
  avatarSize | AvatarSize | avatar size | 'mini'
  expandOnClick | boolean | expands panel on click | true
  selectChange | ListChange | list select change |

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Employees Showcase'">
<div style="text-align: left; max-width: 100%;">
    ${template}
</div>
</b-story-book-layout>
`;

avatarStories.add(
  'Employees Showcase',
  () => {
    return {
      template: storyTemplate,
      props: {
        avatarSize: select('avatarSize', sizeOptions, AvatarSize.mini),
        expandOnClick: boolean('expandOnClick', true),
        employees: object<EmployeeShowcase>('employees', employeesMock),
        selectChange: action('Showcase list change'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EmployeesShowcaseModule,
          UtilComponentsModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
