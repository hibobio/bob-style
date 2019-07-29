import { NgModule } from '@angular/core';
import { DatepickerComponent } from './datepicker.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IconsModule,
    InputMessageModule
  ],
  exports: [DatepickerComponent],
  entryComponents: [],
  providers: []
})
export class DatepickerModule {}
