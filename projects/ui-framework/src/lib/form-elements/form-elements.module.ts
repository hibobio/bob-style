import { NgModule } from '@angular/core';
import { InputModule } from './input/input.module';
import { DatepickerModule } from './datepicker/datepicker.module';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';
import { TextareaModule } from './textarea/textarea.module';
import { TextareaComponent } from './textarea/textarea.component';
import { SearchModule } from './search/search.module';
import { SelectModule } from './select-elements/select.module';
import { CheckboxModule } from './checkbox/checkbox.module';

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
  ],
})
export class FormElementsModule {
}
