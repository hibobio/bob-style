import { storiesOf } from '@storybook/angular';
import { text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { MultiSearchModule } from './multi-search.module';
import { mockSearchData } from './multi-search.mock';
import { AvatarImageComponent } from '../../avatar/avatar/avatar-image/avatar-image.component';
import { AvatarModule } from '../../avatar/avatar/avatar.module';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `
<b-multi-search [options]="options"
                [label]="label"
                [placeholder]="placeholder">
</b-multi-search>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi-Search'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Multi-Search Component

  #### Module
  *MultiSearchModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [value] | string | input value | &nbsp;
  [label] | string | label text | &nbsp;
  [placeholder] | string | placeholder text | &nbsp;
  [hideLabelOnFocus] | boolean | make label behave as placeholder | true
  [enableBrowserAutoComplete] | InputAutoCompleteOptions | enable/disable autocomplete | off
  (searchFocus) | EventEmitter<wbr>&lt;string&gt;  | emits on input focus | &nbsp;
  (searchChange) | EventEmitter<wbr>&lt;string&gt;  | emits on input value change | &nbsp;

  ~~~
  ${template}
  ~~~
`;
story.add(
  'Multi-Search',
  () => {
    return {
      template: storyTemplate,
      props: {
        options: mockSearchData,
        label: text('label', ''),
        placeholder: text('placeholder', 'Search me'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          MultiSearchModule,
          StoryBookLayoutModule,
          AvatarModule,
        ],
        entryComponents: [AvatarImageComponent],
      },
    };
  },
  { notes: { markdown: note } }
);
