import { storiesOf } from '@storybook/angular';
import { text, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { TimePickerModule } from './timepicker.module';

import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
import { FormElementsCommonProps } from '../form-elements.stories.common';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-timepicker
        [value]="value"
        [label]="label"
        [description]="description"
        [disabled]="disabled"
        [required]="required"
        [readonly]="readonly"
        [hintMessage]="hintMessage"
        [warnMessage]="warnMessage"
        [errorMessage]="errorMessage"
        [focusOnInit]="focusOnInit"
        (changed)="onChange($event)">
</b-timepicker>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Timepicker'">
  <div style="max-width: 300px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Input Element
  #### Module
  *InputModule* or *FormElementsModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [value] | string | value of input field ('HH:MM')
  (changed) | InputEvent | change emitter

  ${formElemsPropsDoc}
`;
story.add(
  'Timepicker',
  () => {
    return {
      template: storyTemplate,
      props: {
        onChange: action('Time changed'),

        value: text('value', '4:20'),

        ...FormElementsCommonProps('Time is', '', ''),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TimePickerModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
