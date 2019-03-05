import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { select, withKnobs, object, text, boolean, array } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { MultiSelectModule } from './multi-select.module';
import { SelectGroupOption } from '../list.interface';
import { AvatarComponent } from '../../../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../../../buttons-indicators/avatar/avatar.module';

const buttonStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-multi-select style="width: 400px;"
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
</b-multi-select>
`;

const storyTemplate = `
<b-story-book-layout title="Multi select">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Multi Select

  #### Module
  *MultiSelectModule*

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

const optionsMock: SelectGroupOption[] = Array.from(Array(3), (_, i) => {
  return {
    groupName: `Basic Info G${i} - header`,
    options: Array.from(Array(4), (_, k) => {
      return {
        value: `Basic Info G${i}_E${k} - option`,
        id: i * 4 + k,
        prefixComponent: {
          component: AvatarComponent,
          attributes: {
            imageSource:
              'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'
          }
        }
      };
    })
  };
});

buttonStories.add(
  'Multi select',
  () => ({
    template: storyTemplate,
    props: {
      options: object<SelectGroupOption>('options', optionsMock),
      value: array('value', [2]),
      selectChange: action(),
      label: text('label', 'label text'),
      disabled: boolean('disabled', false),
      required: boolean('required', false),
      hintMessage: text('hintMessage', 'This field should contain something'),
      errorMessage: text('errorMessage', ''),
      showSingleGroupHeader: boolean('showSingleGroupHeader', false),
      hideLabelOnFocus: boolean('hideLabelOnFocus', false),
    },
    moduleMetadata: {
      imports: [
        MultiSelectModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        AvatarModule
      ],
      entryComponents: [AvatarComponent]
    }
  }),
  { notes: { markdown: note } }
);
