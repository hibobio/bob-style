import { NgModule } from '@angular/core';
import { InputModule } from './input/input.module';
import { DatepickerModule } from './datepicker/datepicker.module';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';
import { TextareaModule } from './textarea/textarea.module';
import { TextareaComponent } from './textarea/textarea.component';
import { SearchModule } from '../navigation/search/search.module';
import { SelectModule } from './select';
import { CheckboxModule } from './checkbox/checkbox.module';
import { MultiSelectComponent } from './select/multi-select/multi-select.component';
import { SingleSelectComponent } from './select/single-select/single-select.component';
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  imports: [
    InputModule,
    TextareaModule,
    DatepickerModule,
    SearchModule,
    SelectModule,
    CheckboxModule,
  ],
  exports: [
    InputComponent,
    TextareaComponent,
    DatepickerComponent,
    MultiSelectComponent,
    SingleSelectComponent,
    CheckboxComponent,
  ],
})
export class FormElementsModule {
}
