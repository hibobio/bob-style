import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconsModule } from '../../icons/icons.module';
import { SingleSelectModule } from '../../lists/single-select/single-select.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';
import { InputMessageModule } from '../input-message/input-message.module';
import { TimePickerComponent } from './timepicker.component';

@NgModule({
  declarations: [TimePickerComponent],
  imports: [
    CommonModule,
    InputMessageModule,
    IconsModule,
    FormElementLabelModule,
    SingleSelectModule,
  ],
  exports: [TimePickerComponent],
  providers: [EventManagerPlugins[0]],
})
export class TimePickerModule {}
