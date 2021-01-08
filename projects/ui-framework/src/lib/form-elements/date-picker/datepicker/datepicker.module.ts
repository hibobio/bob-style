import { ModuleWithProviders, NgModule } from '@angular/core';
import { DatepickerComponent } from './datepicker.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconsModule } from '../../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InputMessageModule } from '../../input-message/input-message.module';
import { EventManagerPlugins } from '../../../services/utils/eventManager.plugins';
import { FormElementLabelModule } from '../../form-element-label/form-element-label.module';
import { B_DATE_FORMATS } from '../dateadapter.mock';
import { DateInputDirectiveModule } from '../date-input-directive/dateinput.directive.module';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IconsModule,
    InputMessageModule,
    FormElementLabelModule,
    DateInputDirectiveModule,
  ],
  exports: [DatepickerComponent],
  entryComponents: [],
  providers: [
    EventManagerPlugins[0],
    {
      provide: MAT_DATE_FORMATS,
      useValue: B_DATE_FORMATS,
    },
  ],
})
export class DatepickerModule {
  static init(dateAdapter: any): ModuleWithProviders<DatepickerModule> {
    return {
      ngModule: DatepickerModule,
      providers: [
        {
          provide: DateAdapter,
          useClass: dateAdapter,
        },
      ],
    };
  }
}
