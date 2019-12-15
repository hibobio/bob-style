import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IconsModule } from '../../../../ui-framework/src/lib/icons/icons.module';
import { FormElementsTestComponent } from './form-elements.component';
import { AvatarModule } from '../../../../ui-framework/src/lib/avatar/avatar/avatar.module';
import { EventManagerPlugins } from '../../../../ui-framework/src/lib/services/utils/eventManager.plugins';
import { FormElemSmallTestComponent } from './frmelm-small-test.component';
import { InputModule } from '../../../../ui-framework/src/lib/form-elements/input/input.module';
import { TextareaModule } from '../../../../ui-framework/src/lib/form-elements/textarea/textarea.module';
import { DatepickerModule } from '../../../../ui-framework/src/lib/form-elements/date-picker/datepicker/datepicker.module';
import { DateRangePickerModule } from '../../../../ui-framework/src/lib/form-elements/date-picker/date-range-picker/date-range-picker.module';
import { RadioButtonModule } from '../../../../ui-framework/src/lib/form-elements/radio-button/radio-button.module';
import { CheckboxModule } from '../../../../ui-framework/src/lib/form-elements/checkbox/checkbox.module';
import { MultiSelectModule } from '../../../../ui-framework/src/lib/lists/multi-select/multi-select.module';
import { FormElementLabelModule } from '../../../../ui-framework/src/lib/form-elements/form-element-label/form-element-label.module';
import { ChipInputModule } from '../../../../ui-framework/src/lib/chips/chip-input/chip-input.module';
import { TimePickerModule } from '../../../../ui-framework/src/lib/form-elements/timepicker/timepicker.module';
import { SingleSelectModule } from '../../../../ui-framework/src/lib/lists/single-select/single-select.module';
import { SocialModule } from '../../../../ui-framework/src/lib/form-elements/social/social.module';
import { SplitInputSingleSelectModule } from '../../../../ui-framework/src/lib/form-elements/split-input-single-select/split-input-single-select.module';
import { InputMessageModule } from '../../../../ui-framework/src/lib/form-elements/input-message/input-message.module';
import { PasswordInputModule } from '../../../../ui-framework/src/lib/form-elements/password-input/password-input.module';
import { RichTextEditorModule } from '../../../../ui-framework/bob-rte/src/rte/rte.module';

@NgModule({
  declarations: [FormElementsTestComponent, FormElemSmallTestComponent],
  exports: [FormElementsTestComponent, FormElemSmallTestComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IconsModule,
    AvatarModule,
    InputModule,
    TextareaModule,
    DatepickerModule,
    DateRangePickerModule,
    RadioButtonModule,
    CheckboxModule,
    MultiSelectModule,
    SingleSelectModule,
    ChipInputModule,
    SocialModule,
    SplitInputSingleSelectModule,
    RichTextEditorModule,
    InputMessageModule,
    PasswordInputModule,
    TimePickerModule,
    ChipInputModule,
    FormElementLabelModule,
  ],
  providers: [EventManagerPlugins[0]],
})
export class FormElementsTestModule {}
