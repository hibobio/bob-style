import { storiesOf } from '@storybook/angular';
import {
  boolean,
  number,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleSelectModule } from './single-select.module';
import { SelectGroupOption } from '../list.interface';
import { mockText } from '../../../mock.const';

const story = storiesOf(ComponentGroupType.FormElements, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-single-select [label]="label"
                 [placeholder]="placeholder"
                 [description]="description"
                 [options]="options"
                 (selectChange)="selectChange($event)"
                 [disabled]="disabled"
                 [required]="required"
                 [errorMessage]="errorMessage"
                 [hintMessage]="hintMessage"
                 [showSingleGroupHeader]="showSingleGroupHeader">
                 <b-text-button footer
                    [text]="'Click Me!'"
                    [color]="'primary'"
                    style="margin-left: auto">
                  </b-text-button>
</b-single-select>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single select'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single Select 2

  #### Module
  *SingleSelectModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  options | SelectGroupOption[] | model of selection group | none
  value | (string or number) | selected id | none
  selectChange | action | returns ListChange | none
  label | string | label text | none
  description | string | description text (above icon)
  placeholder | string | placeholder text | none
  disabled | boolean | is field disabled | none
  required | boolean | is field required | none
  hintMessage | text | hint text | none
  errorMessage | text | error text | none
  showSingleGroupHeader | boolean | displays single group with group header | false
  showNoneOption | boolean | displays the no-selection option | true

  ~~~
  ${template}
  ~~~
`;

const groupNum = 6;
const optionsNum = 3;

const optionsMock: SelectGroupOption[] = Array.from(Array(groupNum), (_, i) => {
  return {
    groupName: `Personal G${i}`,
    options: Array.from(Array(optionsNum), (_, k) => {
      return {
        value:
          k % 2 === 0
            ? `Personal G${i}_E${k} and some other very long text and some more words to have ellipsis and tooltip`
            : `Personal G${i}_E${k}`,
        id: i * optionsNum + k,
        selected: false
      };
    })
  };
});

optionsMock[0].options[1].selected = true;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    selectChange: action('Single select change'),
    label: text('label', 'label text'),
    description: text('description', mockText(30)),
    placeholder: text('placeholder', 'placeholder text'),
    disabled: boolean('disabled', false),
    required: boolean('required', false),
    hintMessage: text('hintMessage', 'This field should contain something'),
    errorMessage: text('errorMessage', ''),
    showSingleGroupHeader: boolean('showSingleGroupHeader', true),
    options: object<SelectGroupOption>('options', optionsMock)
  },
  moduleMetadata: {
    imports: [
      SingleSelectModule,
      ButtonsModule,
      TypographyModule,
      BrowserAnimationsModule,
      StoryBookLayoutModule
    ]
  }
});

story.add('Single select', toAdd, { notes: { markdown: note } });
story2.add('Single select', toAdd, { notes: { markdown: note } });
