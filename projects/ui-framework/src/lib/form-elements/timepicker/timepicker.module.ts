import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePickerComponent } from './timepicker.component';
import { InputMessageModule } from '../input-message/input-message.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { IconsModule } from '../../icons/icons.module';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';

@NgModule({
  declarations: [TimePickerComponent],
  imports: [
    CommonModule,
    InputMessageModule,
    IconsModule,
    FormElementLabelModule,
  ],
  exports: [TimePickerComponent],
  providers: [EventManagerPlugins[0]],
})
export class TimePickerModule {}
