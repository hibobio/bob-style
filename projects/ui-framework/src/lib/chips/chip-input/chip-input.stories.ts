import { storiesOf } from '@storybook/angular';
import { text, array, boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipInputModule } from './chip-input.module';
import { mockHobbies, mockText } from '../../mock.const';
import { ButtonsModule } from '../../buttons/buttons.module';
import { FormElementsCommonProps } from '../../form-elements/form-elements.stories.common';

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

    ...FormElementsCommonProps(
      'What are your hobbies?',
      'Add tags and press ‘Enter’',
      mockText(30),
      'Props'
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

story.add('Chip Input', toAdd, { notes: { markdown: note } });

story2.add('Chip Input', toAdd, { notes: { markdown: note } });
