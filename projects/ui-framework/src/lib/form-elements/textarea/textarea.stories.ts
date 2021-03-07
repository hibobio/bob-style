import { storiesOf } from '@storybook/angular';
import { text, boolean, withKnobs, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TextareaModule } from './textarea.module';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { mockText } from '../../mock.const';

// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
// @ts-ignore: md file and not a module
import inputElemsPropsDoc from '../input.properties.md';
import { FormElementsCommonProps } from '../form-elements.stories.common';
import { rteMockHtml } from '../../../../bob-rte/src/rte/rte.mocks';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-textarea [value]="value||rteMockHtml"
            [label]="label"
            [description]="description"
            [placeholder]="placeholder"
            [maxChars]="maxChars"
            [minChars]="minChars"
            [showCharCounter]="showCharCounter"
            [readonly]="readonly"
            [disabled]="disabled"
            [required]="required"
            [hintMessage]="hintMessage"
            [warnMessage]="warnMessage"
            [errorMessage]="errorMessage"
            [focusOnInit]="focusOnInit"
            (inputEvents)="inputEvents($event)">
</b-textarea>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Textarea'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Textarea Element
  #### Module
  *TextareaModule* or *FormElementsModule*

  ~~~
  ${template}
  ~~~

  ${inputElemsPropsDoc}

  ${formElemsPropsDoc}
`;
story.add(
  'Textarea',
  () => {
    return {
      template: storyTemplate,
      props: {
        inputEvents: action('inputEvents'),
        value: text('value', ''),

        rteMockHtml: rteMockHtml,

        ...FormElementsCommonProps('Textarea label', 'Write something', ''),

        maxChars: number('maxChars', 100),
        minChars: number('minChars', 0),
        showCharCounter: boolean('showCharCounter', true),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          TextareaModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
