import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
import { FormElementsCommonProps } from '../form-elements.stories.common';
import { CheckboxModule } from './checkbox.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-checkbox (changed)="checkboxChange($event)"
            [value]="value"
            [label]="label"
            [placeholder]="placeholder"
            [indeterminate]="indeterminate"
            [disabled]="disabled"
            [required]="required"
            [readonly]="readonly"
            [description]="description"
            [hintMessage]="hintMessage"
            [warnMessage]="warnMessage"
            [errorMessage]="errorMessage"
            [focusOnInit]="focusOnInit">
</b-checkbox>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Checkbox'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Checkbox Element
  #### Module
  *CheckboxModule* or *FormElementsModule*

  ~~~
<b-checkbox [value]="value"
            [label]="label"
            [placeholder]="placeholder"
            [indeterminate]="indeterminate"
            [disabled]="disabled"
            [errorMessage]="errorMessage"
            (changed)="checkboxChange($event)">
</b-checkbox>
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [value] | boolean | start checkbox state
  [indeterminate] | boolean | indeterminate state
  (changed) <s>(checkboxChange)</s> | EventEmitter<wbr>&lt;InputEvent&gt; | checkboxChange emitter

  ${formElemsPropsDoc}

`;
story.add(
  'Checkbox',
  () => {
    return {
      template: storyTemplate,
      props: {
        checkboxChange: action('checkboxChange'),
        value: boolean('value', true),
        indeterminate: boolean('indeterminate', false),
        ...FormElementsCommonProps('You have to', 'Check this'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          CheckboxModule,
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
