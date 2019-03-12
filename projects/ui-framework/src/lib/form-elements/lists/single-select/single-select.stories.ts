import { storiesOf } from '@storybook/angular';
import { select, withKnobs, object, text, boolean, number } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleSelectModule } from './single-select.module';
import { SelectGroupOption } from '../list.interface';

const buttonStories = storiesOf(ComponentGroupType.FormElements, module).addDecorator(withKnobs);

const template = `
<b-single-select style="width: 400px;"
                 [label]="label"
                 [options]="options"
                 [value]="value"
                 (selectChange)="selectChange($event)"
                 [disabled]="disabled"
                 [required]="required"
                 [errorMessage]="errorMessage"
                 [hintMessage]="hintMessage"
                 [showSingleGroupHeader]="showSingleGroupHeader"
                 [hideLabelOnFocus]="hideLabelOnFocus">
</b-single-select>
`;

const storyTemplate = `
<b-story-book-layout title="Single select">
  ${template}
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
  selectChange | action | returns selected id | none
  label | string | label text | none
  disabled | boolean | is field disabled | none
  required | boolean | is field required | none
  hintMessage | text | hint text | none
  errorMessage | text | error text | none
  showSingleGroupHeader | boolean | displays single group with group header | false
  hideLabelOnFocus | boolean | hides label instead of top | false

  ~~~
  ${template}
  ~~~
`;

const optionsMock = Array.from(Array(2), (_, i) => {
  return {
    groupName: `Personal G${i}`,
    options: Array.from(Array(3), (_, k) => {
      return {
        value:
          k % 2 === 0
            ? `Personal G${i}_E${k} and some other very long text and some more words to have ellipsis and tooltip`
            : `Personal G${i}_E${k}`,
        id: i * 4 + k
      };
    })
  };
});

buttonStories.add(
  'Single select',
  () => ({
    template: storyTemplate,
    props: {
      options: object<SelectGroupOption>('options', optionsMock),
      value: number('value', null),
      selectChange: action(),
      label: text('label', 'label text'),
      disabled: boolean('disabled', false),
      required: boolean('required', false),
      hintMessage: text('hintMessage', 'This field should contain something'),
      errorMessage: text('errorMessage', ''),
      showSingleGroupHeader: boolean('showSingleGroupHeader', false),
      hideLabelOnFocus: boolean('hideLabelOnFocus', false)
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
  }),
  { notes: { markdown: note } }
);
