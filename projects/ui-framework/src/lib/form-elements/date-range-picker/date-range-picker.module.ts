import { ModuleWithProviders, NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../input-message/input-message.module';
import { DateRangePickerComponent } from './date-range-picker.component';
import { DateParseService } from '../datepicker/date-parse.service';
import { EventManagerPlugins } from '../../services/utils/eventManager.plugins';
import { B_DATE_FORMATS } from '../datepicker/date.adapter';

@NgModule({
  declarations: [DateRangePickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IconsModule,
    InputMessageModule
  ],
  exports: [DateRangePickerComponent],
  entryComponents: [],
  providers: [DateParseService, EventManagerPlugins[0], {
    provide: MAT_DATE_FORMATS,
    useValue: B_DATE_FORMATS,
  }]
})
export class DateRangePickerModule {
  static init(dateAdapter: any): ModuleWithProviders {
    return {
      ngModule: DateRangePickerModule,
      providers: [
        {
          provide: DateAdapter,
          useClass: dateAdapter,
        },
      ]
    };
  }
}
