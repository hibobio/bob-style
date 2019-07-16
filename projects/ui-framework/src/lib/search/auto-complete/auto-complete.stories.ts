import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { object, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { AutoCompleteModule } from './auto-complete.module';
import { AutoCompleteOption } from './auto-complete.interface';

const inputStories = storiesOf(ComponentGroupType.Search, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-auto-complete [options]="options"
                 [label]="label"
                 [placeholder]="placeholder"
                 (searchChange)="searchChange($event)"
                 (optionSelect)="optionSelect($event)">
</b-auto-complete>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Auto complete'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Auto complete

  #### Module
  *AutoCompleteModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  label | string | search label | none
  options | AutoCompleteOption[] | options for the select list | none
  searchChange | action | search value string | none
  optionSelect | action | AutoCompleteOption | none

  ~~~
  ${template}
  ~~~
`;

const optionsMock: AutoCompleteOption[] = Array.from(Array(20), (_, k) => {
  return {
    value: `Basic Info E${k} - option`,
    subText: `subtext e${k}`,
    id: k
  };
});

inputStories.add(
  'Auto complete',
  () => {
    return {
      template: storyTemplate,
      props: {
        label: text('label', ''),
        placeholder: text('placeholder', 'Search auto-complete'),
        options: object('options', optionsMock),
        searchChange: action('searchChange'),
        optionSelect: action('optionSelect')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TypographyModule,
          StoryBookLayoutModule,
          AutoCompleteModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
