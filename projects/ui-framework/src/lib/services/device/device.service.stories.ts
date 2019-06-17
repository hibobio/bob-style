import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ComponentGroupType } from '../../consts';

const deviceServiceStories = storiesOf(ComponentGroupType.Services, module);

const storyTemplate = `
<b-story-book-layout [title]="'Device'">

</b-story-book-layout>
`;

const note = `
  ## Device Service

  #### Methods

  ##### getDevice
  Returns DeviceInfo

   ~~~
{
  platform: {
    type: PlatformType, // Mobile, Tablet, Desktop
    model: string,
  },
  browser: {
    name: string,
    version: string,
  },
}
   ~~~
`;

deviceServiceStories.add(
  'DeviceService',
  () => {
    return {
      template: storyTemplate,
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
