import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType, STORIES_KNOBS_OPTIONS } from '../../consts';
// @ts-ignore: md file and not a module
import formElemsPropsDoc from '../../form-elements/form-elements.properties.md';
import { FormElementsCommonProps } from '../../form-elements/form-elements.stories.common';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SwitchToggleModule } from './switch-toggle.module';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const template = `<b-switch-toggle [label]="label"
                 [placeholder]="placeholder"
                 [labelInFront]="labelInFront"
                 [value]="isChecked"
                 [disabled]="disabled"
                 [required]="required"
                 [hintMessage]="hintMessage"
                 [warnMessage]="warnMessage"
                 [errorMessage]="errorMessage"
                 (changed)="onChange($event)">
</b-switch-toggle>`;

const template2 = `<b-switch-toggle [isDisabled]="disabled"
                 [isChecked]="!isChecked"
                 [labelInFront]="labelInFront"
                 (switchChange)="onSwitchChange($event)">
  Toggle this!
</b-switch-toggle>`;

const note = `
  ## Switch toggle element
  #### Module
  *SwitchToggleModule*

  As form-element:

  ~~~
  ${template}
  ~~~

  Not as form-element:

  ~~~
  ${template2}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [value] aka <s>[isChecked]</s> | boolean | is switch toggle on | false
  [labelInFront] | boolean | if true, label/placeholder will be put in front of the toggle (vs default after) | false
  <s>(switchChange)</s> | EventEmitter<wbr>&lt;MatSlideToggleChange&gt; | (deprecated) toggle change event | &nbsp;
  (changed) | EventEmitter<wbr>&lt;boolean&gt; | toggle change event | &nbsp;

  ${formElemsPropsDoc}
`;

const storyTemplate = `
<b-story-book-layout [title]="'Switch toggle'">
  <div class="pad-x-40" style="max-width: 300px; text-align: left;">
      ${template}
      <br>And<br>
       ${template2}
  </div>
</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    onSwitchChange: action('switchChange', {
      depth: 1,
      clearOnStoryChange: true,
      allowFunction: false,
    }),
    onChange: action('changed'),
    isChecked: boolean('value (aka isChecked)', true),
    labelInFront: boolean('labelInFront', false),
    ...FormElementsCommonProps(
      'You have to',
      'Switch this',
      undefined,
      undefined,
      'Hint: use your mouse'
    ),
  },
  moduleMetadata: {
    imports: [SwitchToggleModule, StoryBookLayoutModule],
  },
});

story.add('Switch toggle', toAdd, {
  notes: { markdown: note },
  knobs: STORIES_KNOBS_OPTIONS
});
story2.add('Switch toggle', toAdd, {
  notes: { markdown: note },
  knobs:STORIES_KNOBS_OPTIONS
});
