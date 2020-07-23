import { storiesOf } from '@storybook/angular';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ComponentGroupType } from '../../consts';

const story = storiesOf(ComponentGroupType.Services, module);

const storyTemplate = `
<b-story-book-layout [title]="'Filters'">

</b-story-book-layout>
`;

const note = `
  ## Filters

  ### Module
  *FiltersModule*

  #### HighlightPipe
  highlights chars in string

  ~~~
  <span [innerHTML]="string | highlight: chars"></span>
  ~~~

  #### LinkifyPipe
  wraps links with a tag with href, target blank if a link and mailto: prefix if email.

  ~~~
  <span [innerHTML]="string | linkify"></span>
  ~~~

  #### FormatNumberPipe
  formats number by separating every 3 digits with comma (123456.78 => 123,456.78)

  ~~~
  <span>{{ someNumber | formatNumber }}</span>
  ~~~

  decimal digits number can be passed (default is 3 decimals):

  ~~~
  <span>{{ someNumber | formatNumber:decimals }}</span>
  ~~~

`;

story.add(
  'Filters',
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
