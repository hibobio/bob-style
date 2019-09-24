import { NgModule } from '@angular/core';
import { InputModule } from './input/input.module';
import { InputComponent } from './input/input.component';
import { DatepickerModule } from './datepicker/datepicker.module';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { TextareaModule } from './textarea/textarea.module';
import { TextareaComponent } from './textarea/textarea.component';
import { CheckboxModule } from './checkbox/checkbox.module';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { MultiSelectModule } from './lists/multi-select/multi-select.module';
import { MultiSelectComponent } from './lists/multi-select/multi-select.component';
import { SingleSelectModule } from './lists/single-select/single-select.module';
import { SingleSelectComponent } from './lists/single-select/single-select.component';
import { SocialModule } from './social/social.module';
import { SocialComponent } from './social/social.component';
import { InputMessageModule } from './input-message/input-message.module';
import { ChipInputModule } from '../chips/chip-input/chip-input.module';
import { ChipInputComponent } from '../chips/chip-input/chip-input.component';
import { RadioButtonModule } from './radio-button/radio-button.module';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { SplitInputSingleSelectModule } from './split-input-single-select/split-input-single-select.module';
import { SplitInputSingleSelectComponent } from './split-input-single-select/split-input-single-select.component';
import { RichTextEditorModule } from './rich-text-editor/rte.module';
import { RichTextEditorComponent } from './rich-text-editor/rte.component';
import { PasswordInputModule } from './password-input/password-input.module';
import { PasswordInputComponent } from './password-input/password-input.component';
import { TimePickerModule } from './timepicker/timepicker.module';
import { TimePickerComponent } from './timepicker/timepicker.component';
import { EventManagerPlugins } from '../services/utils/eventManager.plugins';
import { FormElementLabelModule } from './form-element-label/form-element-label.module';

@NgModule({
  imports: [
    InputModule,
    TextareaModule,
    DatepickerModule,
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
  exports: [
    InputComponent,
    TextareaComponent,
    DatepickerComponent,
    RadioButtonComponent,
    CheckboxComponent,
    MultiSelectComponent,
    SingleSelectComponent,
    SplitInputSingleSelectComponent,
    RichTextEditorComponent,
    ChipInputComponent,
    SocialComponent,
    PasswordInputComponent,
    TimePickerComponent,
    ChipInputComponent
  ],
  providers: [EventManagerPlugins[0]]
})
export class FormElementsModule {
}
