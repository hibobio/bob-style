import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { object, select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { mockAnimals, mockText } from '../../mock.const';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../form-elements.properties.md';
import { FormElementsCommonProps } from '../form-elements.stories.common';
import { RadioDirection } from './radio-button.enum';
import { RadioButtonModule } from './radio-button.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `
<b-radio-button [radioConfig]="options"
                [value]="value"
                [label]="label"
                [direction]="direction"
                [disabled]="disabled"
                [required]="required"
                [readonly]="readonly"
                [hintMessage]="hintMessage"
                [warnMessage]="warnMessage"
                [errorMessage]="errorMessage"
                [focusOnInit]="focusOnInit"
                (changed)="radioChange($event)">
</b-radio-button>
`;

const stroyTemplate = `
<b-story-book-layout [title]="'Radio Buttons'">
    ${template}
</b-story-book-layout>`;

const note = `
  ## Radio Button Element
  #### Module
  *RadioButtonModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [radioConfig] | RadioConfig[] | list of RadioConfig ({id, label}) objects
  [value] | RadioConfig | selected option
  [direction] | RadioDirection | column or row, default=row
  (changed) <s>(radioChange)</s> | EventEmitter<wbr>&lt;string/number&gt; | fired on radio change, returns option ID

  #### interface RadioConfig
  Name | Type | Description
  --- | --- | ---
  id | number / string | option id (will also be used for label, if label is missing)
  label | string | option label
  describtion | string | text for describtion tooltip (for (i) icon)

  ${formElemsPropsDoc}

`;

story.add(
  'Radio Button',
  () => {
    return {
      template: stroyTemplate,
      props: {
        value: object('value', { id: 0 }),
        direction: select(
          'direction',
          Object.values(RadioDirection),
          RadioDirection.row
        ),

        ...FormElementsCommonProps('Radio label', '', ''),

        radioChange: action('radioChange'),

        options: object('radioConfig', [
          { id: 0, label: mockAnimals(1), description: mockText(15) },
          { id: 1, label: mockAnimals(1) },
          { id: 2, label: mockAnimals(1) },
        ]),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          RadioButtonModule,
          StoryBookLayoutModule,
        ],
      },
    };
  },
  {
    notes: { markdown: note },
    knobs: {
      timestamps: true,
      escapeHTML: false,
    },
  }
);
