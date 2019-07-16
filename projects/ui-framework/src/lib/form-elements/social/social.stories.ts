import { storiesOf } from '@storybook/angular';
import {
  select,
  withKnobs,
  text,
  boolean
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialModule } from './social.module';
import { SearchModule } from '../../search/search/search.module';
import { Social } from './social.enum';

const inputStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-social [value]="value"
          [type]="type"
          [errorMessage]="errorMessage"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [hintMessage]="hintMessage"
          (socialInputChange)="socialInputChange($event)">
</b-social>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Social'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Social Element

  #### Module
  *SocialModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  value | string | field value | null
  type | Social | type of input field | null
  socialInputChange | action | socialInputChange output string | none
  required | boolean | required | false
  disabled | boolean | disabled | false
  errorMessage | string | error message | null
  hintMessage | string | hint message | null
  socialInputChange | InputEvent | output event | emitter

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
        required: boolean('required', false),
        type: select('type', Social, Social.facebook),
        value: text('value', ''),
        errorMessage: text('errorMessage', ''),
        socialInputChange: action('social'),
        disabled: boolean('disabled', false),
        placeholder: text('placeholder', 'Your name'),
        hintMessage: text('hintMessage', '')
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          SearchModule,
          StoryBookLayoutModule,
          SocialModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
