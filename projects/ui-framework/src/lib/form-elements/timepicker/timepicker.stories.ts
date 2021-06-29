import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TimeFormat } from '../../types';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
import { FormElementsCommonProps } from '../form-elements.stories.common';
import { TimePickerModule } from './timepicker.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-timepicker
        [timeFormat]="formats[format]"
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
  [timeFormat] | TimeFormat | 12 or 24 hours
  (changed) | BInputEvent | change emitter

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

        format: select('timeFormat', ['Time12', 'Time24'], 'Time24'),
        formats: TimeFormat,

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
  {
    notes: { markdown: note },
    knobs: STORIES_KNOBS_OPTIONS,
  }
);
