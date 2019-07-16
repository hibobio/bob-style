import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  object,
  text,
  boolean
} from '@storybook/addon-knobs/angular';
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
import { UtilComponentsModule } from '../../../services/util-components/utilComponents.module';

const buttonStories = storiesOf(
  ComponentGroupType.FormElements,
  module
).addDecorator(withKnobs);

const template = `
<b-multi-select [label]="label"
                [placeholder]="placeholder"
                [options]="options"
                (selectChange)="selectChange($event)"
                (selectModified)="selectModified($event)"
                (selectCancelled)="selectCancelled($event)"
                [disabled]="disabled"
                [required]="required"
                [errorMessage]="errorMessage"
                [hintMessage]="hintMessage">
</b-multi-select>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi select'">
  <div style="flex:1; max-width: 350px;">
    ${template}
  </div>
  <b-stats></b-stats>
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
  selectChange | action | returns ListChange | none
  selectModified | action | returns ListChange | none
  selectCancelled | action | returns ListChange | none
  label | string | label text | none
  placeholder | string | placeholder text | none
  disabled | boolean | is field disabled | none
  required | boolean | is field required | none
  hintMessage | text | hint text | none
  errorMessage | text | error text | none
  showSingleGroupHeader | boolean | displays single group with group header | false

  ~~~
  ${template}
  ~~~
`;

const groupNum = 3;
const optionsNum = 4;

const optionsMock: SelectGroupOption[] = Array.from(Array(groupNum), (_, i) => {
  return {
    groupName: `Basic Info G${i} - header`,
    options: Array.from(Array(optionsNum), (_, k) => {
      return {
        value: `Basic Info G${i}_E${k} - option`,
        id: i * optionsNum + k,
        selected: false,
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

optionsMock[0].options[1].selected = true;
optionsMock[1].options[2].selected = true;

buttonStories.add(
  'Multi select',
  () => ({
    template: storyTemplate,
    props: {
      options: object<SelectGroupOption>('options', optionsMock),
      selectChange: action('Multi select change'),
      selectModified: action('Multi select modified'),
      selectCancelled: action('Multi select cancelled'),
      label: text('label', 'label text'),
      placeholder: text('placeholder', 'placeholder text'),
      disabled: boolean('disabled', false),
      required: boolean('required', false),
      hintMessage: text('hintMessage', 'This field should contain something'),
      errorMessage: text('errorMessage', ''),
      showSingleGroupHeader: boolean('showSingleGroupHeader', false)
    },
    moduleMetadata: {
      imports: [
        MultiSelectModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        AvatarModule,
        UtilComponentsModule
      ],
      entryComponents: [AvatarComponent]
    }
  }),
  { notes: { markdown: note } }
);
