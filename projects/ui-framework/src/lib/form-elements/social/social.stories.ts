import { storiesOf } from '@storybook/angular';
import { select, withKnobs, object, text, number, boolean } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialModule } from './social.module';
import { SearchModule } from '../../search/search/search.module';
import { SocialType } from './social.interface';


const inputStories = storiesOf(ComponentGroupType.FormElements, module).addDecorator(withKnobs);

const template = `
<b-social style="width: 400px;"
          [value]="value"
          [type]="type"
          [errorMessage]="errorMessage"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [hintMessage]="hintMessage"
          [hideLabelOnFocus]="hideLabelOnFocus"
          (socialInputChange)="socialInputChange($event)">
</b-social>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Social'">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Social Element

  #### Module
  *SocialModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  value | string | type of input field | none
  label | string | label text | none
  hideLabelOnFocus | boolean | should hide label on focus | false
  socialInputChange | action | socialInputChange output string | none

  ~~~
  ${template}
  ~~~
`;

inputStories.add(
  'Social',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', SocialType, SocialType.Facebook),
        value: text('value', ''),
        errorMessage: text('errorMessage', ''),
        placeholder: text('placeholder', 'Your name'),
        socialInputChange: action(),
        disabled: boolean('disabled', false),
        required: boolean('required', false),
        hintMessage: text('hintMessage', ''),
      },
      moduleMetadata: {
        imports: [BrowserAnimationsModule, SearchModule, StoryBookLayoutModule, SocialModule]
      }
    };
  },
  { notes: { markdown: note } }
);
