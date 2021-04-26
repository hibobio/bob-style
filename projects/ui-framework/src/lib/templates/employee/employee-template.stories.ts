import { storiesOf } from '@storybook/angular';
import { select, withKnobs, boolean } from '@storybook/addon-knobs';
import { EmployeeTemplateModule } from './employee-template.module';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeTemplateType } from './employee-template.enum';
import { values } from 'lodash';
import { AvatarSize } from '../../avatar/avatar/avatar.enum';
import { mockAvatar } from '../../mock.const';
import { AvatarModule } from '../../avatar/avatar/avatar.module';

const story = storiesOf(ComponentGroupType.Templates, module).addDecorator(
  withKnobs
);
const templateTypes = values(EmployeeTemplateType);

const mockAvatarData = {
  size: AvatarSize.large,
  imageSource: mockAvatar(),
  backgroundColor: '#fff'
}

const template = `<b-employee-template [type]="type">
  <div sideBar>
  <b-avatar-image
  [size]='size'
  [imageSource]='imageSource'
  [backgroundColor]='backgroundColor'
  ></b-avatar-image>
  </div>
  <div *ngIf="showTitle" title>Title</div>
  <div content>Content</div>
</b-employee-template>`;

const note = `
 ## Employee template Element
  #### Module
  *EmployeeTemplateModule*
  ~~~
  ${template}
  ~~~
  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | EmployeeTemplateType | regular or transparentSidebar | regular
`;

const storyTemplate = `
<b-story-book-layout [title]="'Employee template'">
    ${template}
</b-story-book-layout>
`;

story.add(
  'Employee template',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', templateTypes, EmployeeTemplateType.regular),
        showTitle: boolean('showTitle', false),
        imageSource: mockAvatarData.imageSource,
        size: mockAvatarData.size,
        backgroundColor: mockAvatarData.backgroundColor
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, EmployeeTemplateModule, StoryBookLayoutModule, AvatarModule]
      },
    };
  },
  { notes: { markdown: note } }
);
