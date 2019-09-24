import { NgModule } from '@angular/core';
import { DatepickerComponent } from './datepicker.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { DateParseService } from './date-parse.service';
import { FormElementKeyboardCntrlService } from '../services/keyboard-cntrl.service';
import { FormElementLabelModule } from '../form-element-label/form-element-label.module';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IconsModule,
    InputMessageModule,
    FormElementLabelModule,
  ],
  exports: [DatepickerComponent],
  entryComponents: [],
  providers: [
    FormElementKeyboardCntrlService,
    DateParseService,
    EventManagerPlugins[0]
  ]
})
export class DatepickerModule {}
