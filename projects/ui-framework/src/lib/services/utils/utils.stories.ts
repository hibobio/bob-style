import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ComponentGroupType } from '../../consts';

const story = storiesOf(ComponentGroupType.Services, module);

const storyTemplate = `
<b-story-book-layout [title]="'Utils'">
</b-story-book-layout>
`;

const note = `
  ## Utils Service
  #### Module
  *UtilsModule*

  #### Methods

  ##### getResizeEvent
  Returns observable of window resize events

  ##### getScrollEvent
  Returns observable of scroll event with ScrollEvent interface

  ##### getWindowClickEvent
  Returns observable of window click event with MouseEvent interface

  ##### getWindowKeydownEvent
  Returns observable of window keydown event with KeyboardEvent interface

`;

// ##### getElementInViewEvent(element: HTMLElement): Observable&lt;boolean&gt;
// Returns observable of when element comes into / leaves viewport

story.add(
  'UtilsService',
  () => {
    return {
      template: storyTemplate,
      moduleMetadata: {
        imports: [StoryBookLayoutModule],
      },
    };
  },
  { notes: { markdown: note } }
);
