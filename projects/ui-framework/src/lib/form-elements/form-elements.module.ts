import { NgModule } from '@angular/core';
import { InputModule } from './input/input.module';
import { DatepickerModule } from './datepicker/datepicker.module';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';
import { TextareaModule } from './textarea/textarea.module';
import { TextareaComponent } from './textarea/textarea.component';
import { SearchModule } from '../navigation/search/search.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { MultiSelectComponent } from './lists/multi-select/multi-select.component';
import { SingleSelectComponent } from './lists/single-select/single-select.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { MultiSelectModule } from './lists/multi-select/multi-select.module';
import { SingleSelectModule } from './lists/single-select/single-select.module';

@NgModule({
  imports: [
    InputModule,
    TextareaModule,
    DatepickerModule,
    SearchModule,
    CheckboxModule,
    MultiSelectModule,
    SingleSelectModule,
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
