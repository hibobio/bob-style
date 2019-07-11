import { storiesOf } from '@storybook/angular';
import { object, select, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeesShowcaseModule } from './employees-showcase.module';
import { EmployeeShowcase } from './employees-showcase.interface';
import { AvatarSize } from '../avatar/avatar.enum';
import zipObject from 'lodash/zipObject';
import { getEmployeesMock } from './employees-showcase.mock';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';

const avatarStories = storiesOf(
  ComponentGroupType.ButtonsAndIndicators,
  module
).addDecorator(withKnobs);

const employeesMock = getEmployeesMock();

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
            [avatarSize]="avatarSize">
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

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Employees Showcase'">
  <div style="display: flex; justify-content: center; padding: 30px;">
    ${template}
  </div>
  <b-stats></b-stats>
</b-story-book-layout>
`;

avatarStories.add(
  'Employees Showcase',
  () => {
    return {
      template: storyTemplate,
      props: {
        avatarSize: select('avatarSize', sizeOptions, AvatarSize.mini),
        employees: object<EmployeeShowcase>('employees', employeesMock)
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EmployeesShowcaseModule,
          UtilComponentsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
