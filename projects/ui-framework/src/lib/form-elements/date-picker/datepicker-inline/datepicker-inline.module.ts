import { ModuleWithProviders, NgModule } from '@angular/core';
import { DatepickerInlineComponent } from './datepicker-inline.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconsModule } from '../../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';
import { B_DATE_FORMATS } from '../dateadapter.mock';

@NgModule({
  declarations: [DatepickerInlineComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IconsModule,
  ],
  exports: [DatepickerInlineComponent],
  entryComponents: [],
  providers: [
    EventManagerPlugins[0],
    {
      provide: MAT_DATE_FORMATS,
      useValue: B_DATE_FORMATS,
    },
  ],
})
export class DatepickerInlineModule {
  static init(dateAdapter: any): ModuleWithProviders<DatepickerInlineModule> {
    return {
      ngModule: DatepickerInlineModule,
      providers: [
        {
          provide: DateAdapter,
          useClass: dateAdapter,
        },
      ],
    };
  }
}
