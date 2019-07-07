import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ComponentGroupType } from '../../consts';

const mobileStories = storiesOf(ComponentGroupType.Services, module);

const storyTemplate = `
<b-story-book-layout [title]="'Mobile service'">
</b-story-book-layout>
`;

const note = `
  ## Mobile Service

  #### Methods

  ##### isMobileBrowser
  returns boolean for is mobile browser
`;

mobileStories.add(
  'MobileService',
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
