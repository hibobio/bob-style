import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { array, boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ButtonsModule } from '../../buttons/buttons.module';
import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
import { FormElementsCommonProps } from '../../form-elements/form-elements.stories.common';
import { mockHobbies, mockText } from '../../mock.const';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ChipInputModule } from './chip-input.module';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const options = mockHobbies();
const value = mockHobbies(4);

const template = `
  <b-chip-input [options]="options"
                [value]="value"
                [acceptNew]="acceptNew"
                [label]="label"
                [placeholder]="placeholder"
                [description]="description"
                [required]="required"
                [disabled]="disabled"
                [caseSensitive]="caseSensitive"
                [hintMessage]="hintMessage"
                [warnMessage]="warnMessage"
                [errorMessage]="errorMessage"
                [hasFooterAction]="true"
                [focusOnInit]="focusOnInit"
                (changed)="chipInputChangeHandler($event)">
      <b-text-button footerAction
          [text]="'Edit List'">
      </b-text-button>
  </b-chip-input>
`;

const note = `
  ## Chip Input
  #### Module
  *ChipInputModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [value] | string[] | array of selected chips | &nbsp;
  [options] | string[] | array of all possible chips | &nbsp;
  [acceptNew] | boolean | if the input accepts new entries | true
  [label] | string | label (on top of input) | &nbsp;
  [placeholder] | string | placeholder (inide input) | &nbsp;
  [description] | string | description text (above <i>i</i> icon) | &nbsp;
  [hintMessage] | string | text below input | &nbsp;
  [warnMessage] | string | warning text | &nbsp;
  [errorMessage] | string | error text | &nbsp;
  [required] | boolean | if input is required | false
  [disabled] | boolean | if input is disabled | false
  [caseSensitive] | boolean | case sensitive | false
  [validation] | ChipInputValidation / RegExp | you can pass RegExp to validate input or use preset for **<u>email</u>** input validation | &nbsp;
  &lt;elem footerAction&gt; | ng-content | element with attribute \`footerAction\` will be placed in the footer | &nbsp;
  (changed) | EventEmitter<wbr>&lt;ChipInputChange&gt; | emits on change: {value, added, removed} | &nbsp;


  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chip Input'">
  <div style="max-width:500px;">
    ${template}
  </div>

</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    value: array('value', value, ','),
    acceptNew: boolean('acceptNew', true),
    caseSensitive: boolean('caseSensitive', false),

    ...FormElementsCommonProps(
      'What are your hobbies?',
      'Add tags and press ‘Enter’',
      mockText(30),
      'Props'
    ),

    hintMessage: text(
      'hintMessage',
      'Use comma, semicolon, enter or tab keys to separate items'
    ),
    options: array('options', options, ','),
    chipInputChangeHandler: action('Chip input changed'),
  },
  moduleMetadata: {
    imports: [
      ChipInputModule,
      ButtonsModule,
      StoryBookLayoutModule,
      BrowserAnimationsModule,
    ],
  },
});

story.add('Chip Input', toAdd, {
  notes: { markdown: note },
  knobs:  STORIES_KNOBS_OPTIONS,
});

story2.add('Chip Input', toAdd, {
  notes: { markdown: note },
  knobs: STORIES_KNOBS_OPTIONS,
});
