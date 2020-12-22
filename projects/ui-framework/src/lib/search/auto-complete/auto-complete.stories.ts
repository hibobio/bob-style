import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { object, text, withKnobs, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { AutoCompleteModule } from './auto-complete.module';
import { AutoCompleteOption } from './auto-complete.interface';
import { mockText } from '../../mock.const';
import { randomNumber } from '../../services/utils/functional-utils';

const story = storiesOf(ComponentGroupType.Search, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-auto-complete [options]="options"
                 [label]="label"
                 [placeholder]="placeholder"
                 [displayOptionsOnFocus]="displayOptionsOnFocus"
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
  label | string | search label | &nbsp;
  options | AutoCompleteOption[] | options for the select list | &nbsp;
  searchChange | action | search value string | &nbsp;
  optionSelect | action | AutoCompleteOption | &nbsp;
  displayOptionsOnFocus | boolean | opens the list on focus | false

  ~~~
  ${template}
  ~~~
`;

const optionsMock: AutoCompleteOption[] = Array.from(Array(20), (_, k) => {
  return {
    value: mockText(randomNumber(2, 5)),
    subText: mockText(randomNumber(2, 5)),
    id: k.toString(),
  };
});

story.add(
  'Auto complete',
  () => {
    return {
      template: storyTemplate,
      props: {
        label: text('label', ''),
        placeholder: text('placeholder', 'Search auto-complete'),
        displayOptionsOnFocus: boolean('displayOptionsOnFocus', false),
        options: object('options', optionsMock),
        searchChange: action('searchChange'),
        optionSelect: action('optionSelect'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TypographyModule,
          StoryBookLayoutModule,
          AutoCompleteModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
