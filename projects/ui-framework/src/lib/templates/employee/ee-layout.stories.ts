import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import {
  AvatarBadge,
  AvatarOrientation,
  AvatarSize,
} from '../../avatar/avatar/avatar.enum';
import { Avatar } from '../../avatar/avatar/avatar.interface';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import { ComponentGroupType } from '../../consts';
import { mockAvatar, mockJobs, mockName } from '../../mock.const';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { EELayoutModule } from './ee-layout.module';

const story = storiesOf(ComponentGroupType.Templates, module).addDecorator(
  withKnobs
);

const mockAvatarData: Avatar = {
  size: AvatarSize.medium,
  orientation: AvatarOrientation.vertical,
  imageSource: mockAvatar(),
  badge: AvatarBadge.online,
  title: mockName(),
  subtitle: mockJobs(1),
};

const template = `<b-layout-employee [type]="type">

  <b-avatar sideBar
    [avatar]="avatarConfig"
  ></b-avatar>

  <div *ngIf="showTitle" title>Title</div>

  <div content>
    Content
  </div>

</b-employee-template>`;

const note = `
 ## EE Layout
  #### Module
  *EELayoutModule*
  ~~~
  ${template}
  ~~~
  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | EmployeeTemplateType | regular or transparentSidebar | regular
`;

const storyTemplate = `
<b-story-book-layout [title]="'Layout Employee'">
    ${template}
</b-story-book-layout>
`;

story.add(
  'Employee template',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', ['primary', 'secondary'], 'primary'),
        showTitle: boolean('showTitle', false),

        avatarConfig: mockAvatarData,
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          EELayoutModule,
          StoryBookLayoutModule,
          AvatarModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
