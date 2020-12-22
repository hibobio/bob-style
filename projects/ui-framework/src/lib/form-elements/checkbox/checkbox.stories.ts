import { storiesOf } from '@storybook/angular';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from './checkbox.module';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { mockText } from '../../mock.const';

import { FormElementsCommonProps } from '../form-elements.stories.common';

// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-checkbox (checkboxChange)="checkboxChange($event)"
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
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [value] | boolean | start checkbox state
  [indeterminate] | boolean | indeterminate state
  (checkboxChange) | EventEmitter<wbr>&lt;InputEvent&gt; | checkboxChange emitter

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
  { notes: { markdown: note } }
);
