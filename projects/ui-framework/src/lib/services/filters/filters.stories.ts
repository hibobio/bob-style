import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ComponentGroupType } from '../../consts';

const utilsStories = storiesOf(ComponentGroupType.Services, module);

const storyTemplate = `
<b-story-book-layout title="Filters">

</b-story-book-layout>
`;

const note = `
  ## Filters
  #### Module
  *FiltersModule*
  #### Filters

  ##### HighlightPipe
  highlights chars in string

  ~~~
  <span [innerHTML]="string | highlight: chars"></span>
  ~~~

`;

utilsStories.add(
  'Filters',
  () => {
    return {
      template: storyTemplate,
      moduleMetadata: {
        imports: [StoryBookLayoutModule]
      }
    };
  },
  { notes: { markdown: note } }
);
