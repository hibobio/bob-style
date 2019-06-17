import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ComponentGroupType } from '../../consts';

const colorStories = storiesOf(ComponentGroupType.Services, module);

const storyTemplate = `
<b-story-book-layout [title]="'Color'">

</b-story-book-layout>
`;

const note = `
  ## Color Service

  #### Methods

  ##### isDark
  Returns boolean

  ##### getRandomColor
  Returns random color as string

`;

colorStories.add(
  'ColorService',
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
