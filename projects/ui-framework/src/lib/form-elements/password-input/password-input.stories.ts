import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
import { FormElementsCommonProps } from '../form-elements.stories.common';
// @ts-ignore: md file and not a module
import inputElemsPropsDoc from '../input.properties.md';
import { PasswordInputModule } from './password-input.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-password-input
              [value]="value"
              [label]="label"
              [placeholder]="placeholder"
              [description]="description"
              [minChars]="minChars"
              [maxChars]="maxChars"
              [hintMessage]="hintMessage"
              [warnMessage]="warnMessage"
              [errorMessage]="errorMessage"
              [readonly]="readonly"
              [disabled]="disabled"
              [required]="required"
              [hideLabelOnFocus]="hideLabelOnFocus"
              [focusOnInit]="focusOnInit"
              (changed)="onChange($event)">
</b-password-input>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Password Input'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Password Input

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | --- | ---
  [value] | string | value of input field

  ${inputElemsPropsDoc}

  ${formElemsPropsDoc}

`;

story.add(
  'Password Input',
  () => {
    return {
      template: storyTemplate,
      props: {
        value: text('value', ''),

        ...FormElementsCommonProps('Password input', 'Enter password', ''),

        minChars: number('minChars', 8),
        maxChars: number('maxChars', 30),

        onChange: action('Input changed'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          PasswordInputModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
