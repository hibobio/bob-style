import { NgModule } from '@angular/core';
import { InputModule } from './input/input.module';
import { DatepickerModule } from './datepicker';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { InputComponent } from './input/input.component';
import { TextareaModule } from './textarea/textarea.module';
import { TextareaComponent } from './textarea/textarea.component';

@NgModule({
  imports: [
    InputModule,
    TextareaModule,
    DatepickerModule,
  ],
  exports: [
    InputComponent,
    TextareaComponent,
    DatepickerComponent,
  ],
})
export class FormElementsModule {
}
