import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { InputMessageModule } from '../input-message/input-message.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';
import { FiltersModule } from '../../services/filters/filters.module';

@NgModule({
  declarations: [InputComponent],
  imports: [
    CommonModule,
    InputMessageModule,
    FormElementLabelModule,
    FiltersModule,
  ],
  exports: [InputComponent],
  providers: [EventManagerPlugins[0]],
})
export class InputModule {}
