import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconsModule } from '../../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../../input-message/input-message.module';
import { DateRangePickerComponent } from './date-range-picker.component';
import { DateParseService } from '../date-parse-service/date-parse.service';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';
import { B_DATE_FORMATS } from '../dateadapter.mock';
import { DateInputDirectiveModule } from '../date-input-directive/dateinput.directive.module';

@NgModule({
  declarations: [DateRangePickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IconsModule,
    InputMessageModule,
    DateInputDirectiveModule,
  ],
  exports: [DateRangePickerComponent],
  entryComponents: [],
  providers: [
    DateParseService,
    EventManagerPlugins[0],
    {
      provide: MAT_DATE_FORMATS,
      useValue: B_DATE_FORMATS,
    },
  ],
})
export class DateRangePickerModule {
  static init(dateAdapter: any): ModuleWithProviders<DateRangePickerModule> {
    return {
      ngModule: DateRangePickerModule,
      providers: [
        {
          provide: DateAdapter,
          useClass: dateAdapter,
        },
      ],
    };
  }
}
