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

  #### Methods & properties

  Name | Type | Description
  --- | --- | ---
  getMediaEvent() | Observable&lt;MediaEvent&gt; | returns {matchMobile: boolean, matchDesktop: boolean, isTouchDevice: boolean, isMobileBrowser: boolean}. Is updated on window resize
  isMobBrowser | boolean | is true when browser is mobile
  isMobileBrowser() | boolean | returns isMobBrowser property
  isTouchDevice | boolean | is true if device supports touch
  matchMedia(query: string) | boolean | checks if (provided) media quiery matches (returns true)
  matchBreakpoint(point: number, mode: WidthMode) | boolean | checks if media query width check returns true. Arguments - point: width to check, mode: 'min'-width or 'max'-WidthMode

`;

mobileStories.add(
  'MobileService',
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
